FROM python:3.12-slim

# Cleaner logs + no .pyc clutter
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /code

# Install Deps First
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#Copy app code
COPY app ./app

#Serve. ML_API_URL (docker compose)
EXPOSE 8000
CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]