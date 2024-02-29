import { useAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { TooltipContent } from './TooltipContent';

export const TimestampChart = () => {
    const theme = useTheme();
    const annotations = useAnnotations();

    const sortedAnnotations = annotations.sort((a, b) => {
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return a.timestamp - b.timestamp;
    });

    const timestamps = sortedAnnotations.reduce((acc, annotation) => {
        const { timestamp } = annotation;

        if (!timestamp) return acc;

        if (timestamp in acc) {
            acc[timestamp] += 1;
        } else {
            acc[timestamp] = 1;
        }
        return acc;
    }, {} as { [timestamp: string]: number });

    const data = Object.entries(timestamps).map(([timestamp, count]) => ({ timestamp, count }));

    return (
        <div style={{
            backgroundColor: theme.primaryBackground,
            color: theme.primaryForeground,
            display: 'flex',
        }}>
            <LineChart
                width={500}
                height={400}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{ fontSize: 'smaller', color: theme.secondaryForeground }}
            >
                <XAxis dataKey='timestamp' fontSize='smaller' />
                <YAxis />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip
                    contentStyle={{ color: 'black' }}
                    content={({ active, payload, label }) => <TooltipContent
                        active={active}
                        payload={payload[0]?.value}
                        label={new Date(Math.round(label * 1000)).toLocaleString()}
                    />}
                />
                <Line
                    dataKey='count'
                    type='monotone'
                    stroke={theme.primaryAccent}
                />
            </LineChart>
        </div>
    );
};
