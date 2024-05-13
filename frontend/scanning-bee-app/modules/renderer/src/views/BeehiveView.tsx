import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { BeehiveCell } from '@frontend/models/beehive';
import CellType from '@frontend/models/cellType';
import { useViewScale } from '@frontend/slices/viewScaleSlice';
import { CellDetailDialog } from '@frontend/toolbars/beehive/CellDetailDialog';
import { CellTypeColours } from '@frontend/utils/colours';
import React, { useEffect, useState } from 'react';

import { OccludingBeeBase } from './base/OccludingBeeBase';
import { HexagonView } from './HexagonView';

export const BeehiveView = () => {
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
            style={{
                scale: String(viewScale),
            }}
        >
            {
                cells.map(cell => <div
                    key={cell.id}
                    className='beehive-cell'
                    style={{
                        left: cell.x,
                        top: cell.y,
                    }}
                    onClick={() => {
                        setSelectedCell(cell);
                        setCellDetailDialogOpen(true);
                    }}
                >
                    <HexagonView
                        color={CellTypeColours[cell.cellType]}
                    />
                    {
                        cell.cellType === CellType.BEE_OCCLUDED
                            && <OccludingBeeBase color='white'/>
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
