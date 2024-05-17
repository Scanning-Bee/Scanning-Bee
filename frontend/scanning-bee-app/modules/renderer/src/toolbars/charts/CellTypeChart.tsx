import { useAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { TooltipContent } from './TooltipContent';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

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

    const sortedData = data.sort((a, b) => b.count - a.count);

    return (
        <div style={{
            backgroundColor: theme.primaryBackground,
            color: theme.primaryForeground,
            display: 'flex',
        }}>
            <PieChart
                width={500}
                height={400}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{ fontSize: 'smaller', color: theme.secondaryForeground }}
            >
                <Tooltip
                    contentStyle={{ color: 'black' }}
                    content={({ active, payload, _label }) => <TooltipContent
                        active={active}
                        labelPayloads={[{ label: payload[0]?.payload.cellType, payload: payload[0]?.value }]}
                    />}
                />
                <Pie
                    data={sortedData}
                    cx="50%"
                    cy="50%"
                    labelLine
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="count"
                >
                    {sortedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CellTypeColours[entry.cellType]} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    );
};
