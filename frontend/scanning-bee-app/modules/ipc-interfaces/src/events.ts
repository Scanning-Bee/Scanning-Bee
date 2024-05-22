/* ----------------------------------- */
/* ------------ IPC Events ----------- */
/* ----------------------------------- */

import { AnnotationYaml, MetadataWrapperYaml, Theme, WorkspaceInfo } from 'miscTypes';

/**
 * Events that are emitted by the renderer process and listened to by the main process.
 */
export enum RENDERER_EVENTS {
    ZOOM_CHANGE = 'ZOOM_CHANGE',
    THEME_CHANGE = 'THEME_CHANGE',
    FULL_SCREEN = 'FULL_SCREEN',
    LOGIN_PAGE = 'LOGIN_PAGE',
}

/**
 * Events that are emitted by the main process and listened to by the renderer process.
 */
export enum MAIN_EVENTS {
    ANNOTATIONS_PARSED = 'ANNOTATIONS_PARSED',
    SAVE_ANNOTATIONS_SUCCESS = 'SAVE_ANNOTATIONS_SUCCESS',
    SAVE_ANNOTATIONS_ERROR = 'SAVE_ANNOTATIONS_ERROR',
    FULL_SCREEN = 'FULL_SCREEN',
    WORKSPACE_INFO_READY = 'WORKSPACE_INFO_READY',
}

/* ----------------------------------- */
/* ----------- IPC Payloads ---------- */
/* ----------------------------------- */

export type RENDERER_EVENT_PAYLOADS = {
    [RENDERER_EVENTS.ZOOM_CHANGE]: number,
    [RENDERER_EVENTS.THEME_CHANGE]: Theme,
    [RENDERER_EVENTS.FULL_SCREEN]: boolean,
    [RENDERER_EVENTS.LOGIN_PAGE]: boolean,
};

export type MAIN_EVENT_PAYLOADS = {
    [MAIN_EVENTS.ANNOTATIONS_PARSED]: {
        folder: string;
        annotations: AnnotationYaml[];
        images: string[];
        metadata: MetadataWrapperYaml;
        workspaceInfo: WorkspaceInfo;
    },
    [MAIN_EVENTS.SAVE_ANNOTATIONS_SUCCESS]: { targetFolder: string },
    [MAIN_EVENTS.SAVE_ANNOTATIONS_ERROR]: { targetFolder: string, error: any },
    [MAIN_EVENTS.FULL_SCREEN]: boolean,
    [MAIN_EVENTS.WORKSPACE_INFO_READY]: WorkspaceInfo,
};
