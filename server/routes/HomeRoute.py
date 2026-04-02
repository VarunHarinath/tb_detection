from fastapi import APIRouter
from schemas.BaseModel import HomeResponse

router = APIRouter()

@router.get('/home',response_model=HomeResponse)
def get_home():
    try:
        return HomeResponse(service="TB Detection System",version="1.0.1",model="YOLO (ONInX)",status="Running")
    except Exception as e:
        return HomeResponse(service="TB Detection System",version="1.0.1",model="YOLO (ONInX)",status="Failed")