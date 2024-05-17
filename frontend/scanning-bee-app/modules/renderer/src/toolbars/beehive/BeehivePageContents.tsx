import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { BeehiveCell } from '@frontend/models/beehive';
import CellType from '@frontend/models/cellType';
import { useViewScale } from '@frontend/slices/viewScaleSlice';
import { CellDetailDialog } from '@frontend/toolbars/beehive/CellDetailDialog';
import { CellTypeColours } from '@frontend/utils/colours';
import React, { useEffect, useState } from 'react';

import { OccludingBeeBase } from '../../views/base/OccludingBeeBase';
import { HexagonView } from '../../views/HexagonView';

export const BeehivePageContents = () => {
    const viewScale = useViewScale();

    const [cells, setCells] = useState<BeehiveCell[]>([]);

    const [selectedCell, setSelectedCell] = useState<BeehiveCell>(null);

    const [cellDetailDialogOpen, setCellDetailDialogOpen] = useState(false);

    useEffect(() => {
        setCells(BackendInterface.getInstance().getBeehiveData());
    }, []);

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
        </div>
    );
};
