import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';
import Loader from 'react-loader-spinner';

export const Loading = () => {
    const theme = useTheme();

    return (
        <div>
            <Loader
                height={40}
                width={40}
                color={theme.secondaryForeground}
                type='TailSpin'
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}
            />
            <p style={{ textAlign: 'center', color: theme.secondaryForeground }}>
                Loading... Please wait.
            </p>
        </div>
    );
};
