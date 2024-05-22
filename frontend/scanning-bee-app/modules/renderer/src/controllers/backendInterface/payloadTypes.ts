import CellType from '@frontend/models/cellType';

export type CellID = number;
export type FrameID = number;
export type ContentID = number;
export type CellContentID = number;
export type UserID = number;
export type ImageID = number;
export type UserTypeID = number;
export type BagID = number;

export type SigninDto = {
    username: string;
    password: string;
    email: string;
    user_type: string;
    first_name?: string;
    last_name?: string;
};

export type LoginDto = {
    username: string;
    password: string;
};

export type LogoutDto = {
    refresh_token: string;
};

export type LoginResponseDto = {
    access_token: string;
    refresh_token: string;
};

export type RegisterResponseDto = {
    refresh: string;
    access: string;
    message: string;
    user: string;
};

export type BagDto = {
    id?: BagID;
    name: string;
};

export type UserTypeDto = {
    id?: UserTypeID;
    type: string;
};

export type UserDto = {
    id?: UserID;
    user_type: number;
    username: string;
    email: string;
    annotation_count: number;
};

export type FrameDto = {
    id?: FrameID;
    description: string;
};

export type CellDto = {
    id?: CellID;
    location_on_frame_x: number;
    location_on_frame_y: number;
    frame: number;
};

export type ContentDto = {
    id?: ContentID;
    name: string;
    content_description: string;
};

export type ImageDto = {
    id?: ImageID;
    image_name: string;
    x_pos: number;
    y_pos: number;
    timestamp: string;
    bag?: any;
};

export type CellContentDto = {
    id?: CellContentID;
    frame: number;
    timestamp: string;
    content: ContentDto | number;
    user: number;
    center_x: number;
    center_y: number;
    image: string | number | ImageDto;
    radius: number;
    cell?: typeof CellTypeDto[keyof typeof CellTypeDto];
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
