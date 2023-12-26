export type CellDto = {
    id: number;
    location_on_frame_x: number;
    location_on_frame_y: number;
    frame: number;
};

export type CellContentDto = {
    id: number;
    cell: number;
    frame: number;
    timestamp: string;
    content: number;
    user: number;
    center_x: number;
    center_y: number;
    x_pos: number;
    y_pos: number;
    radius: number;
    image_name: string;
};

export type ContentDto = {
    id: number;
    name: string;
    content_description: string;
};

export type FrameDto = {
    id: number;
    description: string;
};

export type UserDto = {
    id: number;
    user_type: number;
};

export type UserTypeDto = {
    id: number;
    description: string;
};
