from detect import *
from preprocess import *
import random
from typing import List, Tuple
from scipy import stats
from math import sqrt
FOUR_OVER_ROOT3 = 2.309401077
TWO_OVER_ROOT3 = 1.154700538
THREE_OVER_ROOT3 = 1.732050808
ROOT3 = 1.732050808
TAN120 = 1.732050808


def draw_parallel_grid(plot_img: np.ndarray, detected_circles: List[Tuple[int, int, int]], slope: float=TAN120) -> np.ndarray:
    height, width, _ = plot_img.shape

    the_circle = detected_circles[0]
    x, y, r = [int(i) for i in the_circle]

    r = int(np.mean(detected_circles, axis=0)[2])

    line_height = y + r
    while line_height < height:
        cv2.line(plot_img, (0, line_height), (width - 1, line_height), (255, 0, 0), 1)
        line_height += int(r * 3 * TWO_OVER_ROOT3 + 15)

    line_height = y + r - int(r * 3 * TWO_OVER_ROOT3 + 15)
    while line_height > 0:
        cv2.line(plot_img, (0, line_height), (width - 1, line_height), (255, 0, 0), 1)
        line_height -= int(r * 3 * TWO_OVER_ROOT3 + 15)

    line_height = y - r
    while line_height > 0:
        cv2.line(plot_img, (0, line_height), (width - 1, line_height), (0, 0, 255), 1)
        line_height -= int(r * 3 * TWO_OVER_ROOT3 + 15)

    line_height = y - r + int(r * 3 * TWO_OVER_ROOT3 + 15)
    while line_height < height:
        cv2.line(plot_img, (0, line_height), (width - 1, line_height), (0, 0, 255), 1)
        line_height += int(r * 3 * TWO_OVER_ROOT3 + 15)

    temp_r = int(r + 0.2 * r)
    point = [x + temp_r, y]

    while point[0] < width:
        end_point_up_x = 0  # x-coordinate of the leftmost pixel
        end_point_up_y = int(point[1] - (point[0] - end_point_up_x) * np.tan(np.arctan(slope)))
        end_point_up = (end_point_up_x, end_point_up_y)

        # Calculate the downward endpoint
        end_point_down_x = plot_img.shape[1] - 1  # x-coordinate of the rightmost pixel
        end_point_down_y = int(point[1] + (end_point_down_x - point[0]) * np.tan(np.arctan(slope)))
        end_point_down = (end_point_down_x, end_point_down_y)

        # Draw the line on the image
        color = (0, 255, 0)  # Green color
        thickness = 2
        cv2.line(plot_img, point, end_point_up, color, thickness)
        cv2.line(plot_img, point, end_point_down, color, thickness)
        point[0] = point[0] + 2 * temp_r

    while point[0] > 0:
        end_point_up_x = 0  # x-coordinate of the leftmost pixel
        end_point_up_y = int(point[1] - (point[0] - end_point_up_x) * np.tan(np.arctan(slope)))
        end_point_up = (end_point_up_x, end_point_up_y)

        # Calculate the downward endpoint
        end_point_down_x = plot_img.shape[1] - 1  # x-coordinate of the rightmost pixel
        end_point_down_y = int(point[1] + (end_point_down_x - point[0]) * np.tan(np.arctan(slope)))
        end_point_down = (end_point_down_x, end_point_down_y)

        # Draw the line on the image
        color = (0, 255, 0)  # Green color
        thickness = 2
        cv2.line(plot_img, point, end_point_up, color, thickness)
        cv2.line(plot_img, point, end_point_down, color, thickness)
        point[0] = point[0] - 2 * temp_r

    return plot_img


def get_patches(img: np.ndarray, detected_circles: List[Tuple[int, int, int]], cell_space: float=0.15, error_margin: float=0.7, show_grid: bool = False, num_patches_from_anchor=float('inf')) -> Tuple[List[Tuple[int, int, int, int]], List[Tuple[int, int, int, int]]]:
    '''
    Takes an image for plotting, the list of circles detected in the first stage, cell space and error_margin parameters.
    Returns a tuple of two lists: The first one is the patch corners with the error margin added, the second one is patch corners without the error margin.
    TODO: Further experimentation on cell_space, error_margin needed.
    '''

    height, width, _ = img.shape

    if len(detected_circles) == 0:
        return [], []
    if show_grid:
        img_draw = img.copy()
        
    grid_corners = []
    tight_corners = []

    # get the most confidence circle
    for anchor in detected_circles:
        x, y, r = [int(i) for i in anchor]

        space_bw_two_rows = int(r * 3 * TWO_OVER_ROOT3 * (1 + cell_space))
        space_bw_two_cols = int(r * 2 * (1 + cell_space))
        
        #### Create first grid, this is not slided, should surround anchor circle
        horizontal_lines = []
        vertical_lines = []

        # traverse over rows down, start from the anchor circle level
        line = y
        times_traversed = 0
        while line < height and times_traversed < num_patches_from_anchor:
            up = int(line - r)
            down = int(line + r)
            if up < 0 or down > height:
                break
            horizontal_lines.append((up, down))
            line += space_bw_two_rows
            times_traversed += 1

        # traverse over rows up, start two rows above anchor circle
        line = y - space_bw_two_rows
        times_traversed = 0
        while line > 0 and times_traversed < num_patches_from_anchor:
            up = int(line - r)
            down = int(line + r)
            if up < 0 or down > height:
                break
            horizontal_lines.append((up, down))
            line -= space_bw_two_rows
            times_traversed += 1

        # columns, go right by starting from anchor circle column
        column = x
        times_traversed = 0
        while column < width and times_traversed < num_patches_from_anchor:
            left = int(column - r)
            right = int(column + r)
            if left < 0 or right > width:
                break
            vertical_lines.append((left, right))
            # vertical_lines.append((left,right)) 
            column += space_bw_two_cols
            times_traversed += 1

        # columns, go left starting from two level left of anchor circle
        column = x - space_bw_two_cols
        times_traversed = 0
        while column > 0 and times_traversed < num_patches_from_anchor:
            left = int(column - r)
            right = int(column + r)
            if left < 0 or right > width:
                break
            vertical_lines.append((left, right))
            column -= space_bw_two_cols
            times_traversed += 1

        ### At every second row, slide the columns, calculate this grid
        slided_horizontal_lines = []
        slided_vertical_lines = []

        # traverse over rows down, start from one level below the anchor circle
        line = y + THREE_OVER_ROOT3 * r
        times_traversed = 0
        while line < height and times_traversed < num_patches_from_anchor:
            up = int(line - r)
            down = int(line + r)
            if up < 0 or down > height:
                break
            slided_horizontal_lines.append((up, down))
            line += space_bw_two_rows
            times_traversed += 1

        # traverse over rows up, start from one level above the anchor circle
        line = y + THREE_OVER_ROOT3 * r - space_bw_two_rows
        times_traversed = 0
        while line > 0 and times_traversed < num_patches_from_anchor:
            up = int(line - r)
            down = int(line + r)
            if up < 0 or down > height:
                break
            slided_horizontal_lines.append((up, down))
            line -= space_bw_two_rows
            times_traversed += 1

        # columns, go right by starting from one right column of anchor
        column = x + r
        times_traversed = 0
        while column < width and times_traversed < num_patches_from_anchor:
            left = int(column - r)
            right = int(column + r)
            if left < 0 or right > width:
                break
            slided_vertical_lines.append((left, right))
            column += space_bw_two_cols
            times_traversed += 1

        # columns, go left by starting from one right column of anchor
        column = x + r - space_bw_two_cols
        times_traversed = 0
        while column > 0 and times_traversed < num_patches_from_anchor:
            left = int(column - r)
            right = int(column + r)
            if left < 0 or right > width:
                break
            slided_vertical_lines.append((left, right))
            column -= space_bw_two_cols
            times_traversed += 1

        first_grid = []
        second_grid = []

        first_tight = []
        second_tight = []

        # uncomment to visualize grid
        if show_grid:
            img_draw = cv2.circle(img_draw, (x,y), r, (0,0,255), 2)

        # using calculates lines, find corners for patches in first grid
        for row in horizontal_lines:
            for column in vertical_lines:
                up = int(row[0] - error_margin * r)
                down = int(row[1] + error_margin * r)
                left = int(column[0] - error_margin * r)
                right = int(column[1] + error_margin * r)

                if up < 0 or down > height or left < 0 or right > width:
                    continue

                if show_grid:
                    cv2.rectangle(img_draw, (left, up), (right, down), tuple(np.random.random(size=3) * 256), 2)

                first_grid.append((left, right, up, down))
                first_tight.append((int(column[0]), int(column[1]), int(row[0]), int(row[1])))

        # using calculated and slided lines, find patch corners for second grid
        for row in slided_horizontal_lines:
            for column in slided_vertical_lines:
                up = int(row[0] - error_margin * r)
                down = int(row[1] + error_margin * r)
                left = int(column[0] - error_margin * r)
                right = int(column[1] + error_margin * r)

                if up < 0 or down > height or left < 0 or right > width:
                    continue

                if show_grid:
                    cv2.rectangle(img_draw, (left, up), (right, down), tuple(np.random.random(size=3) * 256), 2)

                second_grid.append((left, right, up, down))
                second_tight.append((int(column[0]), int(column[1]), int(row[0]), int(row[1])))
        grid_corners += first_grid + second_grid
        tight_corners += first_tight + second_tight
    ## combine two grids on one list
    # grid_corners = first_grid + second_grid
    # tight_corners = first_tight + second_tight
    if show_grid:
        cv2.imshow('the_grids', img_draw)
        if cv2.waitKey(0) & 0xFF == ord('q'):
            cv2.destroyWindow('the_grids')

    return grid_corners, tight_corners


def detect_second_stage(img: np.ndarray, patch_corners: List[Tuple[int, int, int, int]], first_detected: Tuple[int, int, int], show_patches:bool = False):
    '''
    img: An image
    Takes an image, a patch_corner list and an array of detected_circles.
    If a patch is empty, runs local search on that patch.
    Returns the results as a list, also returns the image patches for visualization purposes.
    '''
    newly_detected = []
    patches = []

    # check every patch
    for l, r, u, d in patch_corners:
        inside = False

        # compare patches with previously found circles to see if a circle exists in this patch
        for circle in first_detected:
            x, y, detection_radius = circle
            if l < x and x < r and u < y and y < d:
                inside = True
                break

        # if no circle is in this patch
        if not inside:
            patch = img[u:d, l:r].copy()
            patches.append(patch)
            circles = detect_circle_on_clip(patch)[:1]
            if circles.size > 0:
                for circle in circles:
                    x, y, detection_radius = circle
                    # x and y are coordinates on patch, to adjust to whole image add l or u
                    newly_detected.append([int(x + l), int(y + u), int(detection_radius)])

    if show_patches:
        # Assuming 'patches' is a list containing the image patches
        # and 'patch_corners' contains the corners of each patch

        # Calculate the number of rows and columns for the subplot grid
        num_patches = len(patches)
        num_cols = 6  # You can adjust the number of columns as needed
        num_rows = int(np.ceil(num_patches / num_cols))

        # Create a subplot grid
        fig, axes = plt.subplots(num_rows, num_cols, figsize=(15, 15))

        # Check if axes is a NumPy array and flatten if needed
        if isinstance(axes, np.ndarray):
            axes = axes.flatten()

        # Plot each patch in a separate subplot
        for i, (patch, (l, r, u, d)) in enumerate(zip(patches, patch_corners)):
            ax = axes[i]
            ax.imshow(patch, cmap='gray')  # You can adjust the colormap as needed
            ax.axis('off')

        # Adjust layout for better visualization
        plt.tight_layout()
        plt.show()


    return newly_detected


def draw_circles(img: np.ndarray, detected_circles: List[Tuple[int, int, int]], color: Tuple[int, int, int] = (0, 255, 255), verbose:bool = False):
    if detected_circles is not None:
        for x,y,radius in detected_circles:
            cv2.circle(img, (int(x),int(y)), int(radius), color, 7)

    if verbose:
        cv2.imshow('circles', img)
        if cv2.waitKey(0) & 0xFF == ord('q'):
            cv2.destroyWindow('circles')

    return img


def tile_circles(img: np.ndarray, patch_corners: List[Tuple[int, int, int, int]], found_circles: List[Tuple[int, int, int]]) -> List[Tuple[int, int, int]]:
    '''
    For every patch, check if a circle exists inside, if not assume there is one, 
    Returns a list of (x,y,r) tuples
    '''

    assumed_circles = []

    ## make radius same as the average of the anchor circles' radius
    found_circles = np.array(found_circles)
    radius = int(np.mean(found_circles[:, 2]))
    

    # check every patch
    for l, r, u, d in patch_corners:
        inside = False
        # compare with every circle found so far
        for circle in found_circles:
            x, y, _ = circle
            if l < x and x < r and u < y and y < d:
                inside = True
                break

        # if no circle found inside patch, assume there is one
        if not inside:
            assumed_circles.append([int(l + radius), int(u + radius), int(radius)])

    return assumed_circles

def filter_and_add_circles(first_detected: List[Tuple[int, int, int]], second_detected: List[Tuple[int, int, int]], default_radius: int=70):
    """
    Filter circles in 'second_detected' based on proximity to circles in 'first_detected' 
    and proximity to other circles in 'second_detected'. Concatenate with first detected, return an array containing
    all circles.

    Parameters:
    - first_detected (List): Array of circles detected in the first stage.
    - second_detected (List): Array of circles detected in the second stage.
    - default_radius (int): Default radius for circles.

    Returns:
    - numpy.ndarray: Filtered circles from the second detection stage together with the circles from the first stage.
    """

    ### As the first step, compare circles in second_detected with each other
    # Calculate distances between circles in 'second'

    if len(first_detected) == 0:
        return second_detected
    
    if len(second_detected) == 0:
        return first_detected

    first_detected = np.array(first_detected)
    second_detected = np.array(second_detected)

    all_circles = np.concatenate([first_detected,second_detected],axis = 0)

    result_circles = [i for i in first_detected]

    for circle in second_detected:
        x,y,r = circle
        intersect = False
        for accepted_circle in result_circles:
            x_g, y_g, r_g = accepted_circle
            distance = sqrt((x-x_g) ** 2 + (y-y_g) ** 2)
            if distance < r+r_g:
                intersect = True
        if intersect == False:
            result_circles.append(circle)

    all_circles = np.array(result_circles)
    return all_circles


def get_anchor_row(img: np.ndarray, detected_circles: List[Tuple[int, int, int]], cell_space: float=0.03, error_margin: float=0.15, is_show: bool = False):
    
    
    anchor_circle = detected_circles[0]
    
    anchor_x, anchor_y, anchor_r = anchor_circle
    height,width = img.shape

    plot_img = img.copy()
    plot_img= cv2.cvtColor(plot_img, cv2.COLOR_GRAY2BGR)

    line_up = anchor_y - anchor_r
    line_down = anchor_y + anchor_r

    if line_up < 0:
        line_up = 0
    if line_down > height:
        line_down = height

    cv2.line(plot_img, (0, line_up), (width - 1, line_up), (255, 0, 0), 1)
    cv2.line(plot_img, (0, line_down), (width - 1, line_down), (255, 0, 0), 1)

    patches = []

    space_bw_two_cols = int(anchor_r * 2 * (1 + cell_space))
    column = anchor_x
    while column < width:
        left = int(column - anchor_r)
        right = int(column + anchor_r)
        if left < 0 or right > width:
            break
        cv2.line(plot_img, (left, line_up), (left, line_down), (255, 255, 0), 1)
        cv2.line(plot_img, (right, line_up), (right, line_down), (255, 255, 0), 1)
        patches.append((left, right, line_up, line_down))
        column += space_bw_two_cols

    # columns, go left by starting from one right column of anchor
    column = anchor_x - space_bw_two_cols
    while column > 0:
        left = int(column - anchor_r)
        right = int(column + anchor_r)
        if left < 0 or right > width:
            break
        cv2.line(plot_img, (left, line_up), (left, line_down), (255, 255, 0), 1)
        cv2.line(plot_img, (right, line_up), (right, line_down), (255, 255, 0), 1)
        patches.append((left, right, line_up, line_down))
        column -= space_bw_two_cols

    image_patches = []
    for patch in patches:
        l, r, u, d = patch
        l = l - int(error_margin * anchor_r)
        r = r + int(error_margin * anchor_r)
        u = u - int(error_margin * anchor_r)
        d = d + int(error_margin * anchor_r)
        if l < 0 or r > width or u < 0 or d > height:
            continue
        image_patches.append((l,r,u,d))

        cv2.rectangle(plot_img, (l, u), (r, d), (0, 255, 0), 2)

    if is_show:
        cv2.imshow("Line", plot_img)
        cv2.waitKey(0)
    
    return image_patches

def find_optimal_cellspace(anchor_row_detections: List[Tuple[int, int, int, int]]):
    """
    The function calculates the optimal value of the cell_space that needs to be used in the algorithm. The derivation can be found in the GitLab page. 

    Parameters:
    - anchor_row_detections (List): Array of circles detected in the anchor stage, with the last element being the anchor cell itself.

    Returns:
    - float: The optimal cellspace amount to be used in the grid fitting algorithm.
    """
    anchor_cell = anchor_row_detections[-1]
    anchor_x, anchor_y, anchor_r, anchor_p = anchor_cell

    d_score = 0
    total_p_score = 0

    for cell in anchor_row_detections[:-1]:
        x_c, y_c, r_c, p_c = cell
        total_p_score += abs(p_c - anchor_p)
        d_score += abs(x_c - anchor_x)

    optimal_cell_space = d_score / (2 * anchor_r * total_p_score) - 1
    
    return optimal_cell_space

def find_slope(detected_circles: List[Tuple[int, int, int]], plot_img: np.ndarray, is_show: bool = False):
    x = [point[0] for point in detected_circles]
    y = [point[1] for point in detected_circles]
    r = [point[2] for point in detected_circles]

    print("x:", x)
    print("y:", y)
    print("r:", r)
    # Fit a line
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)

    randomp_1 = (min(x), int(slope * min(x) + intercept)) 
    randomp_2 = (max(x), int(slope * max(x) + intercept))

    angle_radians = np.arctan(slope)
    angle_degrees = np.degrees(angle_radians)

    print("Slope:", slope)
    print("Angle in radians:", angle_radians)
    print("Angle in degrees:", angle_degrees)

    if is_show:
        cv2.line(plot_img, randomp_1, randomp_2, (0, 0, 255), 2)
        cv2.imshow("Line", plot_img)
        cv2.waitKey(0)

    # # Plot data and fitted line
    # plt.scatter(x, y, label='Data')
    # plt.plot(x, slope*x + intercept, color='red', label='Fitted line')
    # plt.xlabel('x')
    # plt.ylabel('y')
    # plt.legend()
    # plt.show()

    # print("Slope:", slope)
    # print("Intercept:", intercept)
    return angle_degrees

def rotate_image(image, angle):
    '''
    Rotate the image by the given angle in degrees.
    '''
    image_center = tuple(np.array(image.shape[1::-1]) / 2)
    rot_mat = cv2.getRotationMatrix2D(image_center, angle, 1.0)
    result = cv2.warpAffine(image, rot_mat, image.shape[1::-1], flags=cv2.INTER_LINEAR)
    return result, rot_mat

def rotate_point(point, angle, center):
    '''
    Rotate the point by the given angle in degrees around the center.
    '''
    angle = np.radians(angle)
    temp_point = point - center
    rotated_point = np.array([
        temp_point[0] * np.cos(angle) - temp_point[1] * np.sin(angle),
        temp_point[0] * np.sin(angle) + temp_point[1] * np.cos(angle)
    ])

    ## make the coordinates int
    return_int = (rotated_point + center).astype(int)

    return return_int
