import cv2
import numpy as np

def apply_watershed(binary_mask):
    """
    Applies distance transform and watershed algorithm to separate
    touching or overlapping bacilli within a dense cluster.
    """
    if binary_mask is None or cv2.countNonZero(binary_mask) == 0:
        return binary_mask, False
        
    # Distance transform
    dist_transform = cv2.distanceTransform(binary_mask, cv2.DIST_L2, 5)
    
    # Threshold the distance transform to find certain foreground area
    # 0.4 is a common threshold, but can be adjusted for thin bacilli
    _, sure_fg = cv2.threshold(dist_transform, 0.4 * dist_transform.max(), 255, 0)
    sure_fg = np.uint8(sure_fg)
    
    # Find sure background area by dilating the original mask
    kernel = np.ones((3,3), np.uint8)
    sure_bg = cv2.dilate(binary_mask, kernel, iterations=2)
    
    # Finding unknown region (edges where bacilli touch)
    unknown = cv2.subtract(sure_bg, sure_fg)
    
    # Marker labelling
    ret, markers = cv2.connectedComponents(sure_fg)
    
    # Add one to all labels so that sure background is not 0, but 1
    markers = markers + 1
    
    # Mark the region of unknown with zero
    markers[unknown == 255] = 0
    
    # Create a 3-channel image for watershed (required by OpenCV)
    img_color = cv2.cvtColor(binary_mask, cv2.COLOR_GRAY2BGR)
    
    # Apply watershed
    markers = cv2.watershed(img_color, markers)
    
    # Create a new binary mask where boundaries (-1) are set to 0 (background)
    # and all positive markers > 1 are foreground (separated objects)
    split_mask = np.zeros_like(binary_mask)
    split_mask[markers > 1] = 255
    
    # Check watershed instability (if it produced too many tiny fragments)
    # We can flag it later in shape descriptors or here.
    # For now, just return the split mask.
    return split_mask, False
