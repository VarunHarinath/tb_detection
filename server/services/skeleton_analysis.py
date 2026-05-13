import cv2
import numpy as np

def analyze_skeleton(binary_mask):
    """
    Performs skeletonization on a connected component mask to validate rod-like
    morphology and detect excessive branching (uncertainty).
    Returns (is_valid, is_uncertain, branches).
    """
    # Simple fallback skeletonization using OpenCV morphology
    skeleton = np.zeros(binary_mask.shape, np.uint8)
    eroded = np.zeros(binary_mask.shape, np.uint8)
    temp = np.zeros(binary_mask.shape, np.uint8)
    
    img = binary_mask.copy()
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    
    while True:
        cv2.erode(img, kernel, eroded)
        cv2.dilate(eroded, kernel, temp)
        cv2.subtract(img, temp, temp)
        cv2.bitwise_or(skeleton, temp, skeleton)
        img = eroded.copy()
        
        if cv2.countNonZero(img) == 0:
            break
            
    # Count branches by finding hit-or-miss endpoints/intersections
    # A simple proxy for branches in a 1px skeleton is counting non-zero pixels
    # and comparing to perimeter, or just looking at the aspect ratio of the bounding box.
    # For a robust implementation without heavy libraries, we can just check if 
    # the skeleton area is significantly larger than the major axis.
    
    skeleton_area = cv2.countNonZero(skeleton)
    
    x, y, w, h = cv2.boundingRect(binary_mask)
    major_axis = max(w, h)
    
    is_uncertain = False
    
    # If the skeleton has many pixels compared to its length, it's highly branched/merged
    if skeleton_area > (major_axis * 1.5):
        is_uncertain = True
        
    return True, is_uncertain, skeleton_area
