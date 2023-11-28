import 'reflect-metadata';
import './patch';

import path from 'path';
import { app } from 'electron';

import CONSTANTS from './constants';
import MainController from './MainController';
// import { initializeSentry } from './sentry';
import { isRunningDevMode } from './utils';

// initializeSentry((process?.env as any)?.NODE_ENV);

// forces integrated GPU on Macos (instead of discrete GPU)
app.commandLine.appendSwitch('force_low_power_gpu');
// inform Electron that a GPU context will not be lost in power saving mode, screen saving mode etc.
app.commandLine.appendSwitch('gpu-no-context-lost');
// do not spawn a new process for GPU, use the main process
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('disable-site-isolation-for-policy');
app.commandLine.appendSwitch('disable-site-isolation-trials');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    if (process.defaultApp && isRunningDevMode() && process.platform === 'win32' && process.argv.length >= 2) {
        // Set the path of electron.exe and your app.
        // These two additional parameters are only available on windows.
        // Setting this is required to get this working in dev mode.
        app.setAsDefaultProtocolClient(CONSTANTS.OPEN_PROTOCOL, process.execPath, [path.resolve(process.argv[process.argv.length - 1])]);
    } else {
        app.setAsDefaultProtocolClient(CONSTANTS.OPEN_PROTOCOL);
    }

    MainController.initApp();
}
