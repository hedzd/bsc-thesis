FROM jjanzic/docker-python3-opencv:latest

WORKDIR /usr/app

RUN apt-get update && apt-get install -y libgl1 libsm6 libxext6 python3-opencv

# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir   

# copy project
COPY . .

CMD ["flask", "run", "--host=0.0.0.0"]