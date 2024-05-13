import { Dialog } from '@blueprintjs/core';
import { BeehiveCell } from '@frontend/models/beehive';
import React, { useEffect } from 'react';

export const CellDetailDialog = (props: {
    cellDetailDialogOpen: boolean,
    setCellDetailDialogOpen: (open: boolean) => void,
    cell: BeehiveCell,
}) => {
    const { cellDetailDialogOpen, setCellDetailDialogOpen, cell } = props;

    useEffect(() => {
        if (!cell) {
            setCellDetailDialogOpen(false);
        }
    }, [cell, setCellDetailDialogOpen]);

    if (!cell) {
        return null;
    }

    return (
        <Dialog
            isOpen={cellDetailDialogOpen}
            onClose={() => setCellDetailDialogOpen(false)}
            title='Cell Details'
            className='cell-detail-dialog'
        >
            <div className='cell-detail-dialog-content'>
                <h1>{cell.id}</h1>
                <p>{cell.cellType}</p>
                <p>{cell.x}</p>
                <p>{cell.y}</p>
            </div>
        </Dialog>
    );
};
