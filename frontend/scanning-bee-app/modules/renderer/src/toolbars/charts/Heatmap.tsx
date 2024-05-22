import CellType from '@frontend/models/cellType';
import { useAnnotations } from '@frontend/slices/annotationSlice';
// @ts-ignore
import h337 from 'heatmap.js';
import React, { useEffect, useState } from 'react';

import { CellTypePickerMenu } from '../common/CellTypePickerMenu';

export const HEATMAP_CONTAINER_ID = 'heatmap-container';

export const getHeatmapContainer = (): HTMLElement => {
    const heatmapContainer = document.getElementById(HEATMAP_CONTAINER_ID);

    if (!heatmapContainer) {
        throw new Error('Heatmap container not found');
    }

    return heatmapContainer;
};

export const HeatmapMounter = () => {
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
            <CellTypePickerMenu
                cellType={shownCellType}
                setCellType={setShownCellType}
            />
        </div>
    );
};
