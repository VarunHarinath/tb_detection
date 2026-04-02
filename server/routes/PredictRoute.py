from fastapi import APIRouter, UploadFile, File
from controller.predict import predict_controller
from schemas.BaseModel import PredictResponse

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    return await predict_controller(file)