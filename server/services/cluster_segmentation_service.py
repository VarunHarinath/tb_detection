import cv2
import numpy as np

def contrast_stretching(img):
    """Applies min-max contrast stretching to an image/channel."""
    min_val = np.min(img)
    max_val = np.max(img)
    if max_val == min_val:
        return img
    stretched = (img - min_val) * (255.0 / (max_val - min_val))
    return np.uint8(stretched)

def custom_sauvola(image, window_size=15, k=0.2, r=128):
    """
    Custom implementation of Sauvola adaptive thresholding.
    Used as fallback if skimage is not available.
    T = m(x,y) * (1 + k * ((s(x,y) / R) - 1))
    """
    image = image.astype(np.float32)
    # Mean
    kernel = np.ones((window_size, window_size), np.float32) / (window_size * window_size)
    mean = cv2.filter2D(image, -1, kernel, borderType=cv2.BORDER_REPLICATE)
    
    # Standard deviation
    mean_sq = cv2.filter2D(image**2, -1, kernel, borderType=cv2.BORDER_REPLICATE)
    std = np.sqrt(np.maximum(mean_sq - mean**2, 0))
    
    # Sauvola Threshold
    threshold = mean * (1 + k * ((std / r) - 1))
    return threshold

def paper_segmentation_pipeline(roi):
    """
    Paper-based segmentation pipeline:
    RGB Enhancement -> Coarse RGB segmentation -> Sauvola fine segmentation -> Shape Descriptors
    """
    if roi is None or roi.size == 0:
        return 0, []

    # 1. RGB Enhancement (Contrast stretching on channels)
    b, g, r = cv2.split(roi)
    b_en = contrast_stretching(b)
    g_en = contrast_stretching(g)
    r_en = contrast_stretching(r)
    enhanced = cv2.merge([b_en, g_en, r_en])

    # 2. Coarse Color Segmentation (isolate red/magenta from blue background)
    # In ZN stains, bacilli are dark pink/red. B and G are usually lower than R.
    # We can use a simple channel subtraction or thresholding.
    # R - max(G, B) is a good indicator of redness.
    bg_max = np.maximum(b_en, g_en)
    redness = cv2.subtract(r_en, bg_max)
    _, coarse_mask = cv2.threshold(redness, 20, 255, cv2.THRESH_BINARY)

    # 3. Fine Segmentation: Sauvola Thresholding
    # We apply Sauvola to the green channel (often provides highest contrast for pink bacilli)
    try:
        from skimage.filters import threshold_sauvola
        thresh_sauvola = threshold_sauvola(g_en, window_size=15)
    except ImportError:
        thresh_sauvola = custom_sauvola(g_en, window_size=15, k=0.2, r=128)
    
    # Bacilli are darker in the green channel, so we invert the threshold logic
    sauvola_mask = np.uint8(g_en < thresh_sauvola) * 255

    # Combine masks
    combined_mask = cv2.bitwise_and(coarse_mask, sauvola_mask)

    # 4. Morphological cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    cleaned = cv2.morphologyEx(combined_mask, cv2.MORPH_OPEN, kernel, iterations=1)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel, iterations=1)

    # 5. Connected Component Analysis & Shape Descriptors
    # Using 8-connectivity
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(cleaned, connectivity=8)
    
    valid_contours = []
    
    # Find contours for more advanced shape features
    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 10 or area > 1000: # Remove tiny noise and massive artifacts
            continue
            
        perimeter = cv2.arcLength(cnt, True)
        if perimeter == 0:
            continue
            
        hull = cv2.convexHull(cnt)
        hull_perimeter = cv2.arcLength(hull, True)
        
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
        if circularity < 0.8 and aspect_ratio > 1.2:
            valid_contours.append(cnt)

    return len(valid_contours), valid_contours
