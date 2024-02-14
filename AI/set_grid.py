from .detect import *
from .preprocess import *

FOUR_OVER_ROOT3 = 2.309401077
TWO_OVER_ROOT3 = 1.154700538
THREE_OVER_ROOT3 = 1.732050808
ROOT3 = 1.732050808
TAN120 = 1.732050808


def draw_parallel_grid(plot_img, detected_circles, slope=TAN120):
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


def get_patches(img, detected_circles, cell_space=0.15, error_margin=0.5):
    height, width, _ = img.shape

    if detected_circles is None:
        return None

    # get the most confidence circle
    x, y, r = [int(i) for i in detected_circles[0]]
    r = int(np.mean(detected_circles, axis=0)[2])

    # first grid
    horizontal_lines = []
    vertical_lines = []

    # rows
    line = y
    while line < height:
        up = int(line - r)
        down = int(line + r)
        if up < 0 or down > height:
            break
        horizontal_lines.append((up, down))
        line += int(r * 3 * TWO_OVER_ROOT3 * (1 + cell_space))

    line = y - int(r * 3 * TWO_OVER_ROOT3 * (1 + cell_space))
    while line > 0:
        up = int(line - r)
        down = int(line + r)
        if up < 0 or down > height:
            break
        horizontal_lines.append((up, down))
        line -= int(r * 3 * TWO_OVER_ROOT3 * (1 + cell_space))

    # columns
    column = x
    while column < width:
        left = int(column - r)
        right = int(column + r)
        if left < 0 or right > width:
            break
        vertical_lines.append((left, right))
        # vertical_lines.append((left,right)) 
        column += int(r * 2 * (1 + cell_space))

    column = x - int(r * 2 * (1 + cell_space))
    while column > 0:
        left = int(column - r)
        right = int(column + r)
        if left < 0 or right > width:
            break
        vertical_lines.append((left, right))
        # vertical_lines.append((left,right)) 
        column -= int(r * 2 * (1 + cell_space))

    # second, slided grid
    slided_horizontal_lines = []
    slided_vertical_lines = []

    # rows
    line = y + THREE_OVER_ROOT3 * r
    while line < height:
        up = int(line - r)
        down = int(line + r)
        if up < 0 or down > height:
            break
        slided_horizontal_lines.append((up, down))
        line += int(r * 3 * TWO_OVER_ROOT3 * (1 + cell_space))

    line = y + THREE_OVER_ROOT3 * r - int(r * 3 * TWO_OVER_ROOT3 * (1 + cell_space))
    while line > 0:
        up = int(line - r)
        down = int(line + r)
        if up < 0 or down > height:
            break
        slided_horizontal_lines.append((up, down))
        line -= int(r * 3 * TWO_OVER_ROOT3 * (1 + cell_space))

    # columns
    column = x + r
    while column < width:
        left = int(column - r)
        right = int(column + r)
        if left < 0 or right > width:
            break
        slided_vertical_lines.append((left, right))
        # vertical_lines.append((left,right)) 
        column += int(r * 2 * (1 + cell_space))

    column = x + r - int(r * 2 * (1 + cell_space))
    while column > 0:
        left = int(column - r)
        right = int(column + r)
        if left < 0 or right > width:
            break
        slided_vertical_lines.append((left, right))
        # vertical_lines.append((left,right)) 
        column -= int(r * 2 * (1 + cell_space))

    first_grid = []
    second_grid = []

    first_tight = []
    second_tight = []

    # create and draw grids
    for row in horizontal_lines:
        for column in vertical_lines:
            up = int(row[0] - error_margin * r)
            down = int(row[1] + error_margin * r)
            left = int(column[0] - error_margin * r)
            right = int(column[1] + error_margin * r)
            # cv2.line(img,(left,up),(right,up),(255,255,0),3)
            # cv2.line(img,(right,up),(right,down),(255,255,0),3)
            # cv2.line(img,(right,down),(left,down),(255,255,0),3)
            # cv2.line(img,(left,down),(left,up),(255,255,0),3)
            first_grid.append((left, right, up, down))
            first_tight.append((int(column[0]), int(column[1]), int(row[0]), int(row[1])))

    for row in slided_horizontal_lines:
        for column in slided_vertical_lines:
            up = int(row[0] - error_margin * r)
            down = int(row[1] + error_margin * r)
            left = int(column[0] - error_margin * r)
            right = int(column[1] + error_margin * r)
            # cv2.line(img,(left,up),(right,up),(0,255,0),3)
            # cv2.line(img,(right,up),(right,down),(0,255,0),3)
            # cv2.line(img,(right,down),(left,down),(0,255,0),3)
            # cv2.line(img,(left,down),(left,up),(0,255,0),3)
            second_grid.append((left, right, up, down))
            second_tight.append((int(column[0]), int(column[1]), int(row[0]), int(row[1])))

    return img, first_grid, second_grid, first_tight, second_tight


def detect_second_stage(img, first_grid, second_grid, first_detected):
    newly_detected = []

    patches = []

    radius = int(np.mean(first_detected, axis=0)[2])

    for l, r, u, d in first_grid:
        inside = False
        for circle in first_detected:
            x, y, _ = circle
            if l < x and x < r and u < y and y < d:
                inside = True
                break

        if not inside:
            patch = img[u:d, l:r]
            patches.append(patch)
            try:
                circles = detect_circle_on_clip(patch)[:1]
            except:
                circles = None
            if circles is not None:
                for circle in circles:
                    x, y, _ = circle
                    newly_detected.append([int(x + l), int(y + u), int(radius)])

    for l, r, u, d in second_grid:
        inside = False
        for circle in first_detected:
            x, y, _ = circle
            if l < x and x < r and u < y and y < d:
                inside = True
                break

        if not inside:
            patch = img[u:d, l:r]
            patches.append(patch)
            try:
                circles = detect_circle_on_clip(patch)[:1]
            except:
                circles = None
            if circles is not None:
                for circle in circles:
                    x, y, _ = circle
                    newly_detected.append([int(x + l), int(y + u), int(radius)])

    return newly_detected, patches


def draw_circles(img, detected_circles, color=(0, 255, 255)):
    if detect_circles is not None:
        for x,y,radius in detected_circles:
            cv2.circle(img, (int(x),int(y)), int(radius), color, 7)

    return img


def tile_circles(img, first_grid, second_grid, first_detected):
    newly_detected = []

    radius = int(np.mean(first_detected, axis=0)[2])

    for l, r, u, d in first_grid:
        inside = False
        for circle in first_detected:
            x, y, _ = circle
            if l < x and x < r and u < y and y < d:
                inside = True
                break

        if not inside:
            newly_detected.append([int(l + radius), int(u + radius), int(radius)])

    for l, r, u, d in second_grid:
        inside = False
        for circle in first_detected:
            x, y, _ = circle
            if l < x and x < r and u < y and y < d:
                inside = True
                break

        if not inside:
            newly_detected.append([int(l + radius), int(u + radius), int(radius)])

    return newly_detected


def filter_circles(first_detected, second_detected, default_radius=70):
    all_circles = first_detected

    def check_circle(x, y, radius):
        # check of proximity
        for x_c, y_c, _ in all_circles:
            distance = np.sqrt((x_c - x) ** 2 + (y_c - y) ** 2)
            if distance < 1.5 * default_radius:
                return False
        return True

    filtered_second = []
    for x, y, r in second_detected:
        if check_circle(x, y, r):
            filtered_second.append([x, y, r])
            all_circles = np.append(all_circles, [[x, y, r]], axis=0)

    return filtered_second
