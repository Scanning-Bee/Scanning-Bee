import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { BeehiveCell } from '@frontend/models/beehive';
import CellType from '@frontend/models/cellType';
import {
    setAnimationPlaying,
    setShownDataTimestamp,
    useAnimationSpeed,
    useAnimationTimestamps,
    useBeehiveName,
    useIsAnimationPlaying,
    useShownDataTimestamp,
} from '@frontend/slices/beehiveSlice';
import { useViewScale } from '@frontend/slices/viewScaleSlice';
import { CellDetailDialog } from '@frontend/toolbars/beehive/CellDetailDialog';
import { CellTypeColours } from '@frontend/utils/colours';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { OccludingBeeBase } from '../../views/base/OccludingBeeBase';
import { HexagonView } from '../../views/HexagonView';
import { TimeAdjuster } from './TimeAdjuster';

export const BeehivePageContents = () => {
    const viewScale = useViewScale();

    const dispatch = useDispatch();

    const [cells, setCells] = useState<BeehiveCell[]>([]);
    const [selectedCell, setSelectedCell] = useState<BeehiveCell>(null);

    const [cellDetailDialogOpen, setCellDetailDialogOpen] = useState(false);

    const beehiveName = useBeehiveName();
    const isAnimationPlaying = useIsAnimationPlaying();
    const [start, end] = useAnimationTimestamps();
    const shownDataTimestamp = useShownDataTimestamp();
    const animationSpeed = useAnimationSpeed();

    const [wasAnimationPlaying, setWasAnimationPlaying] = useState(false);
    const [animationPaused, setAnimationPaused] = useState(false);

    useEffect(() => {
        setCells(BackendInterface.getInstance().getBeehiveData(beehiveName, shownDataTimestamp));
    }, [shownDataTimestamp, beehiveName]);

    useEffect(() => {
        if (!start || !end) {
            return null;
        }
        if (isAnimationPlaying) {
            if (!wasAnimationPlaying && !animationPaused) {
                dispatch(setShownDataTimestamp(start));
            }

            setWasAnimationPlaying(true);

            const interval = setInterval(() => {
                if (shownDataTimestamp >= end) {
                    dispatch(setShownDataTimestamp(start));
                    dispatch(setAnimationPlaying(false));
                    return;
                }

                if (shownDataTimestamp < start) {
                    dispatch(setShownDataTimestamp(start));
                    return;
                }

                dispatch(setShownDataTimestamp(
                    shownDataTimestamp + 120_000,
                ));
            }, 500 / animationSpeed);

            setAnimationPaused(false);

            return () => clearInterval(interval);
        }

        setWasAnimationPlaying(false);

        return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shownDataTimestamp, isAnimationPlaying, animationSpeed, start, end]);

    return (
        <div
            id='beehive-container'
        >
            {
                cells.map(cell => <div
                    key={cell.id}
                    className='beehive-cell'
                    style={{
                        left: `${cell.x * viewScale}px`,
                        top: `${cell.y * viewScale}px`,
                    }}
                    onClick={() => {
                        setSelectedCell(cell);
                        setCellDetailDialogOpen(true);
                    }}
                >
                    <HexagonView
                        color={CellTypeColours[cell.cellType]}
                        scale={viewScale}
                    />
                    {
                        cell.cellType === CellType.BEE_OCCLUDED
                                && <OccludingBeeBase color='white' scale={viewScale} />
                    }
                </div>)
            }

            <CellDetailDialog
                cellDetailDialogOpen={cellDetailDialogOpen}
                setCellDetailDialogOpen={setCellDetailDialogOpen}
                cell={selectedCell}
            />

            <TimeAdjuster
                setAnimationPaused={setAnimationPaused}
            />
        </div>
    );
};
