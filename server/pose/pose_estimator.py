import urllib.request
import time
import os
from utils import s3
from math import floor
from .mediapipe_pose import mediapipe_pose
import threading


def extract_pose(socketio, input_file):
    threading.Thread(target=pose_video_extractor,
                     args=('mediapipe', input_file, socketio)).start()


def pose_video_extractor(method, input_file, socketio):
    time.sleep(1)
    input_url = os.getenv('AWS_UPLOADS_BUCKET') + '/' + input_file
    out_dir = '/tmp/'
    file_name = str(floor(time.time()))
    file_format = '.mp4'
    dl_file_addr = out_dir + file_name + file_format
    annotated_addr = f'{out_dir}{file_name}_annotated_mp{file_format}'

    urllib.request.urlretrieve(input_url, dl_file_addr)

    if method == 'mediapipe':
        annotated_addr = f'{out_dir}{file_name}_annotated_mp{file_format}'
        mediapipe = mediapipe_pose()
        mediapipe.save_extract_pose(dl_file_addr, annotated_addr)

    skeleton = s3.upload_addr_to_s3(annotated_addr, 'skeleton')
    socketio.emit(
        "skeleton", os.getenv('AWS_UPLOADS_BUCKET') + '/' + skeleton, to=input_file)
    print("Emitted", skeleton, input_file)
