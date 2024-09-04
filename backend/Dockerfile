# Base image
FROM python:3.12-slim

# Working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY . .

# Expose the server port
EXPOSE 8080
ENV API_CLIENT_ID=wca_client_id
ENV API_CLIENT_SECRET=wca_client_secret

RUN python create_db.py

# Command to start the server
CMD python data_generator.py & gunicorn -b 0.0.0.0:8080 api:app