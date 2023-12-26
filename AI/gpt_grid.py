import cv2
import numpy as np

def fit_diamond_grid(circles):
    # Sort circles by x-coordinate
    sorted_circles = sorted(circles, key=lambda c: c[0])

    # Extract circle information
    x1, y1, r1 = sorted_circles[0]
    x2, y2, r2 = sorted_circles[1]
    x3, y3, r3 = sorted_circles[2]

    # Calculate midpoints and slopes of the lines connecting the circle centers
    mid1 = ((x1 + x2) // 2, (y1 + y2) // 2)
    mid2 = ((x2 + x3) // 2, (y2 + y3) // 2)
    mid3 = ((x3 + x1) // 2, (y3 + y1) // 2)

    # Handle the case where the denominator in slope calculation is zero
    try:
        slope1 = -1 / ((y2 - y1) / (x2 - x1))
        slope2 = -1 / ((y3 - y2) / (x3 - x2))
        slope3 = -1 / ((y1 - y3) / (x1 - x3))
    except ZeroDivisionError:
        print("Error: Division by zero in slope calculation. Check if the circles are aligned.")
        return None

    # Calculate intersection points to form the diamond
    intersection_point1 = find_intersection(mid1, slope1, mid2, slope2)
    intersection_point2 = find_intersection(mid2, slope2, mid3, slope3)
    intersection_point3 = find_intersection(mid3, slope3, mid1, slope1)

    diamond_corners = np.array([intersection_point1, intersection_point2, intersection_point3], dtype=np.int32)

    return diamond_corners

def find_intersection(point1, slope1, point2, slope2):
    x1, y1 = point1
    x2, y2 = point2

    x = (slope1 * x1 - y1 - slope2 * x2 + y2) / (slope1 - slope2)
    y = slope1 * (x - x1) + y1

    return int(x), int(y)

# Example: Your three circles with known centers (x, y) and radii (r)
circle1 = (100, 100, 50)
circle2 = (200, 150, 50)
circle3 = (300, 100, 50)

# Arrange the circles in a list
circles = [circle1, circle2, circle3]

# Fit a diamond grid
diamond_corners = fit_diamond_grid(circles)

# Create an arbitrary image for visualization
image_size = (400, 500)
image = np.zeros(image_size, dtype=np.uint8)  # Creating a blank image

# Draw the circles
cv2.circle(image, (circle1[0], circle1[1]), circle1[2], 255, -1)
cv2.circle(image, (circle2[0], circle2[1]), circle2[2], 255, -1)
cv2.circle(image, (circle3[0], circle3[1]), circle3[2], 255, -1)

# Draw the fitted diamond grid
cv2.polylines(image, [diamond_corners], isClosed=True, color=255, thickness=2)

# Display the image
cv2.imshow('Arbitrary Image with Circles and Fitted Diamond Grid', image)
cv2.waitKey(0)
cv2.destroyAllWindows()
