from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.HomeRoute import router as home_router
from routes.PredictRoute import router as predict_router
from schemas.BaseModel import ErrorRoute

WebServer = FastAPI()

WebServer.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


WebServer.include_router(home_router)
WebServer.include_router(predict_router)


@WebServer.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
def error_route(full_path: str):
    return ErrorRoute(path=full_path, message="Path Not Found")