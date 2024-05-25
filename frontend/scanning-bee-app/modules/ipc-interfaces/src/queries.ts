/* ----------------------------------- */
/* ------------ IPC Queries ---------- */
/* ----------------------------------- */

import { AnnotationYaml, WorkspaceInfo } from 'miscTypes';

/**
 ** Queries sent by the renderer process to the main process.
 */
export enum RENDERER_QUERIES {
    SELECT_FOLDER = 'SELECT_FOLDER',
    OPEN_FOLDER_AT_LOCATION = 'OPEN_FOLDER_AT_LOCATION',
    SAVE_ANNOTATIONS = 'SAVE_ANNOTATIONS',
    INVOKE_BACKEND = 'INVOKE_BACKEND',
    GET_WORKSPACE_INFO = 'GET_WORKSPACE_INFO',
    SET_WORKSPACE_INFO = 'SET_WORKSPACE_INFO',
}

/**
 ** Queries sent by the main process to the renderer process.
 */
export enum MAIN_QUERIES {
}

/* ----------------------------------- */
/* ----------- IPC Payloads ---------- */
/* ----------------------------------- */

export type RENDERER_QUERY_PAYLOADS = {
    [RENDERER_QUERIES.SELECT_FOLDER]: undefined,
    [RENDERER_QUERIES.OPEN_FOLDER_AT_LOCATION]: string,
    [RENDERER_QUERIES.SAVE_ANNOTATIONS]: { targetFolder: string; annotations: AnnotationYaml[] },
    [RENDERER_QUERIES.INVOKE_BACKEND]: undefined,
    [RENDERER_QUERIES.GET_WORKSPACE_INFO]: string,
    [RENDERER_QUERIES.SET_WORKSPACE_INFO]: { folder: string; workspaceInfo: Partial<WorkspaceInfo> },
};

export type MAIN_QUERY_PAYLOADS = {
};
