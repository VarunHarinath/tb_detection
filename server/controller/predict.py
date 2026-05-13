from fastapi import UploadFile, HTTPException
from pathlib import Path
import shutil
import uuid
import base64

from schemas.BaseModel import PredictResponse
from services.onnx_service import run_inference
from services.ollama_service import explain_prediction
from services.benchmark_service import log_benchmark
import time

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


async def predict_controller(files: list[UploadFile]) -> PredictResponse:
    try:
        if not files or len(files) == 0:
            raise HTTPException(status_code=400, detail="No files provided")

        allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}
        
        all_raw_detections = []
        annotated_images_base64 = []
        total_enhanced_count = 0
        total_processing_time = 0
        
        for file in files:
            if not file.filename:
                continue

            file_extension = Path(file.filename).suffix.lower()
            if file_extension not in allowed_extensions:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file type: {file.filename}. Please upload jpg, jpeg, png, webp, or tiff"
                )

            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = UPLOAD_DIR / unique_filename

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            start_time = time.time()
            result = run_inference(str(file_path))
            end_time = time.time()
            
            processing_time_ms = (end_time - start_time) * 1000
            total_processing_time += processing_time_ms

            raw_detections = result["detections"]
            annotated_path = result["annotated_path"]

            file_enhanced_count = sum(d.get("count", 1) for d in raw_detections)
            total_enhanced_count += file_enhanced_count
            
            # Tag detections with filename for clarity
            for d in raw_detections:
                d["source_file"] = file.filename
                all_raw_detections.append(d)

            confidences = [d["confidence"] for d in raw_detections]
            log_benchmark(file.filename, file_enhanced_count, confidences, processing_time_ms)

            if annotated_path:
                with open(annotated_path, "rb") as image_file:
                    encoded = base64.b64encode(image_file.read()).decode("utf-8")
                    annotated_images_base64.append(encoded)

        # Extract cluster details
        cluster_details = []
        for d in all_raw_detections:
            if d.get("count", 1) > 1:
                cluster_details.append({
                    "box": d.get("bbox", []),
                    "estimated_bacilli_count": d.get("count", 1),
                    "source_file": d.get("source_file", ""),
                    "segmentation_method": d.get("segmentation_method", "Unknown")
                })
        
        cluster_count = len(cluster_details)

        # Generate single summary for all detections
        summary = explain_prediction(f"{len(files)} files", all_raw_detections)

        return PredictResponse(
            summary=summary,
            annotated_images=annotated_images_base64,
            total_detections=total_enhanced_count,
            raw_detections=all_raw_detections,
            cluster_count=cluster_count,
            cluster_details=cluster_details
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")