import { getProcessMemoryInfo } from 'process';
import BackendInterface from '@frontend/controllers/backendInterface/backendInterface';
import { setBackendOnline } from '@frontend/slices/backendStatusSlice';

import { isMac } from './platform';

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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

export const getMemoryUsage = async () => {
    const memInfo = (await getProcessMemoryInfo());
    const usage = isMac() ? memInfo.private : memInfo.residentSet;

    return Math.round(usage / (1024));
};

export const checkIsBackendOnline = async () => {
    BackendInterface.getFrames().then((res) => {
        setBackendOnline(res !== null);
    }).catch(() => {
        setBackendOnline(false);
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

export const addTrailingZeros = (isoStr: string) => {
    // this function ensures that the milliseconds part of the timestamp is always 6 digits long, by adding trailing zeros
    const [start, secondsWithZ] = isoStr.split('.');
    const seconds = secondsWithZ.split('Z')[0];

    if (seconds.length === 6) {
        return isoStr;
    }

    const zerosToAdd = 6 - seconds.length;

    return `${start}.${seconds}${'0'.repeat(zerosToAdd)}Z`;
};

export function repeatArray<T>(arr: T[], n: number): T[] {
    return [].concat(...Array(n).fill(arr));
}
