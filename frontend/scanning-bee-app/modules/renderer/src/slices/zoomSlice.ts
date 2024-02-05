import { ipcRenderer, webFrame } from 'electron';
import { useSelector } from 'react-redux';
import StorageService from '@frontend/services/StorageService';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RENDERER_EVENTS, ZOOM_STORAGE_ID } from '@scanning_bee/ipc-interfaces';

export const changeZoom = (zoomFactor: number) => {
    StorageService.saveStorage(ZOOM_STORAGE_ID, zoomFactor);
    webFrame.setZoomLevel(zoomFactor);
    ipcRenderer.send(RENDERER_EVENTS.ZOOM_CHANGE, zoomFactor);
};

type ZoomState = {
    zoom: number;
};

const initialState: ZoomState = {
    zoom: StorageService.getStorage(ZOOM_STORAGE_ID) || 0,
};

const zoomSlice = createSlice({
    name: 'zoom',
    initialState,
    reducers: {
        setZoom(state, action: PayloadAction<number>) {
            state.zoom = action.payload;

            changeZoom(action.payload);
        },
        resetZoom(state) {
            state.zoom = 0;

            changeZoom(0);
        },
    },
});

changeZoom(initialState.zoom);

export const {
    setZoom,
    resetZoom,
} = zoomSlice.actions;

export const selectZoom = (state: RootState) => state.zoom.zoom;

export const useZoom = (): number => {
    const z = useSelector(selectZoom);
    return z;
};

export const getZoom = (): number => StorageService.getStorage(ZOOM_STORAGE_ID);

export default zoomSlice.reducer;
