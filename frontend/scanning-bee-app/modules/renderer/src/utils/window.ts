import { ipcRenderer, webFrame } from 'electron';

export const changeZoom = (zoomFactor: number) => {
    webFrame.setZoomLevel(zoomFactor);
    ipcRenderer.send('zoomChange', zoomFactor);
};

changeZoom(0);
