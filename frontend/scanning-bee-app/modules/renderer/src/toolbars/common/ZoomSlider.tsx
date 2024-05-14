import { Button, Icon, Slider } from '@blueprintjs/core';
import { useTheme } from '@frontend/slices/themeSlice';
import React, { useEffect, useState } from 'react';

export const ZoomSlider = (props: {
    handleZoomChange: (zoom: number) => void;
    lowerBound?: number;
    upperBound?: number;
    debounced?: boolean;
}) => {
    const { handleZoomChange, debounced } = props;

    const theme = useTheme();

    const [lowerBound, upperBound] = [props.lowerBound || 0.1, props.upperBound || 2];

    const [zoom, setZoom] = useState<number>((lowerBound + upperBound) / 2);

    const handleZoom = (value: number, ignoreDebounce?: boolean) => {
        if (value < lowerBound) {
            value = lowerBound;
        } else if (value > upperBound) {
            value = upperBound;
        } else {
            setZoom(value);
            if (!debounced || ignoreDebounce) handleZoomChange(value);
        }
    };

    useEffect(() => {
        handleZoomChange(zoom);
    }, []);

    return (
        <div className='zoom-slider column-flex-center shadowed' style={{ backgroundColor: `${theme.secondaryBackground}88` }}>
            <Button
                icon={<Icon icon='plus' color={theme.primaryForeground} />}
                onClick={() => handleZoom(zoom + 0.1, true)}
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
                onRelease={() => handleZoom(zoom, true)}
            />
            <Button
                icon={<Icon icon='minus' color={theme.primaryForeground} />}
                onClick={() => handleZoom(zoom - 0.1, true)}
                minimal
                style={{ backgroundColor: theme.secondaryBackground, color: theme.primaryForeground }}
            />
        </div>
    );
};
