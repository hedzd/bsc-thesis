import torch
import numpy as np
from .models.st_gcn.st_gcn import Model as stgcn_model
from .models.mst_gcn.model.AEMST_GCN import Model as mstgcn_model
import os

model_configs = {'stgcn_uniform': {'model': 'stgcn', 'num_c': 3, 'weight_func': 'uniform', 'weight': 'stgcn_uniform'},
                 'stgcn_distance': {'model': 'stgcn', 'num_c': 3, 'weight_func': 'distance', 'weight': 'stgcn_dist'},
                 'stgcn_filterv': {'model': 'stgcn', 'num_c': 2, 'weight_func': 'uniform', 'weight': 'stgcn_filterv'},
                 'mstgcn_uniform': {'model': 'mstgcn', 'num_c': 3, 'weight_func': 'spatial', 'weight': 'mstgcn_spatial'},
                 'mstgcn_spatial': {'model': 'mstgcn', 'num_c': 3, 'weight_func': 'spatial', 'weight': 'mstgcn_spatial'},
                 'mstgcn_filterv': {'model': 'mstgcn', 'num_c': 2, 'weight_func': 'spatial', 'weight': 'mstgcn_filterv'}}

classes = ['archery', 'bench pressing', 'bouncing on trampoline', 'bowling', 'clapping',
           'climbing a rope', 'cracking neck', 'crawling baby', 'dancing macarena',
           'disc golfing', 'doing aerobics', 'dribbling basketball',
           'dunking basketball', 'grinding meat', 'hammer throw', 'high jump',
           'high kick', 'hockey stop', 'hurdling', 'jogging', 'jumping into pool',
           'kicking soccer ball', 'playing drums', 'playing tennis', 'playing ukulele',
           'playing violin', 'pole vault', 'presenting weather forecast', 'pull ups',
           'recording music', 'riding mechanical bull', 'riding or walking with horse',
           'robot dancing', 'running on treadmill', 'shearing sheep', 'skiing slalom',
           'sword fighting', 'tying bow tie']


def stgcn_eval(input_data, model_type):
    values = model_configs[model_type]
    num_classes = 38
    print(f'Strating prediction using model: {model_type}')

    # define model
    if values['model'] == 'stgcn':
        model = stgcn_model(values['num_c'], num_classes,
                            True, ('mediapose', values['weight_func'],))
    elif values['model'] == 'mstgcn':
        basic_channels = 32
        cfgs = {
            'num_class': num_classes,
            'num_point': 33,
            'num_person': 1,
            'block_args': [[values['num_c'], basic_channels, False, 1],
                           [basic_channels, basic_channels, True, 1], [
                               basic_channels, basic_channels, True, 1], [basic_channels, basic_channels, True, 1],
                           [basic_channels, basic_channels*2, True, 1], [basic_channels*2,
                                                                         basic_channels*2, True, 1], [basic_channels*2, basic_channels*2, True, 1],
                           [basic_channels*2, basic_channels*4, True, 1], [basic_channels*4, basic_channels*4, True, 1], [basic_channels*4, basic_channels*4, True, 1]],
            'graph': 'mediapipe',
            'graph_args': {'labeling_mode': values['weight_func']},
            'kernel_size': 9, 'block_type': 'ms', 'reduct_ratio': 2, 'expand_ratio': 0, 't_scale': 4,
            'layer_type': 'sep', 'act': 'relu', 's_scale': 4, 'atten': 'stcja', 'bias': True}
        model = mstgcn_model(**cfgs)
    else:
        raise Exception('Invalid model type')

    # load weights
    weight_path = os.path.join(os.path.dirname(
        __file__) + '/weights/' + values['weight'])
    model.load_state_dict(torch.load(weight_path, map_location='cpu'))

    # set model to evaluation mode
    model.to("cpu", dtype=float)
    model.eval()

    # preprocess data
    print('starting input data preprocess')
    input_data = preprocess(input_data)
    x = torch.tensor(input_data)

    if values['num_c'] == 2:
        x = x[..., [0, 1]]
    # print(x.size()) # B=batch size, T, V, C=3
    x = torch.permute(x, (0, 3, 1, 2))  # B=batch size, C=2, T, V
    x = torch.unsqueeze(x, dim=-1)
    print(f'input tensor size {x.size()}')

    # call model
    output = model(x)

    # apply log softmax
    m = torch.nn.LogSoftmax(dim=1)

    if values['model'] == 'stgcn':
        output = m(output)
    elif values['model'] == 'mstgcn':
        output = m(output[1])

    y_pred = output.argmax(-1)
    y_pred_class = classes[y_pred]
    return y_pred, y_pred_class


def repeat_array_to_length(arr, target_length):
    repeats = int(np.ceil(target_length / arr.shape[0]))
    repeated_arr = np.tile(arr, (repeats, 1))
    result = repeated_arr[:target_length, :]
    return result


def preprocess(raw_data):
    num_features = 3
    num_nodes = 33

    raw_data = np.expand_dims(raw_data, axis=0)
    print(raw_data.shape)

    num_frames = [r.shape[0] for r in raw_data]
    max_frame = 300
    num_samples = 1
    data = np.zeros((num_samples, max_frame, num_nodes,
                    num_features))  # N, T, V, C
    print('Make N, T, V, C with zeros', flush=True)

    for idx, r in enumerate(raw_data):
        # print(f'start processing data with index {idx}')
        # Eliminate completely nan frames
        # if config.filter_nan_frames:
        r = r[~np.isnan(r).any(axis=1), :]

        # Padding frames
        r = repeat_array_to_length(r, 300)

        sample_feature = np.stack(
            np.split(r, num_nodes, axis=1), axis=1)  # T, V, C
        # print(sample_feature.shape)

        data[idx, :] = sample_feature
        # print(f'finish processing data with index {idx}')

    print(f'Shape change to N,T,V,C format, shape: {data.shape}', flush=True)

    return data
