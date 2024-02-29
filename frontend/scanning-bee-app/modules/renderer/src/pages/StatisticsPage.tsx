import { useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { AnnotationsByImageChart } from '@frontend/toolbars/charts/AnnotationsByImageChart';
import { CellTypeChart } from '@frontend/toolbars/charts/CellTypeChart';
import { TimestampChart } from '@frontend/toolbars/charts/TimestampChart';
import { XYChart } from '@frontend/toolbars/charts/XYChart';
import React from 'react';

import { PickFolderPage } from './PickFolderPage';

export const StatisticsPage = () => {
    const folder = useAnnotationsFolder();

    const theme = useTheme();

    if (!folder) {
        return <PickFolderPage />;
    }

    return (
        <div style={{
            color: theme.primaryForeground,
            backgroundColor: theme.primaryBackground,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: 'unset',
        }} className='page'>
            <h1>Cell Types</h1>
            <CellTypeChart />
            <div style={{ height: '20px' }} />

            <h1>Timestamps</h1>
            <TimestampChart />
            <div style={{ height: '20px' }} />

            <h1>X & Y Coordinates</h1>
            <XYChart />
            <div style={{ height: '20px' }} />

            <h1>Annotations by Image</h1>
            <AnnotationsByImageChart />
        </div>
    );
};
