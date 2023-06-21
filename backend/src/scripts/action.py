from action import action_recognitions
import sys

if __name__ == '__main__':
    file = sys.argv[1]
    method = sys.argv[2]
    if not file:
        raise Exception("No file")
    action_recognitions.recognize_action(file, method)
