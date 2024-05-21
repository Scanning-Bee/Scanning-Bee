import { DateRangePicker as BlueprintDateRangePicker } from '@blueprintjs/datetime';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';

export const DateRangePicker = (props: {
    startTime: Date;
    setStartTime: (startTime: Date) => void;
    endTime: Date;
    setEndTime: (endTime: Date) => void;
}) => {
    const { startTime, setStartTime, endTime, setEndTime } = props;

    const theme = useTheme();

    return (
        <div className='time-pickers flex-center' id={`stats-date-range-picker-${theme.title}`}>
            <BlueprintDateRangePicker
                onChange={(dates) => {
                    setStartTime(dates[0]);
                    setEndTime(dates[1]);
                }}
                value={[startTime, endTime]}
                timePrecision='millisecond'
                className={`stats-time-picker stats-time-picker-${theme.title}`}
                contiguousCalendarMonths={false}
            />
        </div>
    );
};
