import { useAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import React from 'react';
import {
    Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis,
} from 'recharts';

import { TooltipContent } from './TooltipContent';

export const CellTypeChart = () => {
    const theme = useTheme();
    const annotations = useAnnotations();

    const cellTypeCount = annotations.reduce((acc, annotation) => {
        const cellType = annotation.cell_type;
        if (cellType in acc) {
            acc[cellType] += 1;
        } else {
            acc[cellType] = 1;
        }
        return acc;
    }, {} as { [cellType: string]: number });

    const data = Object.entries(cellTypeCount).map(([cellType, count]) => ({ cellType, count }));

    return (
        <div style={{
            backgroundColor: theme.primaryBackground,
            color: theme.primaryForeground,
            display: 'flex',
        }}>
            <BarChart
                width={500}
                height={400}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{ fontSize: 'smaller', color: theme.secondaryForeground }}
            >
                <XAxis dataKey='cellType' fontSize='smaller' interval={0} />
                <YAxis />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip
                    contentStyle={{ color: 'black' }}
                    content={({ active, payload, label }) => <TooltipContent
                        active={active}
                        payload={payload[0]?.value}
                        label={label}
                    />}
                />
                <Bar
                    dataKey='count'
                    fill='#8884d8'
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CellTypeColours[entry.cellType]} />
                    ))}
                </Bar>
            </BarChart>
        </div>
    );
};
