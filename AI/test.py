from detect import *
from set_grid import *
import glob
from ultralytics import YOLO


# This function belongs to Ege Keyvan, we try to improve this detection, so we use this as a baseline for testing our
# detections
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


def test_detection():
    image_files = glob.glob("./mini_dataset/image*.jpg")

    # Set up the subplot grid
    plt.figure(figsize=(20, 10))

    for default in range(65, 105, 10):
        for min_r in range(30, 65, 10):
            for max_r in range(100, 130, 10):

                for i, file in enumerate(image_files, 1):

                    # Read the image
                    img = cv2.imread(file, cv2.IMREAD_GRAYSCALE)
                    org_img = img.copy()

                    # Detect circles using contour or blob detection
                    detected_contours, detected_circles = detect_circles(img, default, max_r, min_r)

                    # Create subplot for original image contours
                    plt.subplot(4, 2, i)
                    original_img_rgb_dark = cv2.cvtColor(org_img, cv2.COLOR_GRAY2RGB)
                    if detected_contours is not None:
                        for x, y, radius in detected_circles:
                            cv2.circle(original_img_rgb_dark, (x, y), int(radius), (255, 0, 255), 5)
                    plt.imshow(original_img_rgb_dark)
                    plt.axis('off')

                plt.suptitle(f"Results for def:{default},min:{min_r},max:{max_r}")                
                plt.tight_layout()
                plt.savefig(f'./results/grid_search/d{default}f{min_r}t{max_r}.png')


def test_lines(image_path, occlude = False):
    
    sample_image = cv2.imread(image_path,cv2.IMREAD_GRAYSCALE)

    plot_img = cv2.cvtColor(sample_image, cv2.COLOR_GRAY2RGB)
    point_img = plot_img.copy()


    first_detected_circles, _, _ = return_hough(sample_image)
    all_detected_circles = first_detected_circles

    # plot_img = draw_parallel_grid(plot_img,first_detected_circles)

    if first_detected_circles is None:
        return []
    
    point_img, first_grid, second_grid, first_tight, second_tight = get_patches(point_img, first_detected_circles,
                                                                                cell_space=0.03, error_margin=0.15)

    second_detect_circles,patches = detect_second_stage(sample_image,first_grid,second_grid,first_detected_circles)
    
    if second_detect_circles is not None:
        second_detect_circles = filter_circles(first_detected_circles,second_detect_circles)
        
        all_detected_circles = np.vstack([all_detected_circles,second_detect_circles])

    tiled_circles = tile_circles(sample_image,first_tight,second_tight, all_detected_circles)
    tiled_circles = filter_circles(all_detected_circles,tiled_circles)
    
    if tiled_circles != []:
        all_detected_circles = np.vstack([all_detected_circles,tiled_circles])

    # if occlude:
    #     model = YOLO('AI/bee_segment_model.pt')
    #     bee_mask = create_bee_mask(model,sample_image)
    #     all_detected_circles = filter_intersecting_circles(all_detected_circles,bee_mask)
    
    # plot_img = draw_circles(plot_img,all_detected_circles)

    # plot_img = draw_circles(plot_img,first_detected_circles,(255,255,0))
    # plot_img = draw_circles(plot_img,second_detect_circles,(0,128,255))
    # plot_img = draw_circles(plot_img,tiled_circles,color=(255,128,0))

    # plt.imshow(plot_img)
    # plt.show()

    return all_detected_circles
    


if __name__ == "__main__":
    test_lines("AI/test_images/image_1219.jpg",False)
