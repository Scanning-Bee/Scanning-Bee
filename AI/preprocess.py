import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
from scipy.signal import convolve2d

def convolve(image, kernel, threshold):
    result_scipy = convolve2d(image / 255, kernel / 255, mode='same')
    normalized_result = cv2.normalize(result_scipy, None, 0, 255, cv2.NORM_MINMAX)
    normalized_result[normalized_result < threshold] = 0

    return normalized_result

def sigmoid(x, a, b):
    """
    Sigmoid function with parameters 'a' and 'b'.
    """
    return 1 / (1 + np.exp(-a * (x - b)))

def sigmoid_contrast_stretching(img, a, b):
    """
    Apply sigmoid-like contrast stretching to an image.
    'a' and 'b' are parameters that control the shape of the sigmoid function.
    """
    min_intensity = 0
    max_intensity = 255

    # Normalize pixel values to the range [0, 1]
    normalized_img = (img - np.min(img)) / (np.max(img) - np.min(img))

    # Apply the sigmoid function
    stretched_img = sigmoid(normalized_img, a, b)

    # Map the stretched values to the desired intensity range
    stretched_img = (stretched_img * (max_intensity - min_intensity)) + min_intensity

    # Convert to unsigned 8-bit integer
    stretched_img = np.uint8(stretched_img)

    return stretched_img

def contrast_stretching(img):

    ### TODO try a sigmoid like contrast stretching
    min_intensity = 0
    max_intensity = 255
    min_pixel = np.min(img)
    max_pixel = np.max(img)

    stretched_img = (img - min_pixel) / (max_pixel - min_pixel) * (
        max_intensity - min_intensity
    ) + min_intensity
    stretched_img = np.uint8(stretched_img)

    return stretched_img


def plot_img_hist(img):
    hist = cv2.calcHist([img], [0], None, [256], [0, 256])
    hist = hist.ravel()

    plt.figure(figsize=(8, 6))
    plt.title("Grayscale Image Histogram")
    plt.xlabel("Pixel Value")
    plt.ylabel("Frequency")
    plt.plot(hist, color="black")
    plt.xlim(0, 256)
    plt.grid(True)
    plt.show()
    plt.close()


def find_first_peak(img):
    q_int = 8
    # Calculate the histogram
    hist, bins = np.histogram(img.flatten(), bins=256 // q_int, range=[0, 256])

    # Calculate the 1st and 2nd derivatives
    first_derivative = np.diff(hist)
    second_derivative = np.diff(first_derivative)

    # Find indices where the 1st derivative changes sign
    zero_crossings_first = (
        np.where(np.diff(np.sign(first_derivative)))[0] + 1
    )  # 0-based index

    # Find indices where the 2nd derivative changes sign
    zero_crossings_second = (
        np.where(np.diff(np.sign(second_derivative)))[0] + 2
    )  # 0-based index

    # Determine local maxima using the 2nd derivative
    local_maxima_indices = zero_crossings_second[
        second_derivative[zero_crossings_second - 1] < 0
    ]

    first_peak_value = (local_maxima_indices[0] + 2) * q_int

    return first_peak_value

def preprocess_dark_img(img,blur_kernel_size:int=11, open_kernel_size:int=15):
    
    blurred_image = cv2.medianBlur(img, blur_kernel_size)

    better_light = sigmoid_contrast_stretching(blurred_image,15,0.4)

    dark_thresh = find_first_peak(better_light)
    
    _, binary_img = cv2.threshold(better_light, dark_thresh, 255, cv2.THRESH_BINARY_INV)

    kernel = np.ones((open_kernel_size, open_kernel_size), np.uint8)

    # Apply opening operation
    opening_result = cv2.morphologyEx(binary_img, cv2.MORPH_OPEN, kernel)

    return opening_result, better_light


def preprocess_light_img(img,blur_kernel_size:int=11, open_kernel_size:int=15):

    inverse_img = cv2.bitwise_not(img)
    blurred_image = cv2.medianBlur(inverse_img, blur_kernel_size)

    # plot_img_hist(blurred_image)
    dark_thresh = find_first_peak(blurred_image)
    filtered_img = np.zeros_like(blurred_image)
    filtered_img[blurred_image < dark_thresh] = 128

    better_light = contrast_stretching(filtered_img)

    _, binary_img = cv2.threshold(better_light, dark_thresh, 255, cv2.THRESH_BINARY)

    kernel = np.ones((open_kernel_size, open_kernel_size), np.uint8)

    # Apply opening operation
    opening_result = cv2.morphologyEx(binary_img, cv2.MORPH_OPEN, kernel)

    return opening_result
   