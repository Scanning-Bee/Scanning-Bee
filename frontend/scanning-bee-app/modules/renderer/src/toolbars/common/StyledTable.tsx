import { TableCell, tableCellClasses, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Theme } from '@scanning_bee/ipc-interfaces';

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const getStyledTableCell = (cellColour: string, actualTheme: Theme) => styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: actualTheme.primaryForeground,
        color: actualTheme.primaryBackground,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: actualTheme.primaryForeground,
        backgroundColor: cellColour,
    },
}));
