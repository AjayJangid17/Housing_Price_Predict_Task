ML_API to RUN
services:
cd services/ml/api
python -m app.train
uvicorn app.main:app --reload

Estimator
services:
cd services/ml/estimator-api
uvicorn app.main:app --reload

#docker commands

#1. build both images -> 
services/ml-api;   docker build -t ml-api .
services/estimator-api;   docker build -t estimator-api .

#2. Create a shared network
docker network create housing

#3.Run ml-api on the network
docker run -d --name ml-api --network housing -p 8000:8000 ml-api

#4. Run estimator, pointing at ml-api by its container name (map host 8001 ->. container 8000, point it at ml-api)
docker run -d --name estimator-api --network housing -p 8001:800 -e ML_API_URL=http://ml-api:8000 estimator-api

#Cleanup when done
docker rm -f ml-api estimator-api; docker network rm housing

#Openspec
openspec init

#kill port
(lsof -ti :8000 | xargs -r kill -9 || true) && echo 'PORT_8000_CLEARED'


#all Api's
FastAPI services
-> ml-api
main.py
GET /health
POST /predict
POST /predict/batch
GET /model-info

->estimator-api
main.py
GET /health
POST /estimate
POST /estimate/compare
GET /estimate/history

Java Spring Boot service

MarketController.java
GET /health
GET /market/summary
GET /market/properties
POST /market/what-if
GET /market/export