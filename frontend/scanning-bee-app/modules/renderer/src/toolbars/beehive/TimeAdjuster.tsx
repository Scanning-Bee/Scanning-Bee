import { Button, Divider, Icon, Menu, MenuItem, Popover, Position } from '@blueprintjs/core';
import { DatePicker } from '@blueprintjs/datetime';
import {
    ANIMATION_SPEEDS,
    setAnimationPlaying,
    setAnimationSpeed,
    setAnimationTimestamps,
    setShownDataTimestamp,
    useAnimationSpeed,
    useAnimationTimestamps,
    useIsAnimationPlaying,
    useShownDataTimestamp,
} from '@frontend/slices/beehiveSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export const TimeAdjuster = (props: {
    setAnimationPaused: (a: boolean) => void;
}) => {
    const { setAnimationPaused } = props;

    const theme = useTheme();

    const dispatch = useDispatch();

    const isAnimationPlaying = useIsAnimationPlaying();
    const animationTimestamps = useAnimationTimestamps();
    const shownDataTimestamp = useShownDataTimestamp();
    const animationSpeed = useAnimationSpeed();

    const animationDates = animationTimestamps.map(ts => new Date(ts));
    const shownDataDate = new Date(shownDataTimestamp);

    return (
        <div className="time-adjuster shadowed" style={{ backgroundColor: `${theme.primaryBackground}AA` }}>
            <div className="column-flex-center" style={{ width: '220px' }}>
                <div className='flex-center'>
                    <p className='time-adjuster-from-to'>From: </p>
                    <Popover
                        position={Position.TOP}
                        interactionKind='click'
                    >
                        <Button
                            text={animationDates[0].toLocaleString()}
                            minimal
                            style={{ color: theme.secondaryForeground, fontWeight: 'lighter' }}
                        />
                        <DatePicker
                            onChange={(date: Date) => {
                                if (!date) return;
                                dispatch(setAnimationTimestamps([date.getTime(), animationTimestamps[1]]));
                            }}
                            value={animationDates[0]}
                            timePrecision='millisecond'
                        />
                    </Popover>
                </div>
                <div className='flex-center'>
                    <p className='time-adjuster-from-to'>To: </p>
                    <Popover
                        position={Position.TOP}
                        interactionKind='click'
                    >
                        <Button
                            text={animationDates[1].toLocaleString()}
                            minimal
                            style={{ color: theme.secondaryForeground, fontWeight: 'lighter' }}
                        />
                        <DatePicker
                            onChange={(date: Date) => {
                                if (!date) return;
                                dispatch(setAnimationTimestamps([animationTimestamps[0], date.getTime()]));
                            }}
                            value={animationDates[1]}
                            timePrecision='millisecond'
                        />
                    </Popover>
                </div>
            </div>
            <div className="column-flex-center" style={{ marginTop: '9px' }}>
                <div
                    onClick={() => {
                        if (isAnimationPlaying) setAnimationPaused(true);
                        dispatch(setAnimationPlaying(!isAnimationPlaying));
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <Icon
                        icon={isAnimationPlaying ? 'pause' : 'play'}
                        iconSize={Icon.SIZE_LARGE}
                        color={theme.primaryForeground}
                    />
                </div>
                <Popover
                    position={Position.TOP}
                    interactionKind='click'
                >
                    <Button
                        style={{ margin: 0, fontWeight: 'lighter', color: theme.secondaryForeground }}
                        text={`${animationSpeed}x`}
                        minimal
                        small
                    />
                    <Menu>
                        {ANIMATION_SPEEDS.map((speed, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => dispatch(setAnimationSpeed(speed))}
                                text={`${speed.toString()}x`}
                                active={speed === animationSpeed}
                            />
                        ))}
                    </Menu>
                </Popover>
            </div>
            <Divider style={{ backgroundColor: theme.primaryForeground, margin: '0 10px 0 15px' }} />
            <div className="timestamp-display">
                <p>Showing Data From:</p>
                <Popover
                    position={Position.TOP}
                    interactionKind='click'
                >
                    <Button
                        text={shownDataDate.toLocaleString()}
                        minimal
                        style={{ color: theme.secondaryForeground, fontWeight: 'lighter', marginLeft: '-25px' }}
                    />
                    <DatePicker
                        onChange={(date: Date) => {
                            if (!date) return;
                            dispatch(setShownDataTimestamp(date.getTime()));
                        }}
                        value={shownDataDate}
                        timePrecision='millisecond'
                    />
                </Popover>
            </div>
        </div>
    );
};
