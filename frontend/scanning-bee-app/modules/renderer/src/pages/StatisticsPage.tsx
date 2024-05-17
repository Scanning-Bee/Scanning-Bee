import { useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { CellTypeChart } from '@frontend/toolbars/charts/CellTypeChart';
import { HeatmapMounter } from '@frontend/toolbars/charts/Heatmap';
import { XYChart } from '@frontend/toolbars/charts/XYChart';
import { CellTypeInfo } from '@frontend/toolbars/common/CellTypeInfo';
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
            padding: '20px',
        }} className='page'>
            <h1>Cell Types</h1>
            <CellTypeChart />
            <div style={{ height: '20px' }} />

            <h1>X & Y Coordinates</h1>
            <XYChart />
            <div style={{ height: '20px' }} />

            <h1>Heatmap</h1>
            <HeatmapMounter />

            <CellTypeInfo />
        </div>
    );
};
