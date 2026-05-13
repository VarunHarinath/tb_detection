import cv2
import numpy as np

def apply_morphology(mask):
    """
    Applies morphological opening and closing to clean up the binary mask.
    Removes small noise and fills small gaps.
    """
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    
    # Opening: removes small noise
    cleaned = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    
    # Closing: fills small holes/gaps
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel, iterations=1)
    
    return cleaned
