export type AnnotationYaml = {
    annotated_image: string;
    annotation: string;
    center_x: number;
    center_y: number;
    orig_image: string;
    radius: number;
    sec: number;
    x_pos: number;
    y_pos: number;
};

export type RawMetadataWrapperYaml = {
    bag_name: string;
    image_data: RawMetadataYaml[];
};

export type RawMetadataYaml = {
    prev_image: string;
    sec: number;
    x_pos: number;
    y_pos: number;
    bag_name: string;
};

export type MetadataWrapperYaml = {
    bag_name: string;
    image_data: MetadataYaml[];
};

export type MetadataYaml = {
    bag_name: string;
    image_name: string;
    sec: number;
    x_pos: number;
    y_pos: number;
};
