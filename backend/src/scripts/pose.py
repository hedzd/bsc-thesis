from pose import pose_estimator
import sys

if __name__ == '__main__':
    file = sys.argv[1]
    method = sys.argv[2]
    if not file:
        raise Exception("No file")
    pose_estimator.pose_video_extractor(file, method)
