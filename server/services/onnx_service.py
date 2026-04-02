from pathlib import Path
from ultralytics import YOLO
import cv2
import uuid

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "tb_version_1.onnx"
ANNOTATED_DIR = BASE_DIR / "uploads" / "annotated"
ANNOTATED_DIR.mkdir(parents=True, exist_ok=True)

model = YOLO(str(MODEL_PATH), task="detect")


def run_inference(image_path: str):
    results = model.predict(
        source=image_path,
        task="detect",
        conf=0.6,
        iou=0.4,
        imgsz=512,
        verbose=False
    )

    detections = []
    annotated_path = None

    for r in results:
        if r.boxes is not None:
            for box in r.boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()

                detections.append({
                    "class_name": model.names[cls_id],
                    "confidence": conf,
                    "bbox": xyxy
                })

        plotted = r.plot()
        output_name = f"{uuid.uuid4()}.jpg"
        output_file = ANNOTATED_DIR / output_name
        cv2.imwrite(str(output_file), plotted)
        annotated_path = str(output_file)

    return {
        "detections": detections,
        "annotated_path": annotated_path
    }