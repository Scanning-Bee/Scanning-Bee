import yaml
import json
import real_world_coordiantes as rwc

def parse_annotation_yaml(file_path):
    """
    Parse an annotation YAML file into a dictionary.

    Args:
    - file_path: Path to the YAML file.

    Returns:
    - annotation_dict: Dictionary containing the annotation data.
    """

    with open(file_path) as f:
        annotation_dict = yaml.load(f, Loader=yaml.FullLoader)

    annotations = annotation_dict["annotation_data"]["annotations"]        

    return annotations