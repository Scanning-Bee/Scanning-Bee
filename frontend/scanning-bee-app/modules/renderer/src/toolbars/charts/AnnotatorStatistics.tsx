import CellType from '@frontend/models/cellType';
import { AnnotatorStatistic } from '@frontend/models/statistics';
import { useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import {
    Paper, Table, TableBody, TableContainer, TableHead, TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import BackendInterface from '../../controllers/backendInterface/backendInterface';
import { CellTypePickerMenu } from '../common/CellTypePickerMenu';
import { getStyledTableCell, StyledTableRow } from '../common/StyledTable';
import { DateRangePicker } from './common/DateRangePicker';

export const AnnotatorStatistics = () => {
    const theme = useTheme();

    const [annotatorStatistics, setAnnotatorStatistics] = useState<AnnotatorStatistic[]>([]);

    const [startTime, setStartTime] = useState<Date>(null);
    const [endTime, setEndTime] = useState<Date>(null);

    const [cellType, setCellType] = useState<CellType>(null);

    const folder = useAnnotationsFolder();

    useEffect(() => {
        async function fetchAnnotatorStatistics() {
            if (folder) {
                const annotatorStatisticsRes = await BackendInterface.getAnnotatorStatistics(folder);
                setAnnotatorStatistics(annotatorStatisticsRes);
            }
        }

        fetchAnnotatorStatistics();
    }, [folder]);

    return (
        <div className="list-stats">
            {annotatorStatistics.length === 0
                ? <p>No active users</p>
                : <div>
                    <TableContainer className="list-active-users" component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                {(() => {
                                    const StyledTableCellHead = getStyledTableCell(theme.primaryBackground, theme);
                                    return <TableRow>
                                        <StyledTableCellHead/>
                                        <StyledTableCellHead align="left">Full Name</StyledTableCellHead>
                                        <StyledTableCellHead align="left">Username</StyledTableCellHead>
                                        <StyledTableCellHead align="left">Total Annotations</StyledTableCellHead>
                                        <StyledTableCellHead align="left">Total Images Annotated</StyledTableCellHead>
                                    </TableRow>;
                                })()}
                            </TableHead>
                            <TableBody>
                                {annotatorStatistics.map((row, index) => {
                                    const cellColour = (index % 2) ? `${theme.secondaryBackground}` : `${theme.tertiaryBackground}`;

                                    const StyledTableCellStat = getStyledTableCell(cellColour, theme);

                                    return (
                                        <StyledTableRow key={index}>
                                            <StyledTableCellStat component="th" scope="row">
                                                {index + 1}
                                            </StyledTableCellStat>
                                            <StyledTableCellStat align="left">{row.fullName}</StyledTableCellStat>
                                            <StyledTableCellStat align="left">{row.username}</StyledTableCellStat>
                                            <StyledTableCellStat align="right">{row.totalAnnotations}</StyledTableCellStat>
                                            <StyledTableCellStat align="right">{row.totalImages}</StyledTableCellStat>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>}

            <div className='cell-type-picker'>
                <CellTypePickerMenu
                    cellType={cellType}
                    setCellType={setCellType}
                />
            </div>

            <DateRangePicker
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
            />
        </div>);
};
