import { useTheme } from '@frontend/slices/themeSlice';
import { setViewScale } from '@frontend/slices/viewScaleSlice';
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
            <ZoomSlider handleZoomChange={(zoom: number) => {
                dispatch(setViewScale(zoom));
            }} />
        </div>
    );
};
