import { ipcRenderer } from 'electron';
import { useSelector } from 'react-redux';
import StorageService from '@frontend/services/StorageService';
import { RootState } from '@frontend/store';
import { Themes } from '@frontend/utils/colours';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RENDERER_EVENTS, Theme, THEME_STORAGE_ID } from '@scanning_bee/ipc-interfaces';

type ThemeState = {
    activeTheme: Theme;
};

const initialState: ThemeState = {
    activeTheme: StorageService.getStorage(THEME_STORAGE_ID) || Themes[0],
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<Theme>) {
            state.activeTheme = action.payload;
            StorageService.saveStorage(THEME_STORAGE_ID, action.payload);
            ipcRenderer.send(RENDERER_EVENTS.THEME_CHANGE, action.payload);
        },
    },
});

export const {
    setTheme,
} = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme.activeTheme;

export const useTheme = () => {
    const theme = useSelector(selectTheme);
    return theme;
};
export const getTheme = () => StorageService.getStorage(THEME_STORAGE_ID);

export default themeSlice.reducer;
