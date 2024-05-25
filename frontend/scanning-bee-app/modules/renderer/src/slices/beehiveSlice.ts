import { useSelector } from 'react-redux';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const ANIMATION_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

/**
 * ! In this slice, the Date objects are stored as timestamps (number) instead of Date objects.
 */

type BeehiveState = {
    isAnimationPlaying: boolean;
    animationTimestamps: number[];
    shownDataTimestamp: number;
    animationSpeed: number;
};

const initialState: BeehiveState = {
    isAnimationPlaying: false,
    animationTimestamps: [new Date().getTime() - 120_000, new Date().getTime()],
    shownDataTimestamp: new Date().getTime(),
    animationSpeed: 1,
};

const beehiveSlice = createSlice({
    name: 'beehive',
    initialState,
    reducers: {
        setAnimationPlaying: (state, action: PayloadAction<boolean>) => {
            state.isAnimationPlaying = action.payload;
        },
        setAnimationTimestamps: (state, action: PayloadAction<number[]>) => {
            state.animationTimestamps = action.payload;
        },
        setShownDataTimestamp: (state, action: PayloadAction<number>) => {
            state.shownDataTimestamp = action.payload;
        },
        setAnimationSpeed: (state, action: PayloadAction<number>) => {
            state.animationSpeed = action.payload;
        },
    },
});

export const {
    setAnimationPlaying,
    setAnimationTimestamps,
    setShownDataTimestamp,
    setAnimationSpeed,
} = beehiveSlice.actions;

export const selectIsAnimationPlaying = (state: RootState) => state.beehive.isAnimationPlaying;
export const selectAnimationTimestamps = (state: RootState) => state.beehive.animationTimestamps;
export const selectShownDataTimestamp = (state: RootState) => state.beehive.shownDataTimestamp;
export const selectAnimationSpeed = (state: RootState) => state.beehive.animationSpeed;

export const useIsAnimationPlaying = () => useSelector(selectIsAnimationPlaying);
export const useAnimationTimestamps = () => useSelector(selectAnimationTimestamps);
export const useShownDataTimestamp = () => useSelector(selectShownDataTimestamp);
export const useAnimationSpeed = () => useSelector(selectAnimationSpeed);

export default beehiveSlice.reducer;
