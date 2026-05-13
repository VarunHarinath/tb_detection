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

CLUSTER_AREA_THRESHOLD = 2500
CLUSTER_ASPECT_RATIO_THRESHOLD = 2.5

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
        plotted = original_img.copy()
        
        if r.boxes is not None:
            for idx, box in enumerate(r.boxes, start=1):
                roi_id = f"ROI-{idx:02d}"
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()
                
                x1, y1, x2, y2 = map(int, xyxy)
                width = x2 - x1
                height = y2 - y1
                area = width * height
                aspect_ratio = float(max(width, height)) / max(min(width, height), 1)
                
                count_in_box = 1
                segmentation_method = "None"
                uncertain = False
                
                if area > CLUSTER_AREA_THRESHOLD or aspect_ratio > CLUSTER_ASPECT_RATIO_THRESHOLD:
                    crop = original_img[y1:y2, x1:x2]
                    
                    # 1. Try Paper-Based Segmentation
                    paper_count, valid_contours, paper_uncertain = paper_segmentation_pipeline(crop)
                    
                    # 2. Fallback to K-Means if paper segmentation fails or returns 0
                    if paper_count > 0:
                        segmentation_method = "Paper-Based Sauvola"
                        uncertain = paper_uncertain
                    else:
                        paper_count, valid_contours = segment_and_count_cluster(crop)
                        segmentation_method = "K-Means Fallback"
                        
                    # 3. Final Fallback to 1 if K-Means also returns 0
                    count_in_box = max(1, paper_count)
                    if count_in_box == 1 and paper_count == 0:
                         segmentation_method = "Failed (Count=1)"
                         uncertain = True
                    
                    if uncertain:
                        box_color = (0, 0, 255) # Red for uncertain
                        label = f"{roi_id} | AFB: {count_in_box} (Review)"
                    else:
                        box_color = (0, 165, 255) # Orange/Yellow for cluster-refined
                        label = f"{roi_id} | AFB: {count_in_box}"
                    
                    for cnt in valid_contours:
                        cnt_offset = cnt + [x1, y1]
                        cv2.drawContours(plotted, [cnt_offset], -1, (0, 255, 255), 1)
                        
                        M = cv2.moments(cnt_offset)
                        if M["m00"] != 0:
                            cX = int(M["m10"] / M["m00"])
                            cY = int(M["m01"] / M["m00"])
                            cv2.circle(plotted, (cX, cY), 2, (0, 255, 0), -1)
                else:
                    box_color = (255, 0, 0) # Blue for isolated
                    label = f"{roi_id} | AFB: 1"

                # Draw outer bounding box
                cv2.rectangle(plotted, (x1, y1), (x2, y2), box_color, 2)
                
                # Draw text background
                (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                cv2.rectangle(plotted, (x1, y1 - th - 5), (x1 + tw, y1), box_color, -1)
                
                # Draw text
                cv2.putText(plotted, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

                detections.append({
                    "roi_id": roi_id,
                    "class_name": model.names[cls_id],
                    "confidence": conf,
                    "bbox": xyxy,
                    "count": count_in_box,
                    "segmentation_method": segmentation_method,
                    "uncertain": uncertain
                })
        output_name = f"{uuid.uuid4()}.jpg"
        output_file = ANNOTATED_DIR / output_name
        cv2.imwrite(str(output_file), plotted)
        annotated_path = str(output_file)

    return {
        "detections": detections,
        "annotated_path": annotated_path
    }