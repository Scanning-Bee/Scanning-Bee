import { useSelector } from 'react-redux';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const MAX_TRY_COUNT = 3;

let tryCount = 0;

type BackendStatus = 'online' | 'offline' | 'connecting';

type BackendStatusState = {
    status: BackendStatus;
};

const initialState: BackendStatusState = {
    status: 'connecting',
};

const backendStatusSlice = createSlice({
    name: 'backendStatus',
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<BackendStatus>) {
            state.status = action.payload;
        },
        reload(state) {
            state.status = 'connecting';
            tryCount = 0;
        },
    },
});

export const {
    setStatus,
    reload,
} = backendStatusSlice.actions;

export const setBackendOnline = (isOnline: boolean) => {
    const { dispatch } = (window as any).store;

    if (isOnline) {
        dispatch(setStatus('online'));
        tryCount = 0;
        return;
    }

    if (tryCount < MAX_TRY_COUNT) {
        dispatch(setStatus('connecting'));
        tryCount += 1;
        return;
    }

    dispatch(setStatus('offline'));
};

export const resetBackendStatus = () => {
    const { dispatch } = (window as any).store;
    dispatch(reload());
};

export const selectBackendStatus = (state: RootState) => state.backendStatus.status;

export const useBackendStatus = () => {
    const status = useSelector(selectBackendStatus);
    return status;
};

export const getBackendStatus = (state: RootState) => state.backendStatus.status;

export default backendStatusSlice.reducer;
