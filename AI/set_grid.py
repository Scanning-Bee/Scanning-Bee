from detect import *
from preprocess import *


FOUR_OVER_ROOT3 = 2.309401077
TWO_OVER_ROOT3 = 1.154700538
ROOT3 = 1.732050808
TAN120 = 1.732050808


def draw_parallel_grid_n_circles(plot_img,detected_circles,slope = TAN120):

    height, width, _ = plot_img.shape

    if detect_circles is not None:
        for x,y,radius in detected_circles:
            cv2.circle(plot_img, (int(x),int(y)), int(radius), (255, 0, 255), 5)
            
    the_circle = detected_circles[0]
    x,y,r = [int(i) for i in the_circle]

    line_height = y + r 
    while (line_height < height):
        cv2.line(plot_img, (0, line_height),  (width - 1, line_height), (255, 0, 0), 1)
        line_height += int(r * 3 * TWO_OVER_ROOT3 + 15)

    line_height = y + r - int(r * 3 * TWO_OVER_ROOT3 + 15)
    while (line_height > 0):
        cv2.line(plot_img, (0, line_height),  (width - 1, line_height), (255, 0, 0), 1)
        line_height -= int(r * 3 * TWO_OVER_ROOT3 + 15)

    line_height = y - r 
    while (line_height > 0):
        cv2.line(plot_img, (0, line_height),  (width - 1, line_height), (0, 0, 255), 1)
        line_height -= int(r * 3 *TWO_OVER_ROOT3 + 15)

    line_height = y - r + int(r * 3 *TWO_OVER_ROOT3 + 15)
    while (line_height < height):
        cv2.line(plot_img, (0, line_height),  (width - 1, line_height), (0, 0, 255), 1)
        line_height += int(r * 3 * TWO_OVER_ROOT3 + 15)
        
    temp_r = int(r + 0.2 * r)
    point = [x+temp_r, y]

    while(point[0] < width):
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
        point[0] = point[0] +  2 * temp_r

    while(point[0] > 0):
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
        point[0] = point[0] -  2 * temp_r

    return plot_img


def get_patches(img, detected_circles, cell_space = 0.15):
    height, width,_ = img.shape

    if detected_circles is None:
        return None
    
    # get the most confidence circle
    x,y,r = [int(i) for i in detected_circles[0]]
    inc_r = r + cell_space *r

    horizontal_lines = []

    line_height = y + r 
    while (line_height < height):
        horizontal_lines.append(line_height)
        cv2.line(img, (0, line_height),  (width - 1, line_height), (0, 0, 255), 1)
        line_height += int(r * 3 * TWO_OVER_ROOT3 + 15)

    line_height = y + r - int(r * 3 * TWO_OVER_ROOT3 + 15)
    while (line_height > 0):
        horizontal_lines.append(line_height)
        cv2.line(img, (0, line_height),  (width - 1, line_height), (0, 0, 255), 1)
        line_height -= int(r * 3 * TWO_OVER_ROOT3 + 15)

    line_height = y - r 
    while (line_height > 0):
        horizontal_lines.append(line_height)
        cv2.line(img, (0, line_height),  (width - 1, line_height), (0, 0, 255), 1)
        line_height -= int(r * 3 *TWO_OVER_ROOT3 + 15)

    line_height = y - r + int(r * 3 *TWO_OVER_ROOT3 + 15)
    while (line_height < height):
        horizontal_lines.append(line_height)
        cv2.line(img, (0, line_height),  (width - 1, line_height), (0, 0, 255), 1)
        line_height += int(r * 3 * TWO_OVER_ROOT3 + 15)

    horizontal_lines.sort()

    horizontal_pairs = [(horizontal_lines[i], horizontal_lines[i + 1]) for i in range(len(horizontal_lines) - 1)]


    vertical_lines = []
    vertical_line = x + r
    while (vertical_line < width):
        vertical_lines.append(vertical_line)
        vertical_line += int(2 * inc_r)

    # the left boundaries for the circles
    vertical_line = x - r
    while (vertical_line > 0):
        vertical_lines.append(vertical_line)
        vertical_line -= int(2 * inc_r)
    
    vertical_lines.sort()

    slided_vertical_lines = [int(i + inc_r) for i in vertical_lines]

    vertical_pairs = [(vertical_lines[i], vertical_lines[i + 1]) for i in range(len(vertical_lines) - 1)]

    slided_vertical_pairs = [(slided_vertical_lines[i], slided_vertical_lines[i + 1]) for i in range(len(slided_vertical_lines) - 1)]


    print(horizontal_lines)
    print(horizontal_pairs)

    print(vertical_lines)
    print(vertical_pairs)

    print(slided_vertical_lines)
    print(slided_vertical_pairs)


    color = (0, 255, 0)  # Green color
    radius = 5  # You can adjust the size of the point by changing the radius
    thickness = -1  # Negative thickness fills the circle
    for y in horizontal_lines:
        for x in vertical_lines:
            cv2.circle(img, (x,y), radius, color, thickness)

    # color = (0, 0, 255)  # Green color
    # for x in horizontal_lines:
    #     for y in slided_vertical_lines:
    #         cv2.circle(img, (x,y), radius, color, thickness)

    return img