import { Divider, Icon, Tab, Tabs } from '@blueprintjs/core';
import { useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { Roles, useRole } from '@frontend/slices/permissionSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { AnnotatorStatistics } from '@frontend/toolbars/charts/AnnotatorStatistics';
import { AnnotatorTimeChart } from '@frontend/toolbars/charts/AnnotatorTimeChart';
import { CellTypeChart } from '@frontend/toolbars/charts/CellTypeChart';
import { HeatmapMounter } from '@frontend/toolbars/charts/Heatmap';
import { XYChart } from '@frontend/toolbars/charts/XYChart';
import { CellTypeInfo } from '@frontend/toolbars/common/CellTypeInfo';
import React, { useState } from 'react';

import { PickFolderPage } from './PickFolderPage';

type TabType = 'cell-types' | 'xy-coordinates' | 'heatmap' | 'annotator-stats';

export const StatisticsPage = () => {
    const folder = useAnnotationsFolder();

    const userRole = useRole();

    const theme = useTheme();

    const [activeTab, setActiveTab] = useState<TabType>('cell-types');

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
        }} className='page statistics-page'>
            <Tabs
                id='StatsTabs'
                onChange={id => setActiveTab(id as TabType)}
                defaultSelectedTabId='general'
                selectedTabId={activeTab}
                vertical
                renderActiveTabPanelOnly
                className={`stats-tabs stats-tabs-${theme.title}`}
            >
                <Tab
                    id={'cell-types' as TabType}
                    title={
                        <div className='stats-tab'>
                            <Icon icon='pie-chart' />
                            Cell Types
                        </div>
                    }
                    panel={
                        <div className='column-flex-center stats-panel'>
                            <h1>Cell Types</h1>
                            <CellTypeChart />
                            <div style={{ height: '20px' }} />
                        </div>
                    }
                    style={{ color: theme.primaryForeground }}
                />

                <Tab
                    id={'xy-coordinates' as TabType}
                    title={
                        <div className='stats-tab'>
                            <Icon icon='scatter-plot' />
                            X & Y Coordinates
                        </div>
                    }
                    panel={
                        <div className='column-flex-center stats-panel'>
                            <h1>X & Y Coordinates</h1>
                            <XYChart />
                            <div style={{ height: '20px' }} />
                        </div>
                    }
                    style={{ color: theme.primaryForeground }}
                />

                <Tab
                    id={'heatmap' as TabType}
                    title={
                        <div className='stats-tab'>
                            <Icon icon='heatmap' />
                            Heatmap
                        </div>
                    }
                    panel={
                        <div className='column-flex-center stats-panel'>
                            <h1>Heatmap</h1>
                            <HeatmapMounter />
                        </div>
                    }
                    style={{ color: theme.primaryForeground }}
                />

                <Divider style={{
                    backgroundColor: theme.secondaryForeground,
                    width: 'calc(100% - 10px)',
                }}/>

                <Tab
                    id={'annotator-stats' as TabType}
                    title={
                        <div className='stats-tab'>
                            <Icon icon='user' />
                            Annotator Statistics
                        </div>
                    }
                    panel={
                        <div className='column-flex-center stats-panel'>
                            <h1>Annotator Statistics</h1>
                            <AnnotatorStatistics />
                        </div>
                    }
                    style={{ color: theme.primaryForeground }}
                />

                {userRole === Roles.BIOLOG && <Tab
                    id={'admin-panel' as TabType}
                    title={
                        <div className='stats-tab'>
                            <Icon icon='console' />
                            Admin Panel
                        </div>
                    }
                    panel={
                        <div className='column-flex-center stats-panel'>
                            <h1>Admin Panel</h1>
                            <AnnotatorTimeChart />
                        </div>
                    }
                    style={{ color: theme.primaryForeground }}
                />}

                <CellTypeInfo />
            </Tabs>
        </div>
    );
};
