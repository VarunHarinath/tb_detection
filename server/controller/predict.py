from fastapi import UploadFile, HTTPException
from pathlib import Path
import shutil
import uuid
import base64

from schemas.BaseModel import PredictResponse
from services.onnx_service import run_inference
from services.gemini_service import explain_prediction

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


async def predict_controller(file: UploadFile) -> PredictResponse:
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}
        file_extension = Path(file.filename).suffix.lower()

        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload jpg, jpeg, png, or webp"
            )

        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = run_inference(str(file_path))
        raw_detections = result["detections"]
        annotated_path = result["annotated_path"]

        explanation = explain_prediction(str(file_path), raw_detections)

        if not annotated_path:
            raise HTTPException(status_code=500, detail="Annotated image was not created")

        with open(annotated_path, "rb") as image_file:
            annotated_image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

        return PredictResponse(
            explanation=explanation,
            annotated_image=annotated_image_base64
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")