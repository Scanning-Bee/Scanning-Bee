import CellType from '@frontend/models/cellType';

export type UserTypeDto = {
    type: string;
};

export type UserDto = {
    name: string;
    user_type: UserTypeDto;
};

export type FrameDto = {
    description: string;
};

export type CellDto = {
    location_on_frame_x: number;
    location_on_frame_y: number;
    frame: FrameDto;
};

export type ContentDto = {
    name: string;
    content_description: string;
};

export type ImageDto = {
    image_name: string;
    x_pos: number;
    y_pos: number;
};

export type CellContentDto = {
    frame: FrameDto | number;
    timestamp: string;
    content: ContentDto | number;
    user: UserDto | number;
    center_x: number;
    center_y: number;
    image: string | number;
    radius: number;
    cell?: CellDto;
};

export const CellTypeDto = {
    [CellType.EGG]: 1,
    [CellType.EMPTY]: 2,
    [CellType.LARVA]: 3,
    [CellType.NECTAR]: 4,
    [CellType.POLLEN]: 5,
    [CellType.PUPA]: 6,
    [CellType.HONEY_CLOSED]: 7,
    [CellType.BEE_OCCLUDED]: 8,
    [CellType.NOT_CLASSIFIED]: 9,
};
