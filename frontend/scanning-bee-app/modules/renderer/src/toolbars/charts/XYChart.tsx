import BackendInterface from '@frontend/controllers/backendInterface/backendInterface';
import { CellContentDto } from '@frontend/controllers/backendInterface/payloadTypes';
import { useTheme } from '@frontend/slices/themeSlice';
import { getCellTypeFromNumber } from '@frontend/utils/annotationUtils';
import { CellTypeColours } from '@frontend/utils/colours';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Cell, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

import { Loading } from '../common/Loading';
import { TooltipContent } from './TooltipContent';

export const XYChart = () => {
    const theme = useTheme();

    const [cellContents, setCellContents] = useState<CellContentDto[]>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchAllCellContents() {
            const cachedContents = await BackendInterface.getCellContentsCached();

            if (!cachedContents) {
                setCellContents([]);
            } else {
                setCellContents(cachedContents);
            }

            setLoading(false);
        }

        setLoading(true);
        fetchAllCellContents();
    }, []);

    if (!cellContents || loading) {
        return <Loading />;
    }

    const data = cellContents.map(annotation => ({
        x: annotation.cell_indices[0],
        y: 648 - annotation.cell_indices[1],
        cell_type: getCellTypeFromNumber(annotation.content as number),
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
