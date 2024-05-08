import { Button, Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import CellType from '@frontend/models/cellType';
import { useAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import h337 from 'heatmap.js';
import React, { useEffect, useState } from 'react';

export const HEATMAP_CONTAINER_ID = 'heatmap-container';

export const getHeatmapContainer = (): HTMLElement => {
    const heatmapContainer = document.getElementById(HEATMAP_CONTAINER_ID);

    if (!heatmapContainer) {
        throw new Error('Heatmap container not found');
    }

    return heatmapContainer;
};

export const HeatmapMounter = () => {
    const theme = useTheme();

    const annotations = useAnnotations();

    const [shownCellType, setShownCellType] = useState<CellType>(null);

    useEffect(() => {
        const container = getHeatmapContainer();

        // clean the container
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const heatmapInstance = h337.create({
            // only container is required, the rest will be defaults
            container,
        });

        const dataPoints = annotations
            .filter(annotation => !shownCellType || annotation.cell_type === shownCellType)
            .map(annotation => ({
                x: annotation.center[0] / 2,
                y: 540 - annotation.center[1] / 2,
                value: 1,
            }));

        const max = 1;
        const min = 0;

        // heatmap data format
        const data = {
            max,
            min,
            data: dataPoints,
        };

        heatmapInstance.setData(data);
        heatmapInstance.repaint();

        console.log(heatmapInstance.getData());
    }, [shownCellType, annotations]);

    return (
        <div
            className='column-flex-center'
        >
            <div
                style={{
                    width: '960px',
                    height: '540px',
                }}
                className='heatmap-grid'
                id={HEATMAP_CONTAINER_ID}
            />
            <Popover
                interactionKind='click'
                position='left'
            >
                <Button
                    icon={<Icon icon='tag' color={theme.secondaryForeground} />}
                    text={<p className='nomargin' style={{ color: theme.secondaryForeground }}>
                        {shownCellType ? `Showing ${shownCellType} only` : 'Showing All'}
                    </p>}
                    large
                    minimal
                />
                <Menu>
                    {[...Object.keys(CellType), 'Show All'].map((cellType, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => {
                                if (cellType === 'Show All') {
                                    setShownCellType(null);
                                    return;
                                }
                                setShownCellType(CellType[cellType]);
                            }}
                            active={shownCellType === CellType[cellType]}
                            text={cellType}
                        />
                    ))}
                </Menu>
            </Popover>
        </div>
    );
};
