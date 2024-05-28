/* eslint-disable no-await-in-loop */
import { CellContentDto, UserDto } from '@frontend/controllers/backendInterface/payloadTypes';
import { useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { getCellContentsBetween } from '@frontend/utils/annotationUtils';
import { randomColour } from '@frontend/utils/colours';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis,
} from 'recharts';

import BackendInterface from '../../controllers/backendInterface/backendInterface';
import { Loading } from '../common/Loading';
import { DateRangePicker } from './common/DateRangePicker';
import { processAnnotatorData } from './tools/processAnnotatorData';

/**
 * returns tools to enable highlighting a user when their name on the legend is hovered over.
 * @param users the user data (id, username or full name) to determine opacities of
 */
export const useHighlights = (users: string[]) => {
    const opacities: any = {};

    users.forEach((user) => {
        opacities[user] = 1;
    });

    const [opacity, setOpacity] = useState(opacities);

    const handleMouseEnter = useCallback(
        (o: any) => {
            const { dataKey } = o;
            const newOpacities: any = {};

            users.forEach((user) => {
                newOpacities[user] = dataKey === user ? 1 : 0.2;
            });
            setOpacity(newOpacities);
        },
        [setOpacity, users],
    );

    const handleMouseLeave = useCallback(
        () => {
            const newOpacities: any = {};

            users.forEach((user) => { newOpacities[user] = 1; });
            setOpacity(newOpacities);
        },
        [setOpacity, users],
    );

    return { opacity, handleMouseEnter, handleMouseLeave };
};

export const AnnotatorTimeChart = () => {
    const [data, setData] = useState<CellContentDto[]>(null);
    const [users, setUsers] = useState<UserDto[]>(null);

    const [startTime, setStartTime] = useState<Date>(null);
    const [endTime, setEndTime] = useState<Date>(null);

    const processedData = processAnnotatorData(data, users, startTime, endTime);

    const [loading, setLoading] = useState<boolean>(true);

    const folder = useAnnotationsFolder();

    const { opacity, handleMouseEnter, handleMouseLeave } = useHighlights(users ? users.map(user => user.username) : []);

    useEffect(() => {
        async function fetchUserWithID(id: number) {
            const res = await BackendInterface.getUsernameByID(id);
            return { ...res, id };
        }

        async function fetchAllCellContents() {
            const cachedContents = await BackendInterface.getCellContentsCached();
            const res = getCellContentsBetween(cachedContents, startTime, endTime);
            setData(res);

            if (!res) {
                setUsers([]);
                setLoading(false);

                return;
            }

            const annotators = [...new Set(res.map(cell => cell.user))];

            if (annotators.length === 0) {
                setUsers([]);
                setLoading(false);

                return;
            }

            const awaitedAnnotators = await Promise.all(annotators.map(fetchUserWithID));

            setUsers(
                awaitedAnnotators,
            );

            setLoading(false);
        }

        setLoading(true);
        fetchAllCellContents();
    }, [folder, startTime, endTime]);

    return (
        loading
            ? <Loading/>
            : <div className="list-stats">
                <div className="Chart">
                    <AreaChart
                        width={800}
                        height={500}
                        data={processedData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >

                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis label={{ value: 'total opens', angle: -90, position: 'insideLeft', fontSize: 24 }}/>

                        <Tooltip itemSorter={item => (item.value as number) * (-1)}/>
                        <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>
                        {users && users.map((key, index) => <Area
                            name={key.username}
                            key={index}
                            type="monotone"
                            dataKey={key.username}
                            stackId={1}
                            stroke={randomColour(key.username)}
                            strokeOpacity={0}
                            fillOpacity={opacity[key.username]}
                            fill={randomColour(key.username)}
                        />)}
                    </AreaChart>
                </div>

                <DateRangePicker
                    setStartTime={setStartTime}
                    setEndTime={setEndTime}
                    startTime={startTime}
                    endTime={endTime}
                />
            </div>
    );
};
