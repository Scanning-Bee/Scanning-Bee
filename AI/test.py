from detect import *
import glob


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


def main():
    image_files = glob.glob("./mini_dataset/image*.jpg")

    # Set up the subplot grid
    plt.figure(figsize=(20, 10))

    for default in range(65,105,10):
        for min_r in range(30,65,10):
            for max_r in range(100,130,10):
 
                
                for i, file in enumerate(image_files, 1):

                    # Read the image
                    img = cv2.imread(file, cv2.IMREAD_GRAYSCALE)
                    org_img = img.copy()

                    # Detect circles using contour or blob detection
                    detected_contours, detected_circles = detect_circles(img,default, max_r, min_r)

                    # Create subplot for original image contours
                    plt.subplot(4, 2, i)
                    original_img_rgb_dark = cv2.cvtColor(org_img, cv2.COLOR_GRAY2RGB)
                    if detected_contours is not None:
                        for x, y, radius in detected_circles:
                            cv2.circle(original_img_rgb_dark, (x,y), int(radius), (255, 0, 255), 5)
                    plt.imshow(original_img_rgb_dark)
                    plt.axis('off')

                plt.suptitle(f"Results for def:{default},min:{min_r},max:{max_r}")                
                plt.tight_layout()
                plt.savefig(f'./results/grid_search/d{default}f{min_r}t{max_r}.png')

if __name__ == "__main__":
    main()
