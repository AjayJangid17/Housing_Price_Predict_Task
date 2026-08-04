FROM python:3.12-slim

#Cleaner logs + no .pyc clutter
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /code

#1. Install deps FIRST (own layer -> cached unless requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#2. Copy app code + the training data
COPY app ./app
COPY data ./data

#3. Train at build time -> prodcues /code/models/model.joblib
RUN python -m app.train

#4. Serve. Re-trains at container start only if models/model.joblib is missing
# (e.g. when a fresh volume is mounted over /code/models)
EXPOSE 8000
CMD ["sh", "-c", "test -f models/model.joblib || python -m app.train; exec uvicorn app.main:app --host 0.0.0.0 --port 8000"]