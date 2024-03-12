import { Button, Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import CellType from '@frontend/models/cellType';
import {
    ManualAnnotatorMode,
    setManualAnnotatorMode,
    setModeParams, useManualAnnotatorModeWithParams,
} from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { getIconForMode } from '@frontend/utils/annotationUtils';
import { uppercaseFirstLetter } from '@frontend/utils/miscUtils';
import React from 'react';
import { useDispatch } from 'react-redux';

const ModeMenu = () => {
    const dispatch = useDispatch();

    const { mode, modeParams } = useManualAnnotatorModeWithParams();

    return (
        <Menu>
            <MenuItem
                icon={getIconForMode(ManualAnnotatorMode.Default)}
                text='Default'
                active={mode === ManualAnnotatorMode.Default}
                onClick={() => dispatch(setManualAnnotatorMode(ManualAnnotatorMode.Default))}
            />

            <MenuItem
                icon={getIconForMode(ManualAnnotatorMode.Brush)}
                text='Brush'
                active={mode === ManualAnnotatorMode.Brush}
            >
                {Object.keys(CellType).map((cellType, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            dispatch(setManualAnnotatorMode(ManualAnnotatorMode.Brush));
                            dispatch(setModeParams({ cellType: CellType[cellType] }));
                        }}
                        icon={modeParams.cellType === cellType
                            ? 'small-tick'
                            : 'blank'}
                        text={cellType}
                    />
                ))}
            </MenuItem>

            <MenuItem
                icon={getIconForMode(ManualAnnotatorMode.Add)}
                text='Add'
                active={mode === ManualAnnotatorMode.Add}
                onClick={() => dispatch(setManualAnnotatorMode(ManualAnnotatorMode.Add))}
            />

            <MenuItem
                icon={getIconForMode(ManualAnnotatorMode.Delete)}
                text='Delete'
                active={mode === ManualAnnotatorMode.Delete}
                onClick={() => dispatch(setManualAnnotatorMode(ManualAnnotatorMode.Delete))}
            />
        </Menu>
    );
};

export const ModeButton = () => {
    const theme = useTheme();

    const annotatorMode = useManualAnnotatorModeWithParams();

    return (
        <div
            className='column-flex-center manual-annotator-mode-button'
            style={{
                backgroundColor: theme.secondaryBackground,
                color: theme.secondaryForeground,
            }}
        >
            <Popover
                interactionKind='click'
                position='left'
            >
                <Button
                    icon={<Icon icon='style' color={theme.secondaryForeground} />}
                    text={`Annotator Mode: ${uppercaseFirstLetter(annotatorMode.mode)}`}
                    minimal
                    style={{ color: theme.primaryForeground }}
                />
                <ModeMenu />
            </Popover>
        </div>
    );
};
