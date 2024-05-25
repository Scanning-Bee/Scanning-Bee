import { isRunningDevMode } from './utils';

const IS_DEV_MODE_RUNNING = isRunningDevMode();

const APP_NAME = process.env.APP_NAME || (IS_DEV_MODE_RUNNING ? 'Scanning Bee (dev)' : 'Scanning Bee');

export default {
    OPEN_PROTOCOL: 'scanning_bee',
    PATHS: {
    },
    ENV: {
        IS_DEV_MODE_RUNNING,
        APP_NAME,
    },
};
