from pathlib import Path
from ultralytics import YOLO
import cv2
import uuid
import numpy as np
from services.cluster_segmentation_service import paper_segmentation_pipeline

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "tb_version_1.onnx"
ANNOTATED_DIR = BASE_DIR / "uploads" / "annotated"
ANNOTATED_DIR.mkdir(parents=True, exist_ok=True)

model = YOLO(str(MODEL_PATH), task="detect")

def segment_and_count_cluster(crop_image):
    if crop_image is None or crop_image.size == 0:
        return 1
        
    Z = crop_image.reshape((-1, 3))
    Z = np.float32(Z)
    
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    K = 2 
    ret, label, center = cv2.kmeans(Z, K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    
    center = np.uint8(center)
    res = center[label.flatten()]
    res2 = res.reshape((crop_image.shape))
    
    gray_kmeans = cv2.cvtColor(res2, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray_kmeans, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    valid_contours = []
    print(valid_contours)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 10: 
            valid_contours.append(cnt)
            
    return max(1, len(valid_contours)), valid_contours

def run_inference(image_path: str):
    results = model.predict(
        source=image_path,
        task="detect",
        conf=0.25,
        iou=0.4,
        imgsz=512,
        verbose=False
    )

    detections = []
    annotated_path = None

    original_img = cv2.imread(image_path)

    for r in results:
        plotted = r.plot()
        
        if r.boxes is not None:
            for box in r.boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()
                
                x1, y1, x2, y2 = map(int, xyxy)
                area = (x2 - x1) * (y2 - y1)
                
                count_in_box = 1
                segmentation_method = "None"
                
                if area > 2500: # 50x50 threshold for cluster
                    crop = original_img[y1:y2, x1:x2]
                    
                    # 1. Try Paper-Based Segmentation
                    paper_count, valid_contours = paper_segmentation_pipeline(crop)
                    
                    # 2. Fallback to K-Means if paper segmentation fails or returns 0
                    if paper_count > 0:
                        segmentation_method = "Paper-Based Sauvola"
                    else:
                        paper_count, valid_contours = segment_and_count_cluster(crop)
                        segmentation_method = "K-Means Fallback"
                        
                    # 3. Final Fallback to 1 if K-Means also returns 0
                    count_in_box = max(1, paper_count)
                    if count_in_box == 1 and paper_count == 0:
                         segmentation_method = "Failed (Count=1)"
                    
                    
                    for cnt in valid_contours:
                        cnt_offset = cnt + [x1, y1]
                        cv2.drawContours(plotted, [cnt_offset], -1, (0, 255, 255), 1)
                        
                        M = cv2.moments(cnt_offset)
                        if M["m00"] != 0:
                            cX = int(M["m10"] / M["m00"])
                            cY = int(M["m01"] / M["m00"])
                            cv2.circle(plotted, (cX, cY), 2, (0, 255, 0), -1)

                detections.append({
                    "class_name": model.names[cls_id],
                    "confidence": conf,
                    "bbox": xyxy,
                    "count": count_in_box,
                    "segmentation_method": segmentation_method
                })
        output_name = f"{uuid.uuid4()}.jpg"
        output_file = ANNOTATED_DIR / output_name
        cv2.imwrite(str(output_file), plotted)
        annotated_path = str(output_file)

    return {
        "detections": detections,
        "annotated_path": annotated_path
    }