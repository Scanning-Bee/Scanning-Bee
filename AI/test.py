from detect import *


## This function belongs to Ege Keyvan, we try to improve this detection, so we use this as a baseline for testing our detections
def process_image(img: np.ndarray):
    gray = img
    # gray = cv2.cvtColor(cv2.bitwise_not(img), cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(21, 21))
    gray = cv2.medianBlur(gray, 11)

    _, th3 = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    th3 = clahe.apply(th3)

    detected_circles = cv2.HoughCircles(
        th3,
        cv2.HOUGH_GRADIENT,
        1,
        minDist=200,
        param1=200,
        param2=18,
        minRadius=70,
        maxRadius=150,
    )

    if detected_circles is not None:
        detected_circles = np.array(np.around(detected_circles), dtype=np.uint16)

    return detected_circles, th3


def test_circles():
    image_folder = "./AI/test_images/"
    image_files = ["close_up_1.jpg", "close_up_2.jpg", "close_up_3.jpg"]

    for i, file in enumerate(image_files, 1):
        img_path = os.path.join(image_folder, file)
        print(img_path)
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        org_img = img.copy()

        processed_circles, processed_img = process_image(img)

        detected_contours, min_enclosing_circles = detect_circles(img,70, 120, 50)

        plt.subplot(3, 3, 3 * i - 2)
        plt.imshow(processed_img, cmap='gray')
        plt.title(f'Processed Image {i}')
        plt.axis('off')

        plt.subplot(3, 3, 3 * i - 1)
        img_rgb = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        if processed_circles is not None:
            for circle in processed_circles[0, :]:
                cv2.circle(img_rgb, (circle[0], circle[1]), circle[2], (0, 255, 0), 5)
        plt.imshow(img_rgb)
        plt.title(f'Original with Processed Circles {i}')
        plt.axis('off')

        plt.subplot(3, 3, 3 * i)
        original_img_rgb = cv2.cvtColor(org_img, cv2.COLOR_GRAY2RGB)  #Convert to 3-channel RGB
        if detected_contours is not None:
            cv2.drawContours(original_img_rgb, detected_contours, -1, (255, 0, 0), 5)
            for center, radius in min_enclosing_circles:
                cv2.circle(original_img_rgb, center, radius, (255, 0, 255), 5)
        plt.imshow(original_img_rgb)
        plt.title(f'Original with Detected Circles {i}')
        plt.axis('off')

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    test_circles()