FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /scanning_bee

COPY backend/ ./backend/
COPY AI/ ./AI/

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Set the working directory to the location of manage.py
WORKDIR /scanning_bee/backend/scanning_bee

# # Use CMD to run the Django development server
# CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
