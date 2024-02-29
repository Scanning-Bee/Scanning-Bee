import { Button } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';

export const PickFolderPage = () => {
    const theme = useTheme();

    return (<div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.primaryBackground,
        color: theme.primaryForeground,
        justifyContent: 'center',
    }} className='page'>
        <Button
            text='Open a folder'
            minimal
            large
            onClick={() => {
                BackendInterface.getInstance().openFolderDialog();
            }}
            intent='success'
            icon='folder-new'
            style={{ padding: '5px', margin: '2px' }}
        />
        <p style={{ fontWeight: 'normal', fontSize: '16px' }} className='nomargin'>
            to start annotating, view your annotations or have a look at the statistics.
        </p>
    </div>);
};
