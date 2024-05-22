/* eslint-disable no-await-in-loop */
import { useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { randomColour } from '@frontend/utils/colours';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis,
} from 'recharts';

import BackendInterface from '../../controllers/backendInterface/backendInterface';
import { AnnotatorData, processAnnotatorData } from './tools/processAnnotatorData';

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
    const [data, setData] = useState<AnnotatorData>(null);

    const folder = useAnnotationsFolder();

    const [users, setUsers] = useState<string[]>([]);

    const { opacity, handleMouseEnter, handleMouseLeave } = useHighlights(users);

    useEffect(() => {
        async function fetchUsersForFolder() {
            const res = await BackendInterface.getAnnotatorsForFolder(folder);
            setUsers(res);
        }

        fetchUsersForFolder();
    }, [folder]);

    useEffect(() => {
        async function fetchAnnotatorData() {
            const dataToBeSet: AnnotatorData = {};

            for (const user of users) {
                const res = await BackendInterface.getAnnotationsMadeByUser(user);

                dataToBeSet[user] = res;
            }

            setData(dataToBeSet);
        }

        fetchAnnotatorData();
    }, [users]);

    console.log(processAnnotatorData(data));

    return (
        <div className="Chart">
            <AreaChart
                width={800}
                height={500}
                data={processAnnotatorData(data)}
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
                {data && Object.keys(data).map((key, index) => <Area
                    name={key}
                    key={index}
                    type="monotone"
                    dataKey={key}
                    stackId={1}
                    stroke={randomColour(key)}
                    strokeOpacity={0}
                    fillOpacity={opacity[key]}
                    fill={randomColour(key)}
                />)}
            </AreaChart>
        </div>
    );
};
