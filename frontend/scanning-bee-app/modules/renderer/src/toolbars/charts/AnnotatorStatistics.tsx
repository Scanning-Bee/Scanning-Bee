import { UserDto } from '@frontend/controllers/backendInterface/payloadTypes';
import { useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { Roles, useRole } from '@frontend/slices/permissionSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { useUserInfo } from '@frontend/slices/userInfoSlice';
import { getCellContentsBetween } from '@frontend/utils/annotationUtils';
import {
    Paper, Table, TableBody, TableContainer, TableHead, TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import BackendInterface from '../../controllers/backendInterface/backendInterface';
import { getStyledTableCell, StyledTableRow } from '../common/StyledTable';
import { DateRangePicker } from './common/DateRangePicker';

export const AnnotatorStatistics = () => {
    const theme = useTheme();

    const userRole = useRole();
    const userInfo = useUserInfo();

    const [users, setUsers] = useState<UserDto[]>(null);

    const [startTime, setStartTime] = useState<Date>(null);
    const [endTime, setEndTime] = useState<Date>(null);

    const folder = useAnnotationsFolder();

    useEffect(() => {
        async function fetchUserWithID(id: number) {
            const username = await BackendInterface.getUsernameByID(id);
            const res = await BackendInterface.getUserByUsername(username.username);

            return { ...res, id };
        }

        async function fetchAllCellContents() {
            const res = getCellContentsBetween(await BackendInterface.getCellContents(), startTime, endTime);

            if (!res) {
                setUsers([]);

                return;
            }

            const annotators = [...new Set(res.map(cell => cell.user))];

            if (annotators.length === 0) {
                setUsers([]);

                return;
            }

            const awaitedAnnotators = await Promise.all(annotators.map(fetchUserWithID));

            setUsers(
                userRole === Roles.BIOLOG
                    ? awaitedAnnotators
                    : awaitedAnnotators.filter(annotator => annotator.username === userInfo.userName),
            );
        }

        fetchAllCellContents();
    }, [folder, startTime, endTime, userRole, userInfo]);

    return (
        <div className="list-stats">
            <div>
                <TableContainer className="list-active-users" component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            {(() => {
                                const StyledTableCellHead = getStyledTableCell(theme.primaryBackground, theme);
                                return <TableRow>
                                    <StyledTableCellHead/>
                                    <StyledTableCellHead align="left">ID</StyledTableCellHead>
                                    <StyledTableCellHead align="left">Username</StyledTableCellHead>
                                    <StyledTableCellHead align="left">Email</StyledTableCellHead>
                                    <StyledTableCellHead align="left">Total Annotations</StyledTableCellHead>
                                </TableRow>;
                            })()}
                        </TableHead>
                        <TableBody>
                            {users && users.map((row, index) => {
                                const cellColour = (index % 2) ? `${theme.secondaryBackground}` : `${theme.tertiaryBackground}`;

                                const StyledTableCellStat = getStyledTableCell(cellColour, theme);

                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCellStat component="th" scope="row">
                                            {index + 1}
                                        </StyledTableCellStat>
                                        <StyledTableCellStat align="left">{row.id}</StyledTableCellStat>
                                        <StyledTableCellStat align="left">{row.username}</StyledTableCellStat>
                                        <StyledTableCellStat align="right">{row.email}</StyledTableCellStat>
                                        <StyledTableCellStat align="right">{row.annotation_count}</StyledTableCellStat>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <DateRangePicker
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
            />
        </div>);
};
