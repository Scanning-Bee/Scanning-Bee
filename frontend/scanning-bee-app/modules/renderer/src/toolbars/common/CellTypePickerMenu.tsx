import { Button, Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import CellType from '@frontend/models/cellType';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';

export const CellTypePickerMenu = (props: {
    cellType: CellType;
    setCellType: (cellType: CellType) => void;
}) => {
    const { cellType, setCellType } = props;

    const theme = useTheme();

    return (
        <Popover
            interactionKind='click'
        >
            <Button
                icon={<Icon icon='tag' color={theme.secondaryForeground} />}
                text={<p className='nomargin' style={{ color: theme.secondaryForeground }}>
                    {cellType ? `Showing ${cellType} only` : 'Showing All'}
                </p>}
                large
                minimal
                style={{ marginTop: '10px' }}
            />
            <Menu>
                {[...Object.keys(CellType), 'Show All'].map((ct, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            if (ct === 'Show All') {
                                setCellType(null);
                                return;
                            }
                            setCellType(CellType[ct]);
                        }}
                        active={cellType === CellType[ct]}
                        text={ct}
                    />
                ))}
            </Menu>
        </Popover>
    );
};
