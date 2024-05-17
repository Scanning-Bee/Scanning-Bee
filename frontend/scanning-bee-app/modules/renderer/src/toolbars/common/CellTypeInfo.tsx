import { Button, Icon } from '@blueprintjs/core';
import CellType from '@frontend/models/cellType';
import { useTheme } from '@frontend/slices/themeSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import { HexagonBase } from '@frontend/views/base/HexagonBase';
import React, { useState } from 'react';

/**
 * this component is a legend for the different cell types.
 */
export const CellTypeInfo = () => {
    const theme = useTheme();

    const [showLegend, setShowLegend] = useState(false);

    return (
        <div
            className='column-flex-center shadowed'
        >
            <Button
                className='cell-type-info-toggle-button shadowed'
                icon={<Icon icon='info-sign' color={theme.primaryForeground} />}
                onClick={() => setShowLegend(!showLegend)}
                minimal
                large
                style={{ backgroundColor: `${theme.primaryBackground}88` }}
            />

            {
                showLegend && <div className='cell-type-info shadowed' style={{ backgroundColor: `${theme.primaryBackground}88` }}>
                    {Object.values(CellType).map(cellType => (
                        <div key={cellType} className='cell-type-info-row row-flex-center'>
                            <HexagonBase
                                color={CellTypeColours[cellType]}
                                width={14}
                                height={16}
                            />
                            <div
                                className='cell-type-info-title'
                                style={{ backgroundColor: CellTypeColours[cellType] }}
                            />
                            <p>{cellType}</p>
                        </div>
                    ))
                    }
                </div>
            }
        </div>
    );
};
