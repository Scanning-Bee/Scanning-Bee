import BackendInterface from '@frontend/controllers/backendInterface/backendInterface';
import { CellContentDto } from '@frontend/controllers/backendInterface/payloadTypes';
import CellType from '@frontend/models/cellType';
import { useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { getCellTypeFromNumber } from '@frontend/utils/annotationUtils';
// @ts-ignore
import h337 from 'heatmap.js';
import React, { useEffect, useState } from 'react';

import { CellTypePickerMenu } from '../common/CellTypePickerMenu';
import { Loading } from '../common/Loading';

export const HEATMAP_CONTAINER_ID = 'heatmap-container';

export const getHeatmapContainer = (): HTMLElement => {
    const heatmapContainer = document.getElementById(HEATMAP_CONTAINER_ID);

    if (!heatmapContainer) {
        throw new Error('Heatmap container not found');
    }

    return heatmapContainer;
};

export const HeatmapMounter = () => {
    const folder = useAnnotationsFolder();

    const [cellContents, setCellContents] = useState<CellContentDto[]>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [shownCellType, setShownCellType] = useState<CellType>(null);

    useEffect(() => {
        async function fetchAllCellContents() {
            const cachedContents = await BackendInterface.getCellContentsCached();

            if (!cachedContents) {
                setCellContents([]);
            } else {
                setCellContents(cachedContents);
            }

            setLoading(false);
        }

        setLoading(true);
        fetchAllCellContents();
    }, [folder]);

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

        const dataPoints = cellContents ? cellContents
            .filter(annotation => !shownCellType || getCellTypeFromNumber(annotation.content as number) === shownCellType)
            .map(annotation => ({
                x: annotation.cell_indices[0] * 6,
                y: 648 - annotation.cell_indices[1] * 6,
                value: 1,
            })) : [];

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
    }, [shownCellType, cellContents, loading]);

    if (!cellContents || loading) {
        return <>
            <Loading />
            <div
                style={{
                    width: '800px',
                    height: '450px',
                    display: 'none',
                }}
                className='heatmap-grid'
                id={HEATMAP_CONTAINER_ID}
            />
        </>;
    }

    return (
        <div
            className='column-flex-center'
        >
            <h3
                style={{ margin: '-20px 0 20px 0', fontWeight: 'normal' }}
            >for {shownCellType || 'all cells'}</h3>
            <div
                style={{
                    width: '804px',
                    height: '648px',
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
