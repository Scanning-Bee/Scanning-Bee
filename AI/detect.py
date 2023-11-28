from preprocess import *


def detect_dark_cells(img):

    blurred_image = cv2.medianBlur(img,11)
    better_light = contrast_stretching(blurred_image)

    dark_thresh = find_first_peak(better_light)

    _,binary_img = cv2.threshold(better_light,dark_thresh,255,cv2.THRESH_BINARY_INV)

    kernel_size = 15
    kernel = np.ones((kernel_size, kernel_size), np.uint8)

    # Apply opening operation
    opening_result = cv2.morphologyEx(binary_img, cv2.MORPH_OPEN, kernel)
    
    close_kernel = np.ones((3,3))
    erode = cv2.erode(opening_result,close_kernel)

    input_image = opening_result
    contours, _  = cv2.findContours(input_image,mode = cv2.RETR_LIST,method=cv2.CHAIN_APPROX_NONE)
    
    # List to store the centers and radii of the minimum enclosing circles
    min_enclosing_circles = []
    large_contours =[]
    small_contours = []

    default_radius = 70

    for contour in contours:
        # Find minimum enclosing circle for each contour
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius > 100:
            large_contours.append(contour)
            continue

        elif radius < 50:
            small_contours.append(contour)
            continue 
        
        # Append the center and radius to the list
        min_enclosing_circles.append((center, default_radius))


    ## Separate larger contours, apply opening on them to divide
    large_areas = np.zeros_like(img)
    large_areas = cv2.drawContours(large_areas,large_contours,-1,255,cv2.FILLED)

    
    kernel_size = 55
    kernel = np.ones((kernel_size, kernel_size), np.uint8)

    # Apply opening operation
    large_areas = cv2.morphologyEx(large_areas, cv2.MORPH_OPEN, kernel)
    
    fixed_large_contours, _  = cv2.findContours(large_areas,mode = cv2.RETR_LIST,method=cv2.CHAIN_APPROX_NONE)
    
    for contour in fixed_large_contours:
        # Find minimum enclosing circle for each contour
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius > 120:
            continue

        # Append the center and radius to the list
        min_enclosing_circles.append((center, default_radius))

    ## Separate small contours, apply closure to merge close ones
    small_areas = np.zeros_like(img)
    small_areas = cv2.drawContours(small_areas,small_contours,-1,255,cv2.FILLED)
    
    kernel_size = 23
    kernel = np.ones((kernel_size, kernel_size), np.uint8)
    small_areas = cv2.dilate(small_areas,kernel)

    fixed_small_contours, _  = cv2.findContours(small_areas,mode = cv2.RETR_LIST,method=cv2.CHAIN_APPROX_NONE)
    
    for contour in fixed_small_contours:
        # Find minimum enclosing circle for each contour
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius < 50:
            continue

        # Append the center and radius to the list
        min_enclosing_circles.append((center, default_radius))
    

    # # # Create a figure with two subplots side by side
    # plt.figure(figsize=(10, 5))

    # # Subplot 1: First image
    # plt.subplot(1, 2, 1)
    # plt.imshow(large_areas, cmap='gray')
    # plt.title('Image 1')
    # plt.axis('off')

    # # Subplot 2: Second image
    # plt.subplot(1, 2, 2)
    # plt.imshow(small_areas, cmap='gray')
    # plt.title('Image 2')
    # plt.axis('off')

    # # Show the plot
    # plt.show()
    
    return contours, input_image, min_enclosing_circles

def detect_light_cells(img):
    input_image = img
    contours, _  = cv2.findContours(input_image,mode = cv2.RETR_LIST,method=cv2.CHAIN_APPROX_NONE)
    
    min_enclosing_circles = []
    large_contours =[]
    small_contours = []

    default_radius = 70

    for contour in contours:
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius > 100:
            large_contours.append(contour)
            continue

        elif radius < 50:
            small_contours.append(contour)
            continue 
        
        min_enclosing_circles.append((center, default_radius))

    large_areas = np.zeros_like(img)
    large_areas = cv2.drawContours(large_areas,large_contours,-1,255,cv2.FILLED)

    
    kernel_size = 55
    kernel = np.ones((kernel_size, kernel_size), np.uint8)

    large_areas = cv2.morphologyEx(large_areas, cv2.MORPH_OPEN, kernel)
    
    fixed_large_contours, _  = cv2.findContours(large_areas,mode = cv2.RETR_LIST,method=cv2.CHAIN_APPROX_NONE)
    
    for contour in fixed_large_contours:
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius > 120:
            continue

        min_enclosing_circles.append((center, default_radius))

    small_areas = np.zeros_like(img)
    small_areas = cv2.drawContours(small_areas,small_contours,-1,255,cv2.FILLED)
    
    kernel_size = 23
    kernel = np.ones((kernel_size, kernel_size), np.uint8)
    small_areas = cv2.dilate(small_areas,kernel)

    fixed_small_contours, _  = cv2.findContours(small_areas,mode = cv2.RETR_LIST,method=cv2.CHAIN_APPROX_NONE)
    
    for contour in fixed_small_contours:
        (x, y), radius = cv2.minEnclosingCircle(contour)
        center = (int(x), int(y))
        radius = int(radius)

        if radius < 50:
            continue

        min_enclosing_circles.append((center, default_radius))
    
    return contours, input_image, min_enclosing_circles

def detect_circles(img):

    light_contours, light_image, light_circles = detect_light_cells(img)
    dark_contours, dark_image, dark_circles = detect_dark_cells(img)

    return light_contours, light_image, light_circles, dark_contours, dark_image, dark_circles
