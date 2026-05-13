import csv
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent
BENCHMARKS_FILE = BASE_DIR / "benchmarks.csv"

def log_benchmark(filename: str, total_detections: int, confidences: list, processing_time_ms: float):
    file_exists = BENCHMARKS_FILE.exists()
    
    with open(BENCHMARKS_FILE, mode='a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["Timestamp", "Filename", "Total_Detections", "Processing_Time_ms", "Confidences"])
        
        timestamp = datetime.now().isoformat()
        confidences_str = str(confidences) # Will be stringified list e.g., "[0.95, 0.88]"
        
        writer.writerow([timestamp, filename, total_detections, f"{processing_time_ms:.2f}", confidences_str])
