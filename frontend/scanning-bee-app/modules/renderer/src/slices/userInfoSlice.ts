import { useSelector } from 'react-redux';
import StorageService from '@frontend/services/StorageService';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserInfoState = {
    userName: string,
    userId: string,
    loggedIn: boolean,
};

const initialState: UserInfoState = {
    userName: '',
    userId: '',
    loggedIn: StorageService.getAccessToken() !== null,
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfoState>) => {
            state.userName = action.payload.userName;
            state.userId = action.payload.userId;
            state.loggedIn = action.payload.loggedIn;
        },
        resetUserInfo: (state) => {
            state.userName = '';
            state.userId = '';
            state.loggedIn = false;
        },
        authorizeUser: (state) => {
            state.loggedIn = true;
        },
        unauthorizeUser: (state) => {
            state.loggedIn = false;
        },
    },
});

export const {
    setUserInfo,
    resetUserInfo,
    authorizeUser,
    unauthorizeUser,
} = userInfoSlice.actions;

export const selectUserInfo = (state: RootState): UserInfoState => state.userInfo;

export const useUserInfo = (): UserInfoState => useSelector(selectUserInfo);

export default userInfoSlice.reducer;
