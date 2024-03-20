import { Button, Icon, Slider } from '@blueprintjs/core';
import { useTheme } from '@frontend/slices/themeSlice';
import React, { useState } from 'react';

export const ZoomSlider = (props: {
    handleZoomChange: (zoom: number) => void;
}) => {
    const { handleZoomChange } = props;

    const theme = useTheme();

    const [zoom, setZoom] = useState<number>(1);

    const [lowerBound, upperBound] = [0, 2];

    const handleZoom = (value: number) => {
        if (value < lowerBound) {
            value = lowerBound;
        } else if (value > upperBound) {
            value = upperBound;
        } else {
            setZoom(value);
            handleZoomChange(value);
        }
    };

    return (
        <div className='zoom-slider column-flex-center'>
            <Button
                icon={<Icon icon='plus' color={theme.primaryForeground} />}
                onClick={() => handleZoom(zoom + 0.1)}
                minimal
                style={{ backgroundColor: theme.secondaryBackground, color: theme.primaryForeground }}
            />
            <Slider
                value={zoom}
                min={lowerBound - 0.1}
                max={upperBound}
                onChange={handleZoom}
                vertical
                stepSize={0.1}
                labelRenderer={false}
                showTrackFill={false}
                className='zoom-slider-slider'
            />
            <Button
                icon={<Icon icon='minus' color={theme.primaryForeground} />}
                onClick={() => handleZoom(zoom - 0.1)}
                minimal
                style={{ backgroundColor: theme.secondaryBackground, color: theme.primaryForeground }}
            />
        </div>
    );
};
