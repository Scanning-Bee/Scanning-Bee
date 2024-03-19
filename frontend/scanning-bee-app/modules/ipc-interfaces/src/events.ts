/* ----------------------------------- */
/* ------------ IPC Events ----------- */
/* ----------------------------------- */

import { AnnotationYaml, MetadataWrapperYaml } from 'miscTypes';

/**
 * Events that are emitted by the renderer process and listened to by the main process.
 */
export enum RENDERER_EVENTS {
    ZOOM_CHANGE = 'ZOOM_CHANGE',
    THEME_CHANGE = 'THEME_CHANGE',
    FULL_SCREEN = 'FULL_SCREEN',
}

/**
 * Events that are emitted by the main process and listened to by the renderer process.
 */
export enum MAIN_EVENTS {
    ANNOTATIONS_PARSED = 'ANNOTATIONS_PARSED',
    SAVE_ANNOTATIONS_SUCCESS = 'SAVE_ANNOTATIONS_SUCCESS',
    SAVE_ANNOTATIONS_ERROR = 'SAVE_ANNOTATIONS_ERROR',
}

/* ----------------------------------- */
/* ----------- IPC Payloads ---------- */
/* ----------------------------------- */

export type RENDERER_EVENT_PAYLOADS = {
    [RENDERER_EVENTS.ZOOM_CHANGE]: number,
    [RENDERER_EVENTS.THEME_CHANGE]: undefined,
    [RENDERER_EVENTS.FULL_SCREEN]: boolean,
};

export type MAIN_EVENT_PAYLOADS = {
    [MAIN_EVENTS.ANNOTATIONS_PARSED]: {
        folder: string;
        annotations: AnnotationYaml[];
        images: string[];
        metadata: MetadataWrapperYaml;
    },
    [MAIN_EVENTS.SAVE_ANNOTATIONS_SUCCESS]: { targetFolder: string },
    [MAIN_EVENTS.SAVE_ANNOTATIONS_ERROR]: { targetFolder: string, error: any },
};
