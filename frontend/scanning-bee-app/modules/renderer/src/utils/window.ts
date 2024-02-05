import { ipcRenderer, webFrame } from 'electron';
import { RENDERER_EVENTS } from '@scanning_bee/ipc-interfaces';

export const changeZoom = (zoomFactor: number) => {
    webFrame.setZoomLevel(zoomFactor);
    ipcRenderer.send(RENDERER_EVENTS.ZOOM_CHANGE, zoomFactor);
};

changeZoom(0);
