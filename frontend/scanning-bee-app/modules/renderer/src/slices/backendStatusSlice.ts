import { useSelector } from 'react-redux';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BackendStatusState = {
    isOnline: boolean;
};

const initialState: BackendStatusState = {
    isOnline: true,
};

const backendStatusSlice = createSlice({
    name: 'backendStatus',
    initialState,
    reducers: {
        setBackendOnline(state, action: PayloadAction<boolean>) {
            state.isOnline = action.payload;
        },
    },
});

export const {
    setBackendOnline,
} = backendStatusSlice.actions;

export const selectBackendStatus = (state: RootState) => state.backendStatus.isOnline;

export const useIsBackendOnline = () => {
    const online = useSelector(selectBackendStatus);
    return online;
};

export const getIsBackendOnline = (state: RootState) => state.backendStatus.isOnline;
export default backendStatusSlice.reducer;
