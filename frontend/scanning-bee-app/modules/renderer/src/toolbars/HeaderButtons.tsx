import { Button, Icon } from '@blueprintjs/core';
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

    return (
        <div
            id="header-buttons"
            className='header-container header-container-right'
        >
            <SettingsButton setPage={setPage} />
        </div>
    );
};
