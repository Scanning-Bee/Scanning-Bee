import { Button, Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import BackendInterface from '@frontend/controllers/backendInterface/backendInterface';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';

const SettingsButton = (props: { setPage: any }) => {
    const { setPage } = props;

    const theme = useTheme();

    return (
        <Button
            minimal
            icon={<Icon icon="cog" style={{ color: theme.secondaryForeground }} />}
            onClick={(e) => {
                e.preventDefault();
                setPage('settings');
            }}
            style={{ padding: '5px', margin: '2px' }}
            className='header-button'
        />
    );
};

export const HeaderButtons = (props: { page: any, setPage: any }) => {
    const { setPage } = props;

    const theme = useTheme();

    return (
        <div
            id="header-buttons"
            className='header-container header-container-right'
        >
            <SettingsButton setPage={setPage} />

            <Popover
                interactionKind='click'
                position='bottom'
                fill
                canEscapeKeyClose
                usePortal
                minimal
            >
                <Button
                    icon={<Icon icon="user" style={{ color: theme.secondaryForeground }} />}
                    minimal
                    className='header-button'
                />
                <Menu>
                    <MenuItem   
                        text='Log out'
                        icon='log-out'
                        onClick={() => BackendInterface.logout()}
                    />
                </Menu>
            </Popover>
        </div>
    );
};
