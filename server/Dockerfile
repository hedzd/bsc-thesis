FROM jjanzic/docker-python3-opencv:latest

WORKDIR /usr/app

# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir   

# copy project
COPY . .

CMD ["flask", "run", "--host=0.0.0.0"]