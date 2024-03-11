from set_grid import *
import glob
from ultralytics import YOLO
from typing import List, Tuple
from PIL import Image 

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


manual_bbox_paths = {"..\datasets\2023-10-08-12-01-05\image_651.jpg ":"..\datasets\no_bee_test\image_651.txt",
                     "..\datasets\2023-10-08-12-01-05\image_2355.jpg ":"..\datasets\no_bee_test\image_2355.txt",
                     "..\datasets\2023-10-08-12-01-05\image_2612.jpg ":"..\datasets\no_bee_test\image_2612.txt",
                     "..\datasets\2023-10-08-12-01-05\image_3193.jpg ":"..\datasets\no_bee_test\image_3193.txt",
                     "..\datasets\2023-10-08-12-01-05\image_3389.jpg ":"..\datasets\no_bee_test\image_3389.txt",
                     "..\datasets\2023-10-08-12-01-05\image_4208.jpg ":"..\datasets\no_bee_test\image_4208.txt",
                     "..\datasets\2023-10-08-12-01-05\image_4640.jpg ":"..\datasets\no_bee_test\image_4640.txt",
                     "..\datasets\2023-10-08-12-01-05\image_4715.jpg ":"..\datasets\no_bee_test\image_4715.txt",
                     "..\datasets\2023-10-08-12-01-05\image_6116.jpg ":"..\datasets\no_bee_test\image_6116.txt",
                     "..\datasets\2023-10-08-12-01-05\image_7632.jpg ":"..\datasets\no_bee_test\image_7632.txt",
                     }

def test_lines(image_path: str, occlude:bool = False, detection_model_path:str = 'AI/models/bee_detect_models/bee_model_v2.pt',cell_space:float = 0.4, error_margin:float = 0.7, intersect_threshold:float = 0.3) -> List[Tuple[int, int, int]]:
    '''
    The latest version of the circle detection code, made for the CENG49X Design Project Course.
    - image_path is the path of the object image
    - occlude is a flag for choosing whether the bee occlusion mask should be enabled. It is highly
    
    recommended not to enable it for now, because the segmentation model must be strengthened.
    
    TODO update the docstring when the segmentation model is updated.

    Returns a list of (x, y, r) tuples, that being the detected circles.
    '''

    ## read original image in gray_scale, used for first and second stage processing
    sample_image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    height, width = sample_image.shape

    ## get a rgb copy of original image for model input and plotting
    plot_img = cv2.cvtColor(sample_image, cv2.COLOR_GRAY2RGB)

    ## this is a binary mask which will be used to check intersection of bees with cells
    mask = np.ones_like(sample_image) * 255
    
    if occlude:
        try:
            ## using yolov8 bee detection model
            model = YOLO(detection_model_path)
            # print("Bee detection model loaded")
            prediction = model(plot_img,verbose= True)[0]
            scores = prediction.boxes.conf
            bboxes = prediction.boxes.xyxy

            ## mark where bees are on binary mask
            for score,bbox in zip(scores,bboxes):
                if score < 0.4:
                    continue
                x1,y1,x2,y2 = list(map(int,bbox))
                cv2.rectangle(mask,(x1,y1),(x2,y2),color = (0,0,0), thickness = -1)


            ## uncomment to use manual_annotation_files
            # if image_path in manual_bbox_paths.keys():
            #     print("Manual annotation loaded")
            #     annot_file = open(manual_bbox_paths[image_path])
            #     lines = annot_file.readlines()

            #     for line in lines:
            #         #class x_center y_center width height normalized
            #         cls, x_center, y_center, w, h =  line.split(" ")
            #         x_center = x_center * width
            #         y_center = y_center * height
            #         w = w * width
            #         h = h * height
            #         x1 = int(x_center - w)
            #         x2 = int(x_center + w)
            #         y1 = int(y_center - h)
            #         y2 = int(y_center + h)
            #         cv2.rectangle(mask,(x1,y1),(x2,y2),color = (0,0,0), thickness = -1)

        ## if model cannot be found, do not change the mask, continue without occlusion
        except Exception as error:
            print(error)
            print("Bee detection model could not be loaded, please fix the above error and try again")

    ## first stage of detection, uses hough transform to detect circles, see function for preprocessing
    first_stage_circles = detect_circles_using_hough_transform(sample_image,use_dark=True,use_light=False)
    
    ## filter out the circles from first stage that are occluded by bees
    filtered_first_stage_circles = filter_intersecting_circles(first_stage_circles, mask)

    ## if no circles found, return earlt since we have no anchor
    if len(filtered_first_stage_circles) == 0:
        # print("No anchor found, auto detection is not possible")
        return []

    # Calculate the grid and patch corners using anchor circles
    patch_corners, tight_patch_corners = get_patches(plot_img, filtered_first_stage_circles,cell_space=cell_space, error_margin=error_margin, show_grid=False)
    
    # Search for circles in images patches
    second_stage_circles = detect_second_stage(sample_image, patch_corners,filtered_first_stage_circles, show_patches=False)

    # Filter out second stage circles intersecting with bees
    filtered_second_stage_circles = filter_intersecting_circles(second_stage_circles,mask,intersection_threshold=intersect_threshold)

    # Compare circle distances, filter out if the distance is smaller than sum of radii.
    merged_second_stage_circles = filter_and_add_circles(filtered_first_stage_circles,filtered_second_stage_circles)

    # In the patches that we cannot find a circle,assume there is one
    tiled_circles = tile_circles(sample_image,tight_patch_corners,merged_second_stage_circles)

    # Of those assumed circles, remove the ones occluded by bees
    filtered_tiled_circles = filter_intersecting_circles(tiled_circles,mask,intersection_threshold=intersect_threshold)

    # Check if tiled_circles are suitably away from other circles, if so add to final list one by one
    merged_final_circles = filter_and_add_circles(merged_second_stage_circles,filtered_tiled_circles)

    # Convert the NumPy array to a list of tuples, for the return
    return_list = [tuple(row) for row in merged_final_circles]

    return return_list


if __name__ == "__main__":
    print(test_lines("AI/test_images/image_1219.jpg",True))
