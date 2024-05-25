import { useSelector } from 'react-redux';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Permissions = {
    registrateUsers: boolean;
    manageUsers: boolean;
    beehive: boolean;
    manualAnnotator: boolean;
    statistics: boolean;
};

export type Permission = keyof Permissions;

export enum Roles {
    BIOLOG = 1,
    ANNOTATOR = 2,
}

export const ROLE_PERMISSION_TABLE: Record<Roles, Permissions> = {
    [Roles.BIOLOG]: {
        registrateUsers: true,
        manageUsers: true,
        beehive: true,
        manualAnnotator: true,
        statistics: true,
    },
    [Roles.ANNOTATOR]: {
        registrateUsers: false,
        manageUsers: false,
        beehive: true,
        manualAnnotator: true,
        statistics: true,
    },
};

type PermissionState = {
    role: Roles;
    permissions: Permissions;
};

const initialState: PermissionState = {
    role: Roles.ANNOTATOR,
    permissions: ROLE_PERMISSION_TABLE[Roles.ANNOTATOR],
};

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<Roles>) => {
            state.role = action.payload;
            state.permissions = ROLE_PERMISSION_TABLE[action.payload];
        },

        setPermissions: (state, action: PayloadAction<Permissions>) => {
            state.permissions = action.payload;
        },

        updatePermission: (state, action: PayloadAction<Partial<Permissions>>) => {
            state.permissions = {
                ...state.permissions,
                ...action.payload,
            };
        },

        resetRole: (state) => {
            state.role = Roles.ANNOTATOR;
            state.permissions = ROLE_PERMISSION_TABLE[Roles.ANNOTATOR];
        },
    },
});

export const {
    setRole,
    setPermissions,
    updatePermission,
    resetRole,
} = permissionSlice.actions;

export const selectRole = (state: RootState) => state.permission.role;
export const selectPermissions = (state: RootState) => state.permission.permissions;

export const useRole = (): Roles => {
    const role = useSelector(selectRole);
    return role;
};

export const usePermissions = (): Permissions => {
    const permissions = useSelector(selectPermissions);
    return permissions;
};

export const useHasPermissionTo = (permission: Permission): boolean => {
    const permissions = usePermissions();
    return permissions[permission];
};

export default permissionSlice.reducer;
