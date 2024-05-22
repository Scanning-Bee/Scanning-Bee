import path from 'path';
import fs from 'fs-extra';
import { WorkspaceInfo } from '@scanning_bee/ipc-interfaces';

import CONSTANTS from '../constants';

const DUMMY_WORKSPACE_INFO = {
    frame: -1,
    hive: 'untitled',
    name: 'untitled',
} as WorkspaceInfo;

export const updateWorkspaceInfoFile = async (folderPath: string, workspaceInfo: Partial<WorkspaceInfo>): Promise<void> => {
    const workspaceInfoFolderPath = path.join(folderPath, CONSTANTS.PATHS.WORKSPACE_INFO_FOLDER_NAME);
    const workspaceInfoFilePath = path.join(workspaceInfoFolderPath, CONSTANTS.PATHS.WORKSPACE_INFO_FILE_NAME);

    if (!await fs.pathExists(workspaceInfoFilePath)) {
        await createWorkspaceInfoFile(folderPath, {
            ...DUMMY_WORKSPACE_INFO,
            ...workspaceInfo,
        });

        return;
    }

    const currentWorkspaceInfo = await fs.readJson(workspaceInfoFilePath);

    await fs.writeJson(workspaceInfoFilePath, {
        ...currentWorkspaceInfo,
        ...workspaceInfo,
    });
};

export const createWorkspaceInfoFile = async (folderPath: string, workspaceInfo: WorkspaceInfo): Promise<void> => {
    const workspaceInfoFolderPath = path.join(folderPath, CONSTANTS.PATHS.WORKSPACE_INFO_FOLDER_NAME);
    const workspaceInfoFilePath = path.join(workspaceInfoFolderPath, CONSTANTS.PATHS.WORKSPACE_INFO_FILE_NAME);

    await fs.ensureDir(workspaceInfoFolderPath);
    await fs.writeJson(workspaceInfoFilePath, workspaceInfo);
};

export const parseWorkspace = async (folderPath: string): Promise<WorkspaceInfo> => {
    const workspaceInfoFolderPath = path.join(folderPath, CONSTANTS.PATHS.WORKSPACE_INFO_FOLDER_NAME);
    const workspaceInfoFilePath = path.join(workspaceInfoFolderPath, CONSTANTS.PATHS.WORKSPACE_INFO_FILE_NAME);

    if (!await fs.pathExists(workspaceInfoFilePath)) {
        await createWorkspaceInfoFile(folderPath, DUMMY_WORKSPACE_INFO);

        return null;
    }

    return fs.readJson(workspaceInfoFilePath);
};
