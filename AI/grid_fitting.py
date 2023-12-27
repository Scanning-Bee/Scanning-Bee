import cv2
import numpy as np
from preprocess import *
from detect import *

sample_image = cv2.imread('AI/test_images/image_1219.jpg')
sample_image_rgb = sample_image.copy()
sample_image = cv2.cvtColor(sample_image, cv2.COLOR_BGR2GRAY)
FOUR_OVER_ROOT3 = 2.309401077
TWO_OVER_ROOT3 = 1.154700538
ROOT3 = 1.732050808


def draw_hexagon(circle, image):
    global FOUR_OVER_ROOT3, TWO_OVER_ROOT3, ROOT3
    
    x, y, r = circle 
    
    TOP = y - r
    if TOP < 0:
        print(1)
        return sample_image, True

    R2_OVER_ROOT3 = r * TWO_OVER_ROOT3
    LEFTMOST = x - R2_OVER_ROOT3
    if LEFTMOST < 0:
        print(2)
        return sample_image, True

    height, width, _ = image.shape

    BOTTOM = y + r
    if BOTTOM > height:
        print(3)
        return sample_image, True

    RIGHTMOST = x + R2_OVER_ROOT3
    if RIGHTMOST > width:
        print(4)
        return sample_image, True

    # no borders will be crossed

    R_ROOT3 = r * ROOT3
    R_OVER_ROOT3 = r / ROOT3

    #pts = np.array([[LEFTMOST, y], [x - R_OVER_ROOT3, TOP], [x + R_OVER_ROOT3, TOP], [RIGHTMOST,y], [x + R_OVER_ROOT3, BOTTOM], [x - R_OVER_ROOT3, BOTTOM]], np.int32)
    pts = np.array([[x - r, y - R_OVER_ROOT3], [x - r, y + R_OVER_ROOT3], [x, y + r * TWO_OVER_ROOT3], [x + r,  y + R_OVER_ROOT3], [x + r, y - R_OVER_ROOT3], [x, y - r * TWO_OVER_ROOT3]], np.int32)
    
    pts = pts.reshape((-1,1,2))
    cv2.polylines(sample_image,[pts],True,(0,255,255))
    return sample_image, False


circle_org = (515, 291, 79) # x, y, r

circle = (515, 291, 79)
x, y, r = circle
height, width = sample_image.shape


# the bottom boundaries for the circles
supposed_cells = []

line_height = y + r
while line_height < height:
    cv2.line(sample_image_rgb, (0, line_height),  (width - 1, line_height), (255, 0, 0), 1)
    line_height += int(r * 3 * TWO_OVER_ROOT3 + 15)

line_height = y + r - int(r * 3 * TWO_OVER_ROOT3 + 15)
while (line_height > 0):
    cv2.line(sample_image_rgb, (0, line_height),  (width - 1, line_height), (255, 0, 0), 1)
    line_height -= int(r * 3 * TWO_OVER_ROOT3 + 15)

# the top boundaries for the circles
line_height = y - r 
while line_height > 0:
    cv2.line(sample_image_rgb, (0, line_height),  (width - 1, line_height), (0, 0, 255), 1)
    line_height -= int(r * 3 *TWO_OVER_ROOT3 + 15)

line_height = y - r + int(r * 3 *TWO_OVER_ROOT3 + 15)
while (line_height < height):
    cv2.line(sample_image_rgb, (0, line_height),  (width - 1, line_height), (0, 0, 255), 1)
    line_height += int(r * 3 * TWO_OVER_ROOT3 + 15)

# the right boundaries for the circles
vertical_line = x + r
while vertical_line > 0:
    cv2.line(sample_image_rgb, (vertical_line, 0),  (vertical_line, height - 1), (0, 255, 0), 1)
    vertical_line -= int(2 * r)

# the left boundaries for the circles
vertical_line = x - r
while vertical_line < width:
    cv2.line(sample_image_rgb, (vertical_line, 0),  (vertical_line, height - 1), (0, 255, 0), 1)
    vertical_line += int(2 * r)

cv2.imshow('Line Drawn', sample_image_rgb)
cv2.waitKey(0)
cv2.destroyAllWindows()


def detect_circle_on_clip(sample_image):
    sample_image = cv2.cvtColor(sample_image, cv2.COLOR_BGR2GRAY)

    peak = plot_img_hist(sample_image)
    dark_flag = False
    if peak <= 127:
        dark_flag = True
        sample_image = ~sample_image

    sample_image[sample_image < (peak - 20)] = np.mean(sample_image[sample_image >= (peak - 20)])
    sample_image = contrast_stretching(sample_image)
    peak = plot_img_hist(sample_image)
    sample_image[sample_image < (peak - 10)] = 0
    sample_image[sample_image >= (peak - 10)] = 255
    retval, sample_image = cv2.threshold(sample_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

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
    return circles[0]
    #circles = detect_hough(sample_image)


sample_image = cv2.imread('AI/test_images/Screenshot from 2023-12-25 16-27-20.png')
sample_image_org = sample_image.copy()

circles = detect_circle_on_clip(sample_image)
if circles is not None:
    for circle in circles:
        x, y, radius = circle
        cv2.circle(sample_image_org, (int(x), int(y)), int(radius), (255, 0, 255), 1)

#sample_image = sigmoid_contrast_stretching(sample_image, 10, 0.5)
        
    
if circles is not None:
    cv2.imshow('Circle found! (original image)', sample_image_org)
else:
    cv2.imshow('Circle not found! (processed image)', sample_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
print("peak value:", peak)
print(sample_image.shape)
print(circles)
    #sample_image = cv2.imread('test_images/Screenshot from 2023-12-25 16-23-35.png')
    #sample_image = cv2.imread('test_images/Screenshot from 2023-12-24 02-30-30.png')
    #sample_image = cv2.imread('test_images/Screenshot from 2023-12-25 14-46-34.png')
    #sample_image = cv2.imread('test_images/Screenshot from 2023-12-25 14-54-49.png')
    #sample_image = cv2.imread('test_images/Screenshot from 2023-12-25 15-48-39.png')


'''
kernel = np.ones((5,5),np.uint8)
#sample_image = cv2.erode(sample_image, kernel, iterations = 1)
kernel = np.ones((3,3),np.uint8)
#kernel = np.ones((5,5),np.uint8)
#sample_image = cv2.medianBlur(sample_image, 5)
#sample_image = cv2.morphologyEx(sample_image, cv2.MORPH_OPEN, kernel)
'''