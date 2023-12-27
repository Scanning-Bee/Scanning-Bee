import { Button, Icon } from '@blueprintjs/core';
import { lightTheme } from '@frontend/utils/colours';
import React from 'react';

const HomeButton = (props: { setPage: any }) => {
    const { setPage } = props;

    const theme = lightTheme;

    return (
        <Button
            minimal
            icon={<Icon icon="home" style={{ color: theme.secondaryForeground }} />}
            onClick={(e) => {
                e.preventDefault();
                setPage('home');
            }}
            style={{ padding: '5px', margin: '2px' }}
            large
            className='header-button'
        />
    );
};

const ManualAnnotatorButton = (props: { setPage: any }) => {
    const { setPage } = props;

    const theme = lightTheme;

    return (
        <Button
            minimal
            icon={<Icon icon="annotation" style={{ color: theme.secondaryForeground }} />}
            onClick={(e) => {
                e.preventDefault();
                setPage('manual-annotator');
            }}
            style={{ padding: '5px', margin: '2px' }}
            large
            className='header-button'
        />
    );
};

export const HeaderButtons = (props: { page: any, setPage: any }) => {
    const { setPage } = props;

    const theme = lightTheme;

    return (
        <div
            id="header-buttons"
            style={{
                background: theme.secondaryBackground,
                borderBottom: theme.secondaryBackground === theme.primaryBackground
                    ? `1px solid ${theme.primaryBorder}` : 'none',
                color: theme.secondaryForeground,
            }}
            className='header-container header-container-right'
        >
            <HomeButton setPage={setPage} />
            <ManualAnnotatorButton setPage={setPage} />
        </div>
    );
};
