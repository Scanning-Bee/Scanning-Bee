import { useSelector } from 'react-redux';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Permission {
    BEEHIVE = 'beehive',
    MANUAL_ANNOTATOR = 'manual_annotator',
    STATISTICS = 'statistics',
    MANAGE_USERS = 'manage_users',
    REGISTRATE_USERS = 'registrate_users',
}

type PermissionState = {
    permissions: Permission[];
};

const initialState: PermissionState = {
    permissions: [],
};

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        setPermissions(state, action: PayloadAction<Permission[]>) {
            state.permissions = action.payload;
        },
    },
});

export const {
    setPermissions,
} = permissionSlice.actions;

export const selectPermissions = (state: RootState) => state.permission.permissions;

export const usePermissions = (): Permission[] => {
    const permissions = useSelector(selectPermissions);
    return permissions;
};

export default permissionSlice.reducer;
