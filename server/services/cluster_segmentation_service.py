import cv2
import numpy as np
from services.morphology_filters import apply_morphology
from services.watershed_service import apply_watershed
from services.shape_descriptors import filter_shapes

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
    """
    image = image.astype(np.float32)
    kernel = np.ones((window_size, window_size), np.float32) / (window_size * window_size)
    mean = cv2.filter2D(image, -1, kernel, borderType=cv2.BORDER_REPLICATE)
    
    mean_sq = cv2.filter2D(image**2, -1, kernel, borderType=cv2.BORDER_REPLICATE)
    std = np.sqrt(np.maximum(mean_sq - mean**2, 0))
    
    threshold = mean * (1 + k * ((std / r) - 1))
    return threshold

def paper_segmentation_pipeline(roi):
    """
    Advanced Cluster Refinement Pipeline:
    RGB Enhancement -> Coarse RGB segmentation -> Sauvola fine segmentation ->
    Morphology -> Watershed -> Shape Descriptors & Skeletonization
    Returns (count, valid_contours, uncertain_flag)
    """
    if roi is None or roi.size == 0:
        return 0, [], True

    # 1. RGB Enhancement (Contrast stretching on channels)
    b, g, r = cv2.split(roi)
    b_en = contrast_stretching(b)
    g_en = contrast_stretching(g)
    r_en = contrast_stretching(r)

    # 2. Coarse Color Segmentation (isolate red/magenta from blue background)
    bg_max = np.maximum(b_en, g_en)
    redness = cv2.subtract(r_en, bg_max)
    _, coarse_mask = cv2.threshold(redness, 20, 255, cv2.THRESH_BINARY)

    # 3. Fine Segmentation: Sauvola Thresholding
    try:
        from skimage.filters import threshold_sauvola
        thresh_sauvola = threshold_sauvola(g_en, window_size=15)
    except ImportError:
        thresh_sauvola = custom_sauvola(g_en, window_size=15, k=0.2, r=128)
    
    sauvola_mask = np.uint8(g_en < thresh_sauvola) * 255
    combined_mask = cv2.bitwise_and(coarse_mask, sauvola_mask)

    # 4. Morphological cleanup
    cleaned_mask = apply_morphology(combined_mask)

    # 5. Watershed Splitting
    watershed_mask, watershed_uncertain = apply_watershed(cleaned_mask)

    # 6 & 7 & 8. Shape Descriptor Filtering & Skeleton Analysis
    count, valid_contours, shape_uncertain = filter_shapes(watershed_mask)
    
    is_uncertain = watershed_uncertain or shape_uncertain
    
    if count == 0:
        is_uncertain = True

    return count, valid_contours, is_uncertain
