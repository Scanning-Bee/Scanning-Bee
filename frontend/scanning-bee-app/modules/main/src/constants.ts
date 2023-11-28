import os from 'os';
import path from 'path';
import getAppDataPath from 'appdata-path';
import fs from 'fs-extra';

import { isRunningDevMode } from './utils';

const IS_DEV_MODE_RUNNING = isRunningDevMode();

const APP_NAME = process.env.APP_NAME || (IS_DEV_MODE_RUNNING ? 'Scanning Bee (dev)' : 'Scanning Bee');

const DATA_DIR = getAppDataPath(`${APP_NAME}Data`);

const DOCUMENTS_DIR = path.join(fs.realpathSync(os.homedir()), 'Documents', APP_NAME);

const LOG_PATH = path.join(DATA_DIR, 'Logs');

const GLOBAL_SETTINGS_PATH = path.join(DATA_DIR, 'Settings', 'globals.db');

fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
fs.mkdirSync(LOG_PATH, { recursive: true });

export default {
    OPEN_PROTOCOL: 'scanning_bee',
    PATHS: {
        LOG_PATH,
        GLOBAL_SETTINGS_PATH,
    },
    ENV: {
        IS_DEV_MODE_RUNNING,
        APP_NAME,
        DATA_DIR,
    },
};
