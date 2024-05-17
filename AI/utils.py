import os
import yaml
import cv2
import random
import string

def random_string(length: int=5):
    '''
    A random string generator to provide authenticity to the cropped cell image file names.

    Parameters:
    - 'length' (int): An integer, depicting the length of the desired randomly generated string.
    Must be an integer, and smaller than 252. That is because ext4 filesystem allows the file names
    to be up to length 256 (4 characters for ".jpg").

    Returns:
    - string: A randomly generated string of length 'length'.
    '''
    try:
        # check if length is an integer and less than 256
        if not isinstance(length, int):
            raise TypeError("Length must be an integer")
        if length >= 252:
            raise ValueError("Length must be less than 256")
        
        # generate and return the random string
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
    
    except (TypeError, ValueError) as e:
        raise e



def yolo_format_annotation_cropper(dataset_path: string, error_margin: int=10, train_rate: float=0.7, val_rate: float=0.15):
    '''
    Divides the annotations given in the 'dataset_path' in a way compatible with the YOLO classifier format.

    Parameters:
    - 'dataset_path' (string): The path to the dataset and the annotations.
    - 'error_margin' (int): Error margin for the circle crops. In pixels. Must be negative.
    - 'train_rate' (float): The ratio of the data to be split into the train set. Must be positive and between 0 and 1.
    - 'val_rate' (float): The ratio of the data to be split into the validation set. Must be positive and between 0 and 1.

    The ratio for the test set is given by 1 - ('train_rate' + 'val_rate'). If ('train_rate' + 'val_rate') sum up to a
    value that is greater than 1, an exception is thrown.
    
    '''

    try:
        # Check if length is an integer and less than 256
        if not isinstance(error_margin, int):
            raise TypeError("Error margin must be an integer")
        if error_margin < 0:
            raise ValueError("Error margin must be non-negative")
        
        if not isinstance(train_rate, float):
            raise TypeError("Train rate must be a float")
        
        if not isinstance(val_rate, float):
            raise TypeError("Validation rate must be a float")
        
        if not 0 <= train_rate <= 1:
            raise ValueError("Invalid range of value for train rate")
        
        if not 0 <= val_rate <= 1:
            raise ValueError("Invalid range of value for validation rate")
        
        if not 0 <= train_rate + val_rate <= 1:
            raise ValueError("Invalid range of value for test rate, please check what train rate and validation rate sum up to")

        test_rate = 1 - (train_rate + val_rate)

    except (TypeError, ValueError) as e:
        raise e


    annotations = None
    yaml_path = os.path.join(dataset_path, 'annotations', 'annotations.yaml')
    
    # opening the yaml file to read the annotations from the dataset
    if os.path.exists(yaml_path):
        with open(yaml_path, 'r', encoding='utf-8') as yaml_file:
            yaml_file_content = yaml.safe_load(yaml_file)
            annotations = yaml_file_content["annotation_data"]["annotations"]
    
    else:
        print("Annotations file does not exist!")
        return

    if annotations is not None:
        # reading the annotations
        annotation_dictionary = {}
        for annotation in annotations:
            image = annotation["orig_image"]
            cell_type = annotation["annotation"]
            x, y, radius = annotation["center_x"], annotation["center_y"], annotation["radius"]
            
            if image not in annotation_dictionary:
                annotation_dictionary[image] = []

            annotation_dictionary[image].append((x, y, radius, cell_type))        

        # creating a dictionary to store the annotations for each image
        for image, annotations in annotation_dictionary.items():
            image_path = os.path.join(dataset_path, image)
            image_read = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            
            for annotation in annotations:
                data_split = random.choices(['train', 'val', 'test'], [train_rate, val_rate, test_rate], k=1)[0]
                x, y, r, cell_type = annotation
                height, width = image_read.shape 

                # cropping the image and ensuring that the size constraints are satisfied
                top, bottom, left, right = (max(0, y - r - error_margin), min(height, y + r + error_margin), max(0, x - r - error_margin), min(width, x + r + error_margin))

                image_clipped = image_read[top: bottom, left: right]

                data_directory = os.path.join(dataset_path, data_split, cell_type)
                os.makedirs(data_directory, exist_ok=True)
                
                # writing the image to the sub-directories for each data split, as YOLO wants
                cv2.imwrite(os.path.join(data_directory, random_string()) + ".jpg", image_clipped)
