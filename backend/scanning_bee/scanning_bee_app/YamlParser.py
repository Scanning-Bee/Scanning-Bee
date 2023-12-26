import yaml
import json


def yaml_parser(filename, yaml_file_path):
    annotation_data = []
    with open(yaml_file_path, 'r') as file:
        # The FullLoader parameter handles the conversion from YAML
        # scalar values to Python the dictionary format
        data = yaml.safe_load(file)
        bag_name = data['annotation_data']['bag_name']
        annotations = data['annotation_data']['annotations']
        for annotation in annotations:
            data = {
                'annotated_image': annotation['annotated_image'],
                'annotation': annotation['annotation'],
                'center_x': annotation['center_x'],
                'center_y': annotation['center_y'],
                'orig_image': annotation['orig_image'],
                'radius': annotation['radius'],
                'sec': annotation['sec'],
                'x_pos': annotation['x_pos'],
                'y_pos': annotation['y_pos'],
            }

            annotation_data.append(data)

        annotation_data.append({'bag_name': bag_name})
        with open(filename, 'w') as file:
            json.dump(annotation_data, file, indent=4)
