#!/usr/bin/bash
gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -b 0.0.0.0:5000 -w 1 app:app