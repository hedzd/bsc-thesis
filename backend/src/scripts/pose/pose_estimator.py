import time
from math import floor
from .mediapipe_pose import mediapipe_pose
from .openpose.demo import extract_pose as openpose_extract_pose


def pose_video_extractor(input_url, method):
    out_dir = '/tmp/'
    file_name = str(floor(time.time()))
    file_format = '.mp4'
    annotated_addr = ''

    if method == 'mediapipe':
        annotated_addr = f'{out_dir}{file_name}_annotated_mp{file_format}'
        mediapipe = mediapipe_pose()
        mediapipe.save_extract_pose(input_url, annotated_addr)

    if method == 'openpose':
        annotated_addr = f'{out_dir}{file_name}_annotated_op{file_format}'
        openpose_extract_pose(input_url, annotated_addr)

    print("Output:", annotated_addr)
