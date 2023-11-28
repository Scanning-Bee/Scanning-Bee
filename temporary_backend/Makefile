# Makefile for FastAPI Application

# Define the name of your FastAPI module (the Python file where your app is defined).
APP_MODULE = annotate_db_api

# Define the default host and port for the FastAPI server.
HOST = 0.0.0.0
PORT = 8000

# Define Docker-related variables.
MYSQL_ROOT_PASSWORD = passwordroot
MYSQL_DATABASE = annotationdb
MYSQL_USER = user
MYSQL_PASSWORD = password

# Command to run the FastAPI application.
RUN_COMMAND = uvicorn $(APP_MODULE):app --host $(HOST) --port $(PORT) --reload

# Command to run the FastAPI application in production (without auto-reloading).
RUN_PROD_COMMAND = uvicorn $(APP_MODULE):app --host $(HOST) --port $(PORT)

# Command to install dependencies.
INSTALL_DEPS_COMMAND = pip install -r requirements.txt

# Command to clean up generated files and directories.
CLEAN_COMMAND = rm -rf __pycache__ .pytest_cache

# Command to build and run the Docker containers.
DOCKER_COMPOSE_COMMAND = docker-compose up -d

# Command to stop and remove Docker containers.
DOCKER_COMPOSE_DOWN_COMMAND = docker-compose down

default: install-deps

# Target to run the FastAPI application with auto-reloading.
run:
	$(RUN_COMMAND)

# Target to run the FastAPI application in production (no auto-reloading).
run-prod:
	$(RUN_PROD_COMMAND)

# Target to install project dependencies.
install-deps:
	$(INSTALL_DEPS_COMMAND)

# Target to clean up generated files and directories.
clean:
	$(CLEAN_COMMAND)

# Target to start Docker containers.
docker-up:
	docker compose up -d

# Target to stop and remove Docker containers.
docker-down:
	docker compose down

.PHONY: run run-prod lint test install-deps clean docker-up docker-down
