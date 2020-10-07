FROM python:3.6-alpine
WORKDIR /usr/src/app
RUN pip install --no-cache-dir boto3
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
ENV PYTHONPATH=/usr/src/app
COPY . .
