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


def contrast_stretching(img):
    min_intensity = 0
    max_intensity = 255
    min_pixel = np.min(img)
    max_pixel = np.max(img)

    stretched_img = (img - min_pixel) / (max_pixel - min_pixel) * (max_intensity - min_intensity) + min_intensity
    stretched_img = np.uint8(stretched_img)

    return stretched_img


def plot_img_hist(img):
    hist = cv2.calcHist([img], [0], None, [256], [0, 256])
    hist = hist.ravel()

    plt.figure(figsize=(8, 6))
    plt.title('Grayscale Image Histogram')
    plt.xlabel('Pixel Value')
    plt.ylabel('Frequency')
    plt.plot(hist, color='black')
    plt.xlim(0, 256)
    plt.grid(True)
    plt.show()

def find_first_peak(img):

    q_int = 8
    # Calculate the histogram
    hist, bins = np.histogram(img.flatten(), bins=256 // q_int, range=[0, 256])

    # Calculate the 1st and 2nd derivatives
    first_derivative = np.diff(hist)
    second_derivative = np.diff(first_derivative)

    # Find indices where the 1st derivative changes sign
    zero_crossings_first = np.where(np.diff(np.sign(first_derivative)))[0]+1  # 0-based index

    # Find indices where the 2nd derivative changes sign
    zero_crossings_second = np.where(np.diff(np.sign(second_derivative)))[0]+2  # 0-based index

    # Determine local maxima using the 2nd derivative
    local_maxima_indices = zero_crossings_second[second_derivative[zero_crossings_second - 1] < 0]

    first_peak_value = (local_maxima_indices[0]+2) * q_int

    return first_peak_value
