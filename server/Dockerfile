# pull official base image
FROM python:3.11

# set work directory
WORKDIR /usr/src/app


# install dependencies
RUN apt update; apt install -y libgl1 build-essential cmake git python3-dev python3-numpy \
    libavcodec-dev libavformat-dev libswscale-dev \
    libgstreamer-plugins-base1.0-dev \
    libgstreamer1.0-dev libgtk-3-dev \
    libpng-dev libjpeg-dev libopenexr-dev libtiff-dev libwebp-dev \
    libopencv-dev x264 libx264-dev libssl-dev ffmpeg python3-opencv

# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir   

# copy project
COPY . .

CMD ["flask", "run", "--host=0.0.0.0"]