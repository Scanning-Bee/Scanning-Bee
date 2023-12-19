#!/usr/bin/env python

import argparse
import atexit
import os
import random
import sys
import uuid
from uuid import uuid4

import cv2
import numpy as np
import yaml
from tqdm import tqdm

from preprocess.utils import (annotation_from_data,
                                   create_folder_if_not_exists,
                                   crop_from_annotation, get_candidate_folders,
                                   process_image_and_annotate, rescale_img,
                                   to_annotation_dictionary)

allowed_cell_types = [
    CellType.EGG,
    CellType.EMPTY,
    CellType.LARVA,
    CellType.NECTAR,
    CellType.PUPA,
    CellType.POLLEN,
]


class AnnotationViewer:
    img_folder: str
    annotation_path: str
    extract: bool
    figure_title: str = "Annotation Viewer"
    radius_shift_enabled: bool
    radius_shift_multiplier: float
    radius_shift_probability: float

    def __init__(
        self,
        img_folder: str,
        annotation_path: str,
        extract: bool,
        output_folder: str,
        radius_shift_enabled: bool = False,
        radius_shift_multiplier: float = -1,
        radius_shift_probability: float = 0.2

    ) -> None:
        self.img_folder = img_folder
        self.annotation_path = annotation_path
        self.extract = extract
        self.output_folder = output_folder
        self.radius_shift_enabled = radius_shift_enabled
        self.radius_shift_multiplier = radius_shift_multiplier
        self.radius_shift_probability = radius_shift_probability

        if not os.path.exists(self.img_folder):
            print(f"Error: Base Folder Path Does Not Exist. {self.img_folder}")
            sys.exit()

        self.annotation_directory = os.path.join(self.img_folder, "annotations")
        self.metadata_path = os.path.join(self.img_folder, "metadata.yaml")

        with open(self.metadata_path, "r", encoding="utf-8") as metadata_file:
            self.metadata = yaml.safe_load(metadata_file)["images"]["image_data"]

        if not os.path.exists(self.annotation_directory):
            print("Annotation folder does not exist. Run annotation first")
            sys.exit()

        self.annotation_file = os.path.join(
            self.annotation_directory, self.annotation_path
        )

        if not os.path.exists(self.annotation_file):
            print(f"Annotation File Does not Exist: {self.annotation_file}")
            sys.exit()

        with open(self.annotation_file, "r", encoding="utf-8") as file:
            yaml_data = yaml.safe_load(file)
            self.annotations: list = yaml_data["annotation_data"]["annotations"]
            self.bag_name = yaml_data["annotation_data"]["bag_name"]
        
        if self.extract:
            create_folder_if_not_exists(self.output_folder)
            create_folder_if_not_exists(os.path.join(self.output_folder, "torch"))
            
            for data_class in allowed_cell_types:
                folder_path = os.path.join(
                    os.path.join(output_folder, "torch/train"), data_class.name.lower()
                )

                create_folder_if_not_exists(folder_path)

                folder_path = os.path.join(
                    os.path.join(output_folder, "torch/val"), data_class.name.lower()
                )

                create_folder_if_not_exists(folder_path)

    def get_annotations_for_current_image(self, img_name: str) -> list[Annotation]:
        annotation_list: list[Annotation] = []

        # start_index = 0

        for _, annotation_data in enumerate(self.annotations):
            if img_name in annotation_data["orig_image"]:
                annot = annotation_from_data(annotation_data)
                annotation_list.append(annot)

                # start_index = index
                # break

        # print(f"{start_index}")

        # for index, annotation_data in enumerate(self.annotations, start=start_index):
        #     if img_name in annotation_data["orig_image"]:
        #        annot = self.annotation_from_data(annotation_data)
        #        annotation_list.append(annot)
        #     else:
        #         break
        return annotation_list

    def on_shutdown(self):
        print("Shutting Down Viewer")
        if self.run_inference:
            crop_limits = [1250, 950]

            yaml_inference: list[dict] = []
            for index in tqdm(range(len(self.metadata))):
                self.img_index = index
                img_name = f"image_{self.img_index}.jpg"
                # print(f"Current Image Name is {img_name}")
                # First load the image
                img_path = os.path.join(self.img_folder, img_name)
                orig_img = cv2.imread(img_path, cv2.IMREAD_COLOR)
                # print(orig_img.shape)
                orig_img[:, 0 : crop_limits[1] // 2, :] = 0.0
                orig_img[
                    :,
                    orig_img.shape[1]
                    - ((orig_img.shape[1] - crop_limits[0]) // 2) : orig_img.shape[1],
                    :,
                ] = 0.0

                # orig_img[:, 0 : crop_limits[1] // 2, :] = 0.0
                # orig_img[
                #     :, crop_limits[0] : (orig_img.shape[1] - crop_limits[0]) // 2, :
                # ] = 0.0

                results = self.yolo.predict(orig_img, verbose=False)

                names = results[0].names
                # print(names)
                bee_count = 0
                if self.count_bees:
                    resized_img, (height, width) = rescale_img(orig_img)

                    bees_bboxes, _ = self.bee_detection_model.prediction(resized_img)

                    bee_count = len(bees_bboxes)
                classes = np.array(
                    results[0].boxes.cls.detach().clone().cpu().numpy(), dtype=np.uint8
                )

                # print(classes)
                class_list: list[str] = []
                coordinates = []
                if len(classes) > 0:
                    coordinates = np.array(
                        results[0].boxes.xyxy.detach().clone().cpu().numpy(),
                        dtype=np.uint32,
                    ).tolist()
                    for class_id in classes:
                        class_list.append(names[class_id])

                yaml_inference.append(
                    {
                        "img_name": img_name,
                        "class_list": class_list,
                        "coords": coordinates,
                        "num_bees": bee_count,
                        # "names": names,
                    }
                )

            # print(yaml_inference)
            with open(
                os.path.join(self.img_folder, "inference.yaml"),
                "w",
                encoding="utf-8",
            ) as yaml_file:
                yaml.safe_dump({"inference": yaml_inference}, yaml_file)
                # yaml.safe_dump(
                #     {
                #         "img_name": img_name,
                #         "class_list": class_list,
                #         "coords": coordinates,
                #     },
                #     yaml_file,
                # )

            return

        if not self.extract:
            return

        print("Dumping Annotation Images")
        random.seed(0)
        # quality, _, _, _ = check_directory_img_quality(self.img_folder)
        # if not quality:
        #     print("Overall Sharpness of the bag is not good.")
        annotation_dictionary = to_annotation_dictionary(self.annotations)

        base_folder = os.path.join(self.output_folder, "torch")
        train_folder = os.path.join(base_folder, "train")
        val_folder = os.path.join(base_folder, "val")

        create_folder_if_not_exists(self.output_folder)
        create_folder_if_not_exists(base_folder)
        create_folder_if_not_exists(train_folder)
        create_folder_if_not_exists(val_folder)

        for img_name, annot_list in annotation_dictionary.items():
            img_path = os.path.join(self.img_folder, img_name)
            orig_img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

            for annot in annot_list:
                img_class = annot.cell_type.name.lower()

                if random.random() > 0.8:
                    save_img_folder = os.path.join(val_folder, img_class)
                else:
                    save_img_folder = os.path.join(train_folder, img_class)

                shift_amount = 0
                if self.radius_shift_enabled:
                    if random.random() < self.radius_shift_probability:
                        multiplier = self.radius_shift_multiplier
                        if self.radius_shift_multiplier == -1: # default mode, use radius * 0.1
                            multiplier = annot.radius * 0.1
                        shift_amount = int(np.clip(np.random.randn(), -3, 3) * multiplier)
                
                cropped_img = crop_from_annotation(orig_img, annot, shift_amount)

                save_img_name = os.path.join(
                    save_img_folder, f"{img_class}_{uuid4()}.jpg"
                )

                cv2.imwrite(save_img_name, cropped_img)

def main():
    parser = argparse.ArgumentParser(description="Roboroyale Annotation Tool")
    parser.add_argument(
        "--filename",
        action="store",
        required=True,
        help="Folder Path to Img Folder",
    )
    parser.add_argument(
        "--annotations",
        action="store",
        default="annotations.yaml",
        required=False,
        help="Name of annotation file",
    )
    parser.add_argument(
        "--extract",
        action="store_true",
        default=False,
        required=False,
        help="Should We only extract",
    )

    parser.add_argument(
        "--radius_shift_enabled",
        action="store_true",
        default=False,
        required=False,
        help="Should radius shift augmentation be applied",
    )

    parser.add_argument(
        "--radius_shift_multiplier",
        action="store",
        default=-1,
        required=False,
        help="Multiplier for the standard random variable to determine the center shift amount",
    )

    parser.add_argument(
        "--radius_shift_probability",
        action="store",
        default=0.2,
        required=False,
        help="Probability of center shift taking place",
    )

    parser.add_argument(
        "--out",
        action="store",
        default=False,
        required=False,
        help="Should We only extract",
    )
    args = parser.parse_args()

    annotation_viewer = AnnotationViewer(
        args.filename, args.annotations, args.extract, args.radius_shift_enabled, 
        args.radius_shift_multiplier, args.radius_shift_probability, args.out
    )

    annotation_viewer.view()

if __name__ == "__main__":
    main()
