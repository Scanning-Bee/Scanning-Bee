import { useSelector } from 'react-redux';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ScaleState = {
    annotatorScale: number;
};

const initialState: ScaleState = {
    annotatorScale: 1,
};

const scaleSlice = createSlice({
    name: 'annotatorScale',
    initialState,
    reducers: {
        setAnnotatorScale(state, action: PayloadAction<number>) {
            state.annotatorScale = action.payload;
        },
        resetAnnotatorScale(state) {
            state.annotatorScale = 1;
        },
    },
});

export const {
    setAnnotatorScale,
    resetAnnotatorScale,
} = scaleSlice.actions;

export const selectAnnotatorScale = (state: RootState) => state.annotatorScale.annotatorScale;

export const useAnnotatorScale = (): number => {
    const scale = useSelector(selectAnnotatorScale);
    return scale;
};

export default scaleSlice.reducer;
