import yaml
import os
import sys
from test import rotation_robust_method,test_lines

## I couldn't manage to run this script inside image annotator, so if you want to use this one the best way 
## is to move all scanning-bee file to another directory, then run this script, make sure to adjust the paths

# Specify the path to your YAML file
folder_path = "/home/buket/Desktop/Course_Materials/ceng490_bitirme/datasets/annotated_data_ayben/bitenler/test1"
yaml_file_path = folder_path + "/annotations/annotations.yaml"

# Open and read the YAML file
with open(yaml_file_path, 'r') as file:
    # Load the YAML content
    yaml_content = yaml.load(file, Loader=yaml.FullLoader)

# Now, yaml_content is a Python data structure representing the content of your YAML file
yaml_data = yaml_content["annotation_data"]["annotations"]
ground_truth_circles={}


# grab ground truth values from yaml file
for annotation in yaml_data:
    image_data = annotation["orig_image"]
    if image_data in ground_truth_circles:
        xyr_tuple = (annotation["center_x"],annotation["center_y"],annotation["radius"])
        ground_truth_circles[image_data].append(xyr_tuple)
    else:
        ground_truth_circles[image_data] = []
        xyr_tuple = (annotation["center_x"],annotation["center_y"],annotation["radius"])
        ground_truth_circles[image_data].append(xyr_tuple)

def circle_overlap(circle1, circle2):
    x1, y1, r1 = circle1
    x2, y2, r2 = circle2
    distance_between_centers = ((x2 - x1)**2 + (y2 - y1)**2)**0.5
    sum_of_radii = r1 + r2
    return distance_between_centers < sum_of_radii

def calculate_iou(circle1, circle2):
    x1, y1, r1 = circle1
    x2, y2, r2 = circle2
    intersection_area = max(0, (min(x1 + r1, x2 + r2) - max(x1 - r1, x2 - r2))) * max(0, (min(y1 + r1, y2 + r2) - max(y1 - r1, y2 - r2)))
    union_area = 3.1415 * (r1**2) + 3.1415 * (r2**2) - intersection_area
    iou = intersection_area / union_area if union_area > 0 else 0
    return iou

def measure_success(gt_circles, detected_circles, iou_threshold=0.5):
    true_positives = 0
    false_positives = 0
    false_negatives = 0
    iou_scores = []

    for gt_circle in gt_circles:
        circle_detected = False
        for detected_circle in detected_circles:
            if circle_overlap(gt_circle, detected_circle):
                true_positives += 1
                iou = calculate_iou(gt_circle, detected_circle)
                iou_scores.append(iou)
                circle_detected = True
                break

        if not circle_detected:
            false_negatives += 1

    false_positives = len(detected_circles) - true_positives

    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
    accuracy = true_positives / len(gt_circles) if len(gt_circles) > 0 else 0
    avg_iou = sum(iou_scores) / len(iou_scores) if len(iou_scores) > 0 else 0

    return precision, recall, accuracy, avg_iou

results = []

occlude = [False]
cell_space=[ 0.25, 0.75, 1.25]
error_margin = [ 0.25, 0.75, 1.25]
intersect_thres = [0.6]



avg_p = avg_r = avg_acc = avg_iou= 0
image_count = 0
for image_name in ground_truth_circles.keys():
    image_path = os.path.join(folder_path, image_name)
    gt_circles = ground_truth_circles[image_name]
    detected_circles = test_lines(image_path, occlude=True, detection_model_path=r"AI/models/bee_detect_models/epoch-150.pt")
    if len(detected_circles) == 0:
        continue
    precision, recall, accuracy, iou = measure_success(gt_circles, detected_circles)
    
    avg_p += precision
    avg_r += recall
    avg_acc += accuracy
    avg_iou += iou
    
    image_count += 1 
    # print(f"Image {image_name}: Precision={precision}, Recall={recall}, Accuracy={accuracy}, IoU={iou}")

avg_acc /= max(1, image_count)
avg_p /= max(1, image_count)
avg_r /= max(1, image_count)
avg_iou /= max(1, image_count)


print(f"Averaged Metrics: Precision={avg_p}, Recall={avg_r}, Accuracy={avg_acc}, Avg IoU={avg_iou} over {image_count} images from {len(ground_truth_circles.keys())} total images")



             