import { Button, Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import CellType from '@frontend/models/cellType';
import { useAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
// @ts-ignore
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
                x: annotation.center[0] / (12 / 5),
                y: 450 - annotation.center[1] / (12 / 5),
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
    }, [shownCellType, annotations]);

    return (
        <div
            className='column-flex-center'
        >
            <h3
                style={{ margin: '-20px 0 20px 0', fontWeight: 'normal' }}
            >for {shownCellType || 'all cells'}</h3>
            <div
                style={{
                    width: '800px',
                    height: '450px',
                }}
                className='heatmap-grid'
                id={HEATMAP_CONTAINER_ID}
            />
            <Popover
                interactionKind='click'
            >
                <Button
                    icon={<Icon icon='tag' color={theme.secondaryForeground} />}
                    text={<p className='nomargin' style={{ color: theme.secondaryForeground }}>
                        {shownCellType ? `Showing ${shownCellType} only` : 'Showing All'}
                    </p>}
                    large
                    minimal
                    style={{ marginTop: '10px' }}
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
