import CellType from '@frontend/models/cellType';

export type CellDto = {
    id: number;
    location_on_frame_x: number;
    location_on_frame_y: number;
    frame: number;
};

export type CellContentDto = {
    id: number;
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
    cell?: number;
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

export const CellTypeDto = {
    [CellType.EGG]: 1,
    [CellType.EMPTY]: 2,
    [CellType.LARVAE]: 3,
    [CellType.NECTAR]: 4,
    [CellType.POLLEN]: 5,
    [CellType.PUPPA]: 6,
    [CellType.HONEY_CLOSED]: 7,
    [CellType.BEE_OCCLUDED]: 8,
    [CellType.NOT_CLASSIFIED]: 9,
};
