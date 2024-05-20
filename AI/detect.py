from AI.preprocess import *
from typing import List, Tuple

THRESHOLD = 200


def detect_contours(
        img: np.ndarray,
        default_radius: int = 70,
        max_radius: int = 100,
        min_radius: int = 60,
        open_kernel_size: int = 55,
        close_kernel_size: int = 23
):
    contours, _ = cv2.findContours(
        img, mode=cv2.RETR_LIST, method=cv2.CHAIN_APPROX_NONE
    )

    # List to store the centers and radii of the minimum enclosing circles
    min_enclosing_circles = []
    large_contours = []
    small_contours = []

    def check_circle(x: int, y: int, radius: int):
        h, w = img.shape

        # check of bounds
        if (
                (x + radius >= w)
                or (x - radius <= 0)
                or (y + radius >= h)
                or (y - radius <= 0)
        ):
            return False

        # check of proximity
        for x_c, y_c, _ in min_enclosing_circles:
            distance = np.sqrt((x_c - x) ** 2 + (y_c - y) ** 2)
            if distance < 2 * default_radius:
                return False

        return True

    for contour in contours:
        # Find minimum enclosing circle for each contour
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius > max_radius:
            large_contours.append(contour)
            continue

        elif radius < min_radius:
            small_contours.append(contour)
            continue

        if check_circle(x, y, radius):
            min_enclosing_circles.append((int(x), int(y), radius))

    # Separate larger contours, apply opening on them to divide
    large_areas = np.zeros_like(img)
    large_areas = cv2.drawContours(large_areas, large_contours, -1, 255, cv2.FILLED)

    kernel = np.ones((open_kernel_size, open_kernel_size), np.uint8)

    # Apply opening operation
    large_areas = cv2.morphologyEx(large_areas, cv2.MORPH_OPEN, kernel)

    fixed_large_contours, _ = cv2.findContours(
        large_areas, mode=cv2.RETR_LIST, method=cv2.CHAIN_APPROX_NONE
    )

    for contour in fixed_large_contours:
        # Find minimum enclosing circle for each contour
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius > max_radius:
            continue

        if check_circle(x, y, radius):
            min_enclosing_circles.append((int(x), int(y), radius))

    # Separate small contours, apply closure to merge close ones
    small_areas = np.zeros_like(img)
    small_areas = cv2.drawContours(small_areas, small_contours, -1, 255, cv2.FILLED)

    kernel = np.ones((close_kernel_size, close_kernel_size), np.uint8)
    small_areas = cv2.dilate(small_areas, kernel)

    fixed_small_contours, _ = cv2.findContours(
        small_areas, mode=cv2.RETR_LIST, method=cv2.CHAIN_APPROX_NONE
    )

    for contour in fixed_small_contours:
        # Find minimum enclosing circle for each contour
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius < min_radius:
            continue

        if check_circle(x, y, radius):
            min_enclosing_circles.append((int(x), int(y), radius))

    return contours, min_enclosing_circles


def detect_hough(img: np.ndarray,
                 default_radius: int = 70,
                 max_radius: int = 100,
                 min_radius: int = 60,
                 ) -> np.ndarray:
    '''
    Detect circles in the whole image using the Hough Circle Transform.

    Parameters:
    - img (numpy.ndarray): The input image (grayscale) in which circles are to be detected.
    - default_radius (int): Default radius for circles. Used when no circles are found initially.
    - max_radius (int): Maximum expected radius of circles.
    - min_radius (int): Minimum expected radius of circles.

    Returns:
    - numpy.ndarray: An array of accepted circles represented as (x, y, radius) tuples.
      Returns an empty array if no circles are detected.
    '''

    accepted_circles = np.array([])

    # Apply Hough Circle Transform
    found_circles = cv2.HoughCircles(
        img,
        cv2.HOUGH_GRADIENT,
        2,
        minDist=2 * min_radius,
        param1=200,
        param2=50,
        minRadius=min_radius,
        maxRadius=max_radius,
    )

    # Check if no circles are found
    if isinstance(found_circles, type(None)):
        return accepted_circles

    # Reshape the found circles array to (x, y, radius) format
    accepted_circles = found_circles.reshape((-1, 3)).astype(np.int32)

    return accepted_circles



def detect_circles_using_hough_transform(img: np.ndarray, use_dark: bool = True, use_light: bool = False) -> np.ndarray:
    '''
    Takes a grayscale image as input, returns a numpy array of (x, y, r) tuples.
    If both use_dark and use_light are False, attempts to detect without any preprocessing.


    Parameters:
    - img (numpy.ndarray): The input image (grayscale) in which circles are to be detected.
    - use_dark (bool): If set to True, applies preprocessing to highlight dark-colored cells and adds to the result array.
    - use_light (bool): If set to True, applies preprocessing to highlight light-colored cells and adds to the result array.

    Returns:
    - numpy.ndarray: An array of found circles represented as (x, y, radius) tuples.
      If no circle is found, np.array([]) is returned.
    '''

    dark_circles = np.array([])
    light_circles = np.array([])
    no_process_circles = np.array([])

    if use_dark:
        dark_image, _ = preprocess_dark_img(img)
        dark_circles = detect_hough(dark_image)
   
    if use_light:
        light_image = preprocess_light_img(img)
        light_circles = detect_hough(light_image)
    
    if not use_dark and not use_light:
        no_process_circles = detect_hough(img)

    # Filter out empty arrays before stacking
    non_empty_arrays = [arr for arr in [dark_circles, light_circles, no_process_circles] if arr.size > 0]
    
    if len(non_empty_arrays)>0:
        all_circles = np.vstack(non_empty_arrays)
    else:
        all_circles = np.array([])

    return all_circles


def light_detect_procedure():
    '''
    The old approach taken to detect the light cells. Not recommended. Deprecated.
    '''
    bee_hive_image = cv2.imread('mini_dataset/close_up_1.jpg')
    gray_bee_hive = cv2.cvtColor(bee_hive_image, cv2.COLOR_BGR2GRAY)
    # blurred_bee_hive = cv2.GaussianBlur(gray_bee_hive, (7, 7), 0)
    # equalized_bee_hive = cv2.equalizeHist(blurred_bee_hive)
    # _, thresholded_bee_hive = cv2.threshold(blurred_bee_hive, 127, 255, cv2.THRESH_BINARY)

    sample_light_cell_image = cv2.imread('kernel.png')
    gray_sample_light_cell = cv2.cvtColor(sample_light_cell_image, cv2.COLOR_BGR2GRAY)
    # blurred_sample_light_cell = cv2.GaussianBlur(gray_sample_light_cell, (5, 5), 0)
    # equalized_sample_light_cell = cv2.equalizeHist(blurred_sample_light_cell)
    # _, thresholded_sample_light_cell = cv2.threshold(blurred_sample_light_cell, 127, 255, cv2.THRESH_BINARY)

    plt.figure(figsize=(8, 4))

    plt.subplot(131)
    plt.imshow(bee_hive_image, cmap='gray')
    plt.title('Image 1')

    plt.subplot(132)
    plt.imshow(gray_sample_light_cell, cmap='gray')
    plt.title('Image 2')

    result = convolve(gray_bee_hive, gray_sample_light_cell, THRESHOLD)
    masked_image = np.where(result > 0, gray_bee_hive, 0)
    # masked_image = 255 - masked_image
    dark_contours, dark_image, dark_circles = detect_dark_cells(masked_image)
    if dark_circles is not None:
        for circle in np.array(dark_circles)[:, 0]:
            cv2.circle(gray_bee_hive, (circle[0], circle[1]), color=0, radius=70, thickness=3)

    plt.subplot(133)
    plt.imshow(gray_bee_hive, cmap='gray')
    plt.title(f"Inverted image (threshold: {THRESHOLD})")
    plt.show()


def detect_circle_on_clip(sample_image: np.ndarray) -> np.ndarray[Tuple[int, int, int]]:
    '''
    After the image is divided into patches which are expected to have cells inside them, each patch is
    sent into this function.
    '''
    # This is Görkem's function, takes in a patch of image, return numpy array of tuples

    # Find peak pixel value
    peak = get_hist_max(sample_image)
    dark_flag = False
    if peak <= 127:
        dark_flag = True
        sample_image = ~sample_image

    # Supress extreme values
    sample_image[sample_image < (peak - 20)] = np.mean(sample_image[sample_image >= (peak - 20)])

    # Increase the constrast near peak
    sample_image = contrast_stretching(sample_image)
    peak = plot_img_hist(sample_image)
    sample_image[sample_image < (peak - 10)] = 0
    sample_image[sample_image >= (peak - 10)] = 255

    # binarize
    retval, sample_image = cv2.threshold(sample_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    found_circles = np.array([])
    # detect circle on processed imaged
    circles = cv2.HoughCircles(
        sample_image,
        cv2.HOUGH_GRADIENT,
        2,
        minDist=120,
        param1=200,
        param2=20,
        minRadius=60,
        maxRadius=80,
    )

    if isinstance(circles, type(None)):
        return found_circles

    found_circles = circles.reshape((-1,3)).astype(np.int32)
    
    return found_circles


def create_bee_mask(model, img: np.ndarray) -> np.ndarray:
    '''
    Creates a bee mask based on the detections of the given detection model. 
    
    Parameters:
    - model: The YOLO bee detection model.
    - img (numpy.ndarray): The input image (grayscale) in which circles are to be detected.
    
    Returns:
    - numpy.ndarray: A mask of type np.ndarray that is the same size as img.
    '''
    # Initialize an empty mask
    mask = np.zeros_like(img, dtype=np.uint8)

    img = cv2.cvtColor(img,cv2.COLOR_GRAY2RGB)
    height, width,_ = img.shape

    predictions = model.predict(source=img, conf=0.25)

    # Iterate through each prediction
    for prediction in predictions:

        import torch
        masks = prediction.masks.data
        boxes = prediction.boxes.data

        clss = boxes[:, 5]

        #EXTRACT A SINGLE MASK WITH ALL THE CLASSES
        obj_indices = torch.where(clss != -1)
        obj_masks = masks[obj_indices]
        obj_mask = torch.any(obj_masks, dim=0).int() * 255

        # Convert the PyTorch tensor to a NumPy array
        obj_mask_numpy = obj_mask.cpu().numpy()

        # Perform NumPy operations
        obj_mask_numpy_processed = np.any(obj_mask_numpy, axis=0).astype(np.uint8) * 255
        
        print(obj_mask_numpy_processed.shape)
        obj_mask_numpy_processed = cv2.resize(obj_mask_numpy_processed,(width,height))
        print(mask.shape)
        print(obj_mask_numpy_processed.shape)
        
        # Draw a filled polygon on the mask using the points
        mask = cv2.bitwise_and(mask,obj_mask_numpy_processed)

    plt.imshow(mask)
    plt.show()
    return mask


def create_circle_mask(center: Tuple[int, int], radius, mask_shape) -> np.ndarray:
    mask = np.zeros(mask_shape, dtype=np.uint8)
    cv2.circle(mask, center, radius, (255, 255, 255), thickness=cv2.FILLED)
    return mask

def filter_intersecting_circles(circles: np.ndarray[Tuple[int, int, int]], binary_mask: np.ndarray, intersection_threshold: float = 0.4)-> List[Tuple[int, int, int]]:
    '''
    Eliminates the detections colliding with the bees, as well as applying non-maximum suppression to those left.

    Parameters:
    - circles (np.ndarray[Tuple[int, int, int]]): A numpy array of tuples denoting the detected circles, in (x, y, radius) format.
    - binary_mask (numpy.ndarray): The binary mask of the detected bees.
    - intersection_threshold (float): The lower bound for the intersection ratio (area-wise). Initialized to 0.4 by default.
    
    Returns:
    - List[Tuple[int, int, int]]: A list of tuples, each tuple denoting a circle in (x, y, radius) format.
    
    '''
    filtered_circles = []
    
    for x, y, radius in circles:
        # Create a circular mask for the current circle
        circle_mask = create_circle_mask((x, y), radius, binary_mask.shape[:2])

        # Perform bitwise AND operation with the binary mask
        intersection = cv2.bitwise_and(circle_mask, 255 - binary_mask)

        # Calculate the area of intersection
        intersection_area = np.sum(intersection) / 255.0

        # Calculate the area of the circle
        circle_area = np.pi * radius ** 2

        # Calculate the ratio of intersection area to circle area
        intersection_ratio = intersection_area / circle_area

        # Check if the ratio is below the threshold
        if intersection_ratio <= intersection_threshold:
            # There is an intersection, but it is below the threshold, add the circle to the filtered list
            filtered_circles.append((x, y, radius))

    return filtered_circles