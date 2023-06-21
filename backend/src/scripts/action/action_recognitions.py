from .eval_models import stgcn_eval
from pose.mediapipe_pose import mediapipe_pose


def recognize_action(input_file, method):
    mp = mediapipe_pose()
    _, frames_keypoints, _ = mp.extract_pose_keypoints(input_file)
    print(frames_keypoints.shape)
    print('skeleton keypoints extracted')
    y_pred, y_pred_class = stgcn_eval(frames_keypoints, method)
    print("Action:", y_pred_class)
    print(y_pred)
