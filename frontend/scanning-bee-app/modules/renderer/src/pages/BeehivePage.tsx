import { useTheme } from '@frontend/slices/themeSlice';
import { setViewScale } from '@frontend/slices/viewScaleSlice';
import { CellTypeInfo } from '@frontend/toolbars/common/CellTypeInfo';
import { ZoomSlider } from '@frontend/toolbars/common/ZoomSlider';
import { BeehiveView } from '@frontend/views/BeehiveView';
import React from 'react';
import { useDispatch } from 'react-redux';

export const BeehivePage = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    /* useEffect(() => {
        const cells = BackendInterface.getInstance().getBeehiveData();

        dispatch(setBeehiveCells(cells));
    }, []); */

    return (
        <div style={{
            color: theme.primaryForeground,
            backgroundColor: theme.primaryBackground,
            display: 'flex',
        }} className="page">
            <BeehiveView />
            <ZoomSlider
                debounced
                handleZoomChange={(zoom: number) => {
                    dispatch(setViewScale(zoom));
                }}
                lowerBound={0.1}
                upperBound={2}
            />
            <CellTypeInfo />
        </div>
    );
};
