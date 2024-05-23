import { addTrailingZeros } from '@frontend/utils/miscUtils';

import { BagID, CellContentID, CellID, ContentID, FrameID, UserTypeID } from './payloadTypes';

export const ENDPOINT_URL = 'http://localhost:8000/scanning_bee';

export type EndpointType = {
    GET?: {
        LIST: string;
        [key: string]: string | Function;
    };
    POST?: {
        CREATE: string;
        SCRAPE?: string
    };
    PUT?: {
        UPDATE?: Function;
    };
    DELETE?: {
        DELETE?: Function;
        [key: string]: string | Function;
    };
};

export const AUTH_ENDPOINTS = {
    SIGNIN: `${ENDPOINT_URL}/register`,
    LOGIN: `${ENDPOINT_URL}/login`,
    LOGOUT: `${ENDPOINT_URL}/logout`,
};

export const BACKEND_ENDPOINTS = {
    CELL: {
        GET: {
            LIST: `${ENDPOINT_URL}/cell_list`,
            BY_LOCATION: (x: number, y: number) => `${ENDPOINT_URL}/cell_list/location/${x}/${y}`,
            BY_ID: (id: CellID) => `${ENDPOINT_URL}/cell_list/${id}`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/cell_list`,
        },
        PUT: {
            UPDATE: (id: CellID) => `${ENDPOINT_URL}/cell_detail/${id}`,
        },
        DELETE: {
            BY_ID: (id: CellID) => `${ENDPOINT_URL}/cell_list/${id}`,
        },
    },
    FRAME: {
        GET: {
            LIST: `${ENDPOINT_URL}/frame_list`,
            BY_ID: (id: FrameID) => `${ENDPOINT_URL}/frame_list/${id}`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/frame_list`,
        },
        PUT: {
            UPDATE: (id: FrameID) => `${ENDPOINT_URL}/frame_detail/${id}`,
        },
        DELETE: {
            BY_ID: (id: FrameID) => `${ENDPOINT_URL}/frame_detail/${id}`,
        },
    },
    CONTENT: {
        GET: {
            LIST: `${ENDPOINT_URL}/content_list`,
            BY_ID: (id: ContentID) => `${ENDPOINT_URL}/content_list/${id}`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/content_list`,
        },
        DELETE: {
            BY_ID: (id: ContentID) => `${ENDPOINT_URL}/content_detail/${id}`,
        },
    },
    CELL_CONTENT: {
        GET: {
            LIST: `${ENDPOINT_URL}/cellcontent_list`,
            BY_IMAGE_NAME: (imageName: string) => `${ENDPOINT_URL}/cellcontent_list/image_name/${imageName}`,
            BY_IMAGE_NAME_RECT: (imageName: string) => `${ENDPOINT_URL}/cellcontent_list/image_name_rect/${imageName}`,
            BY_LOCATION: (x: number, y: number) => `${ENDPOINT_URL}/cellcontent_list/location/${x}/${y}`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/cellcontent_list`,
        },
        PUT: {
            UPDATE: (id: CellContentID) => `${ENDPOINT_URL}/cellcontent_detail/${id}`,
        },
        DELETE: {
            BY_ID: (id: CellContentID) => `${ENDPOINT_URL}/cellcontent_detail/${id}`,
        },
    },
    USER: {
        GET: {
            LIST: `${ENDPOINT_URL}/user_list`,
            BY_ID: (id: number) => `${ENDPOINT_URL}/usernameById/${id}`,
            BY_USERNAME: (username: string) => `${ENDPOINT_URL}/user_detail/${username}`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/user_list`,
        },
    },
    USER_TYPE: {
        GET: {
            LIST: `${ENDPOINT_URL}/user_type_list`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/user_type_list`,
        },
        DELETE: {
            BY_ID: (id: UserTypeID) => `${ENDPOINT_URL}/user_type_detail/${id}`,
        },
    },
    IMAGE: {
        GET: {
            LIST: `${ENDPOINT_URL}/image_list`,
            BY_LOCATION: (x: number, y: number) => `${ENDPOINT_URL}/image_list/location/${x}/${y}`,
            BY_LOCATION_AND_TIMESTAMP:
                (
                    x: number,
                    y: number,
                    timestamp: Date,
                ) => `${ENDPOINT_URL}/image_list/location/${x}/${y}/${addTrailingZeros(timestamp.toISOString())}`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/image_list`,
            SCRAPE: `${ENDPOINT_URL}/image_scraper`,
        },
    },
    AI: {
        GET: {
            LIST: '',
            BY_IMAGE_NAME: (imageName: string) => `${ENDPOINT_URL}/cellcontentsbyai/${imageName}/`,
            BY_LOCATION: (x: number, y: number) => `${ENDPOINT_URL}/cellcontentsbyai/${x}/${y}`,
            BY_LOCATION_AND_TIMESTAMP:
                (
                    x: number,
                    y: number,
                    timestamp: Date,
                ) => `${ENDPOINT_URL}/cellcontentsbyai/${x}/${y}/${addTrailingZeros(timestamp.toISOString())}`,
        },
    },
    BAG: {
        GET: {
            LIST: `${ENDPOINT_URL}/bag_list`,
            BY_ID: (id: BagID) => `${ENDPOINT_URL}/bag_detail/${id}`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/bag_list`,
        },
    },
};
