from pydantic import BaseModel


class HomeResponse(BaseModel):
    service: str
    version: str
    model: str
    status: str


class ErrorRoute(BaseModel):
    path: str
    message: str


from typing import List, Optional

class PredictResponse(BaseModel):
    summary: str
    annotated_images: list
    total_detections: int
    raw_detections: list
    cluster_count: Optional[int] = 0
    cluster_details: Optional[List[dict]] = []