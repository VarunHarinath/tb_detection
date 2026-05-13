import cv2
import numpy as np
from services.skeleton_analysis import analyze_skeleton

def filter_shapes(binary_mask):
    """
    Applies 8-connected component analysis and shape descriptor filtering
    to keep only rod-like bacilli structures.
    Returns: count, valid_contours, is_uncertain
    """
    contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    valid_contours = []
    cluster_uncertain = False
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 10 or area > 2000: # Remove tiny noise and massive artifacts
            continue
            
        perimeter = cv2.arcLength(cnt, True)
        if perimeter == 0:
            continue
            
        hull = cv2.convexHull(cnt)
        hull_area = cv2.contourArea(hull)
        solidity = float(area)/hull_area if hull_area > 0 else 0
        
        # Circularity (Roughness) = 4 * pi * area / perimeter^2
        circularity = (4 * np.pi * area) / (perimeter * perimeter)
        
        # Bounding rect for aspect ratio
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = float(max(w, h)) / max(min(w, h), 1)
        
        # Fit ellipse for major axis and eccentricity
        eccentricity = 0.0
        major_axis = max(w, h)
        if len(cnt) >= 5:
            ellipse = cv2.fitEllipse(cnt)
            (center, axes, orientation) = ellipse
            majoraxis_length = max(axes)
            minoraxis_length = min(axes)
            major_axis = majoraxis_length
            if majoraxis_length > 0:
                eccentricity = np.sqrt(1 - (minoraxis_length / majoraxis_length)**2)
                
        # Shape Descriptor Filtering for Bacilli (rod-shaped)
        # Low circularity (not a perfect circle), high aspect ratio/eccentricity
        # Solidity checks if it's a star-shaped merged blob
        if circularity < 0.85 and aspect_ratio > 1.2:
            
            # Create a localized mask for this contour to analyze its skeleton
            cnt_mask = np.zeros_like(binary_mask)
            cv2.drawContours(cnt_mask, [cnt], 0, 255, -1)
            
            # Skeleton validation
            is_valid, is_branched, skeleton_area = analyze_skeleton(cnt_mask)
            
            if is_branched or solidity < 0.6:
                cluster_uncertain = True
                
            if is_valid:
                valid_contours.append(cnt)

    return len(valid_contours), valid_contours, cluster_uncertain
