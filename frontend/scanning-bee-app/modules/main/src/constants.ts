import { WORKSPACE_INFO_FILE_NAME, WORKSPACE_INFO_FOLDER_NAME } from '@scanning_bee/ipc-interfaces';

import { isRunningDevMode } from './utils';

const IS_DEV_MODE_RUNNING = isRunningDevMode();

const APP_NAME = process.env.APP_NAME || (IS_DEV_MODE_RUNNING ? 'Scanning Bee (dev)' : 'Scanning Bee');

export default {
    OPEN_PROTOCOL: 'scanning_bee',
    PATHS: {
        WORKSPACE_INFO_FOLDER_NAME,
        WORKSPACE_INFO_FILE_NAME,
    },
    ENV: {
        IS_DEV_MODE_RUNNING,
        APP_NAME,
    },
};
