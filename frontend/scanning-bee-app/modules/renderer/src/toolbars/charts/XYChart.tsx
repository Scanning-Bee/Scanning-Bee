import { useAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import React from 'react';
import { CartesianGrid, Cell, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

import { TooltipContent } from './TooltipContent';

export const XYChart = () => {
    const theme = useTheme();
    const annotations = useAnnotations();

    const data = annotations.map(annotation => ({
        x: annotation.center[0],
        y: annotation.center[1],
        cell_type: annotation.cell_type,
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
                        labelPayloads={
                            [
                                {
                                    label: 'Cell Type',
                                    payload: payload[0]?.payload.cell_type,
                                },
                                {
                                    label: 'x, y',
                                    payload: `${payload[0]?.value}, ${payload[1]?.value}`,
                                },
                            ]
                        }
                    />}
                />
                <Scatter data={data} fill="#8884d8" >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CellTypeColours[entry.cell_type]} />
                    ))}
                </Scatter>
            </ScatterChart>
        </div>
    );
};
