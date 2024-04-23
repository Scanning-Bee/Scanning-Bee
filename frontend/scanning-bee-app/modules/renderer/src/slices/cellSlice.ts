import { useSelector } from 'react-redux';
import { BeehiveCell } from '@frontend/models/beehive';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CellState = {
    cells: BeehiveCell[],
};

const initialState: CellState = {
    cells: [],
};

const cellSlice = createSlice({
    name: 'annotatorCell',
    initialState,
    reducers: {
        setBeehiveCells: (state, action: PayloadAction<BeehiveCell[]>) => {
            state.cells = action.payload;
        },

        setBeehiveCellWithId: (state, action: PayloadAction<number>) => {
            state.cells = state.cells.map((cell) => {
                if (cell.id === action.payload) {
                    return {
                        ...cell,
                        cellType: cell.cellType,
                    };
                }
                return cell;
            });
        },

        resetBeehiveCells: (state) => {
            state.cells = [];
        },
    },
});

export const {
    setBeehiveCells,
    setBeehiveCellWithId,
    resetBeehiveCells,
} = cellSlice.actions;

export const selectCells = (state: RootState) => state.cell.cells;

export const useCells = () => useSelector(selectCells);

export const useCell = (id: number) => useSelector((state: RootState) => state.cell.cells.find(cell => cell.id === id));

export default cellSlice.reducer;
