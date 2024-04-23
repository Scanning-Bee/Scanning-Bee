import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { useViewScale } from '@frontend/slices/viewScaleSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import React, { useEffect, useState } from 'react';

import { HexagonView } from './HexagonView';

export const BeehiveView = () => {
    const viewScale = useViewScale();

    const [cells, setCells] = useState([]);

    useEffect(() => {
        setCells(BackendInterface.getInstance().getBeehiveData());
    }, []);

    console.log(viewScale);

    return (
        <div
            id='beehive-container'
            style={{
                scale: String(viewScale),
            }}
        >
            {
                cells.map(cell => <div
                    key={cell.id}
                    className='beehive-cell'
                    style={{
                        left: cell.x,
                        top: cell.y,
                    }}
                >
                    <HexagonView
                        color={CellTypeColours[cell.cellType]}
                    />
                </div>)
            }
        </div>
    );
};
