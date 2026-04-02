from pydantic import BaseModel


class HomeResponse(BaseModel):
    service: str
    version: str
    model: str
    status: str


class ErrorRoute(BaseModel):
    path: str
    message: str


class PredictResponse(BaseModel):
    explanation: str
    annotated_image: str