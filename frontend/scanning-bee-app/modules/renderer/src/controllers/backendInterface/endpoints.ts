export const ENDPOINT_URL = 'http://localhost:8000/scanning_bee';

export type EndpointType = {
    GET?: {
        LIST: string;
        [key: string]: string | Function;
    };
    POST?: {
        CREATE: string;
    };
    PUT?: {
        UPDATE?: Function;
    };
    DELETE?: {
        DELETE?: Function;
    };
};

export const BACKEND_ENDPOINTS = {
    CELL: {
        GET: {
            LIST: `${ENDPOINT_URL}/cells/`,
            BY_LOCATION: `${ENDPOINT_URL}/cells/by-location/`,
            BY_ID: (id: number) => `${ENDPOINT_URL}/cells/${id}/`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/cells/`,
        },
        PUT: {
            UPDATE: (id: number) => `${ENDPOINT_URL}/cells/${id}/`,
        },
    },
    CELL_CONTENT: {
        GET: {
            LIST: `${ENDPOINT_URL}/cellcontents/`,
            BY_IMAGE_NAME: (imageName: string) => `${ENDPOINT_URL}/cellcontents/image_name/${imageName}`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/cellcontents/`,
        },
        DELETE: {
            DELETE: (id: number) => `${ENDPOINT_URL}/cellcontents/${id}/`,
        },
    },
    CONTENT: {
        GET: {
            LIST: `${ENDPOINT_URL}/contents/`,
        },
    },
    FRAME: {
        GET: {
            LIST: `${ENDPOINT_URL}/frames/`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/frames/`,
        },
    },
    USER: {
        GET: {
            LIST: `${ENDPOINT_URL}/users/`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/users/`,
        },
    },
    USER_TYPE: {
        GET: {
            LIST: `${ENDPOINT_URL}/usertypes/`,
        },
        POST: {
            CREATE: `${ENDPOINT_URL}/usertypes/`,
        },
    },
};
