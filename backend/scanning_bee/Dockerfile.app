FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /scanning_bee
COPY scanning_bee/ ./

COPY requirements2.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements2.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
