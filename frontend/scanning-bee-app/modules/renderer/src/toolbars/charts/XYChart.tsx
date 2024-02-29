import { useAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';
import { CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

import { TooltipContent } from './TooltipContent';

export const XYChart = () => {
    const theme = useTheme();
    const annotations = useAnnotations();

    const data = annotations.map(annotation => ({
        x: annotation.center[0],
        y: annotation.center[1],
    }));

    return (
        <div style={{
            backgroundColor: theme.primaryBackground,
            color: theme.primaryForeground,
            display: 'flex',
        }}>
            <ScatterChart
                width={500}
                height={400}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{ fontSize: 'smaller', color: theme.secondaryForeground }}
            >
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="stature" />
                <YAxis type="number" dataKey="y" name="weight" />
                <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => <TooltipContent
                        active={active}
                        payload={`${payload[0]?.value}, ${payload[1]?.value}`}
                        label={'x, y'}
                    />}
                />
                <Scatter data={data} fill="#8884d8" />
            </ScatterChart>
        </div>
    );
};
