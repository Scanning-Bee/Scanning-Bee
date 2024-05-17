import { Button } from '@blueprintjs/core';
import { openBeehive } from '@frontend/slices/beehiveSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

const beehives = [
    'Austria',
    'Belgium',
    'Bulgaria',
    'Turkey',
];

export const PickBeehivePage = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    return (<div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.primaryBackground,
        color: theme.primaryForeground,
        justifyContent: 'center',
    }} className='page'>
        <div>
            <div
                className='column-flex-center'
            >
                <p style={{ fontWeight: 'bold', fontSize: 18, margin: '0' }}>Choose a beehive</p>
                {
                    beehives.map((beehive, index) => (
                        <Button
                            key={index}
                            text={beehive}
                            minimal
                            onClick={() => {
                                dispatch(openBeehive(beehive));
                            }}
                            style={{
                                padding: '5px',
                                margin: '0 5px',
                                color: theme.primaryForeground,
                            }}
                        />
                    ))
                }
            </div>
        </div>
    </div>);
};
