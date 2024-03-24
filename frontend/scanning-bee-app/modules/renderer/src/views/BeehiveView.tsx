import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { useViewScale } from '@frontend/slices/viewScaleSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import React from 'react';

import { HexagonView } from './HexagonView';

export const BeehiveView = () => {
    const scale = useViewScale();

    const cells = BackendInterface.getInstance().getBeehiveData();

    return (
        <div
            id='beehive-container'
        >
            {
                cells.map(cell => <div
                    key={cell.id}
                    className='beehive-cell'
                    style={{
                        left: cell.x * scale,
                        top: cell.y * scale,
                    }}
                >
                    <HexagonView
                        color={CellTypeColours[cell.cellType]}
                        scale={scale}
                    />
                </div>)
            }
        </div>
    );
};
