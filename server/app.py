from flask_cors import CORS
from flask_socketio import SocketIO, join_room, emit
from flask import Flask, request
from utils import s3
from pose import pose_estimator



app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=True)


@app.route('/new', methods=["POST"])
def newVideo():
    pose = request.form.get('pose', 'mediapipe')
    action = request.form.get('action', 'st-gcn')

    if 'video' not in request.files:
        return "No Videos Added", 400

    filename = s3.upload_file_to_s3(request.files['video'])
    pose_estimator.extract_pose(pose, socketio, filename)
    return filename


@socketio.on('join')
def join(data):
    join_room(data)
    print("Joined", data)
    return 'done'


@app.route('/')
def hello():
    return '<h1>Hello, World!</h1>'


@app.route('/emit')
def test_emit():
    socketio.emit(
        "skeleton", "https://hedieh-uploads.s3.ir-thr-at1.arvanstorage.ir/1686569658.mp4")
    return 'Sent'


@app.route('/emit2')
def test_emit2():
    socketio.emit(
        "result", {'model': 'Omiid', 'result': 'Gher'})
    return 'Sent'


@app.route('/test')
def test():
    url = pose_estimator.pose_video_extractor(
        'mediapipe', "https://hedieh-uploads.s3.ir-thr-at1.arvanstorage.ir/1686569658.mp4")
    print(url)
    return url
