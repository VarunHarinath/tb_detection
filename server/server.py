from fastapi import FastAPI
from routes.HomeRoute import router as home_router
from routes.PredictRoute import router as predict_router
from schemas.BaseModel import ErrorRoute

WebServer = FastAPI()

WebServer.include_router(home_router)
WebServer.include_router(predict_router)

@WebServer.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
def error_route(full_path: str):
    return ErrorRoute(path=full_path, message="Path Not Found")