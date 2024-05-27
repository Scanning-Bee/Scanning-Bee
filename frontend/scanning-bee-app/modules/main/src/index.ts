import 'reflect-metadata';
import './patch';

import path from 'path';
import { app } from 'electron';

import CONSTANTS from './constants';
import MainController from './MainController';
import { isRunningDevMode } from './utils';

app.commandLine.appendSwitch('force_low_power_gpu');
app.commandLine.appendSwitch('gpu-no-context-lost');
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('disable-site-isolation-for-policy');
app.commandLine.appendSwitch('disable-site-isolation-trials');

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    if (process.defaultApp && isRunningDevMode() && process.platform === 'win32' && process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(CONSTANTS.OPEN_PROTOCOL, process.execPath, [path.resolve(process.argv[process.argv.length - 1])]);
    } else {
        app.setAsDefaultProtocolClient(CONSTANTS.OPEN_PROTOCOL);
    }

    MainController.initApp();
}
