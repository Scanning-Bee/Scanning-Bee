export type Theme = {
    title: string;
    type: 'light' | 'dark';
    primaryForeground: string;
    secondaryForeground: string;
    tertiaryForeground: string;
    primaryBackground: string;
    secondaryBackground: string;
    tertiaryBackground: string;
    primaryAccent: string;
    secondaryAccent: string;
    tertiaryAccent: string;
    primaryBorder: string;
    secondaryBorder: string;
    tertiaryBorder: string;
};

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

export type WorkspaceInfo = {
    name: string;
    hive: string;
    frame: number;
};
