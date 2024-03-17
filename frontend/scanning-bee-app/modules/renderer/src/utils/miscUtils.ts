import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { setBackendOnline } from '@frontend/slices/backendStatusSlice';

import { isMac } from './platform';

export const uppercaseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getUnicodeIconForKey = (key: string) => {
    switch (key) {
    case 'mod':
        return isMac() ? '⌘' : 'Ctrl';
    case 'shift':
        return '⇧';
    case 'alt':
        return isMac() ? '⌥' : 'Alt';
    case 'ctrl':
        return 'Ctrl';
    case 'enter':
        return '↩';
    case 'backspace':
        return '⌫';
    case 'right':
        return '→';
    case 'left':
        return '←';
    case 'up':
        return '↑';
    case 'down':
        return '↓';
    case 'space':
        return 'Space';
    case 'tab':
        return 'Tab';
    case 'esc':
        return 'Esc';
    case 'del':
        return 'Del';
    default:
        return key;
    }
};

export const getUnicodeIconRepresentation = (combo: string) => combo
    .split(' ').map(key => getUnicodeIconForKey(key)).join(' ');

export const getMemoryUsage = () => {
    const used = process.memoryUsage().heapTotal / (1024 * 1024);
    return Math.round(used * 100) / 100;
};

export const checkIsBackendOnline = async () => {
    const { dispatch } = (window as any).store;

    BackendInterface.getInstance().getFrames().then((res) => {
        dispatch(setBackendOnline(res !== null));
    }).catch(() => {
        dispatch(setBackendOnline(false));
    });
};

let checkIsBackendOnlineInterval = null;
export const initiateIsBackendOnlineCheck = () => {
    if (checkIsBackendOnlineInterval) {
        clearInterval(checkIsBackendOnlineInterval);
    }

    checkIsBackendOnlineInterval = setInterval(() => {
        checkIsBackendOnline();
    }, 15_000);
};
