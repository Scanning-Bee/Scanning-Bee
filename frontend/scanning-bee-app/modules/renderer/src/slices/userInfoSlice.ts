import { useSelector } from 'react-redux';
import StorageService from '@frontend/services/StorageService';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserInfoState = {
    firstName: string,
    lastName: string,
    userName: string,
    loggedIn: boolean,
};

const initialState: UserInfoState = {
    firstName: '',
    lastName: '',
    userName: '',
    loggedIn: StorageService.getAccessToken() !== null,
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfoState>) => {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.userName = action.payload.userName;
            state.loggedIn = action.payload.loggedIn;
        },
        resetUserInfo: (state) => {
            state.firstName = '';
            state.lastName = '';
            state.userName = '';
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
