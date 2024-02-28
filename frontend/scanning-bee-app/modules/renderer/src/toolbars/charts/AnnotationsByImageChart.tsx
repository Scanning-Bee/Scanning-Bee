import { useAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';
import {
    Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis,
} from 'recharts';

import { TooltipContent } from './TooltipContent';

export const AnnotationsByImageChart = () => {
    const theme = useTheme();
    const annotations = useAnnotations();

    const annotationsByImage = annotations.reduce((acc, annotation) => {
        const image = annotation.source_name;
        if (image in acc) {
            acc[image] += 1;
        } else {
            acc[image] = 1;
        }
        return acc;
    }, {} as { [image: string]: number });

    const data = Object.entries(annotationsByImage).map(([image, count]) => ({ image, count }));

    const sortedData = data.sort((a, b) => b.count - a.count);

    return (
        <div style={{
            backgroundColor: theme.primaryBackground,
            color: theme.primaryForeground,
            display: 'flex',
        }}>
            <BarChart
                width={500}
                height={Math.max(600, data.length * 20)}
                data={sortedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{ fontSize: 'smaller', color: theme.secondaryForeground }}
                layout='vertical'
            >
                <XAxis type='number'/>
                <YAxis dataKey='image' fontSize='smaller' interval={0} type='category' scale='point'/>
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
                />
            </BarChart>
        </div>
    );
};
