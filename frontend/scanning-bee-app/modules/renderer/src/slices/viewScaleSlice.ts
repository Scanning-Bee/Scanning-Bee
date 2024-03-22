import { useSelector } from 'react-redux';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ScaleState = {
    viewScale: number;
};

const initialState: ScaleState = {
    viewScale: 1,
};

const scaleSlice = createSlice({
    name: 'viewScale',
    initialState,
    reducers: {
        setViewScale(state, action: PayloadAction<number>) {
            state.viewScale = action.payload;
        },
        resetViewScale(state) {
            state.viewScale = 1;
        },
    },
});

export const {
    setViewScale,
    resetViewScale,
} = scaleSlice.actions;

export const selectViewScale = (state: RootState) => state.viewScale.viewScale;

export const useViewScale = (): number => {
    const scale = useSelector(selectViewScale);
    return scale;
};

export default scaleSlice.reducer;
