# pull official base image
FROM python:3.11

# set work directory
WORKDIR /usr/src/app


# install dependencies
RUN apt update; apt install -y libgl1

# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir   

# copy project
COPY . .

CMD ["flask", "run"]