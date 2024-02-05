import { Button, Divider, Icon, Menu, MenuItem, Popover, Slider } from '@blueprintjs/core';
import Annotation, { AnnotationProps } from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import { addAnnotation, mutateAnnotation, removeAnnotation } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

const RadiusSlider = (props: {
    annotations: Annotation[],
}) => {
    const { annotations } = props;

    const dispatch = useDispatch();

    const disabled = annotations.length !== 1;

    return (
        <Popover
            interactionKind='click'
            position='left'
            disabled={disabled}
        >
            <Button
                icon={<Icon icon='circle' />}
                minimal
                disabled={disabled}
            />
            <div style={{ padding: '10px', width: '200px' }}>
                <Slider
                    disabled={disabled}
                    min={0}
                    max={100}
                    stepSize={1}
                    labelStepSize={10}
                    onChange={value => dispatch(mutateAnnotation({
                        id: annotations[0].id,
                        mutations: { radius: value },
                    }))}
                    value={annotations[0]?.radius || 86}
                />
            </div>
        </Popover>
    );
};

const CellTypePicker = (props: {
    annotations: Annotation[],
}) => {
    const { annotations } = props;

    const dispatch = useDispatch();

    const allAnnotationsAreSameCellType = annotations.length !== 0
        && annotations.every(annotation => annotation.cell_type === annotations[0].cell_type);

    const disabled = annotations.length === 0;

    return (
        <Popover
            interactionKind='click'
            position='left'
            disabled={disabled}
        >
            <Button
                icon={<Icon icon='tag' />}
                minimal
                disabled={disabled}
            />
            <Menu>
                {Object.keys(CellType).map((cellType, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => annotations.forEach(annotation => dispatch(mutateAnnotation({
                            id: annotation.id,
                            mutations: { cell_type: CellType[cellType] },
                        })))}
                        active={allAnnotationsAreSameCellType && annotations[0].cell_type === CellType[cellType]}
                        disabled={disabled}
                        text={cellType}
                    />
                ))}
            </Menu>
        </Popover>
    );
};

const DeleteAnnotationButton = (props: {
    annotations: Annotation[],
}) => {
    const { annotations } = props;

    const dispatch = useDispatch();

    return (
        <Button
            icon={<Icon icon='trash' />}
            intent='danger'
            minimal
            onClick={() => annotations.forEach(annotation => dispatch(removeAnnotation(annotation.id)))}
            disabled={annotations.length === 0}
        />
    );
};

const CreateAnnotationButton = (props: { annotationProps: AnnotationProps }) => {
    const dispatch = useDispatch();

    return (
        <Button
            icon={<Icon icon='add' />}
            intent='success'
            minimal
            onClick={() => {
                const newAnnotation = new Annotation(props.annotationProps);
                dispatch(addAnnotation(Annotation.toPlainObject(newAnnotation)));
            }}
            disabled={!props.annotationProps}
        />
    );
};

const GridButton = (props: { onClick: () => void }) => (
    <Button
        icon={<Icon icon='grid' />}
        minimal
        onClick={props.onClick}
    />
);

const SetBrushModeButton = (props: {
    mode: string,
    setBrushMode: (set?: boolean) => void,
    brushCellType: CellType,
    setBrushCellType: (cellType: CellType) => void
}) => {
    const disabled = false;

    const brushModeOn = props.mode === 'brush';

    return (
        <Popover
            interactionKind='click'
            position='left'
            disabled={disabled}
        >
            <Button
                icon={<Icon icon='highlight' />}
                minimal
                intent={brushModeOn ? 'primary' : 'none'}
                onClick={(e) => {
                    if (brushModeOn) {
                        e.stopPropagation();
                        props.setBrushMode(false);
                    }
                }}
            />
            <Menu>
                {Object.keys(CellType).map((cellType, index) => {
                    const active = brushModeOn && props.brushCellType === CellType[cellType];

                    return (
                        <MenuItem
                            key={index}
                            onClick={() => {
                                if (active) {
                                    props.setBrushMode(false);
                                } else {
                                    props.setBrushMode(true);
                                    props.setBrushCellType(CellType[cellType]);
                                }
                            }}
                            active={active}
                            icon={active ? 'tick' : 'blank'}
                            disabled={disabled}
                            text={cellType}
                        />
                    );
                })}
            </Menu>
        </Popover>
    );
};

export const AnnotationEditorTools = (props: {
    annotations: Annotation[],
    newAnnotationProps: AnnotationProps,
    toggleGrid: () => void,
    mode: string,
    setBrushMode: () => void,
    brushCellType: CellType,
    setBrushCellType: (cellType: CellType) => void,
}) => {
    const { annotations, newAnnotationProps, toggleGrid, mode, setBrushMode, setBrushCellType, brushCellType } = props;

    const theme = useTheme();

    return (
        <div
            className='column-flex-center manual-annotator-toolbar'
            style={{
                backgroundColor: theme.secondaryBackground,
                color: theme.secondaryForeground,
            }}
        >
            <CreateAnnotationButton annotationProps={newAnnotationProps} />
            <Divider style={{ width: '100%' }} />
            <DeleteAnnotationButton annotations={annotations} />
            <RadiusSlider annotations={annotations} />
            <CellTypePicker annotations={annotations} />
            <GridButton onClick={toggleGrid} />
            <SetBrushModeButton
                mode={mode}
                setBrushMode={setBrushMode}
                setBrushCellType={setBrushCellType}
                brushCellType={brushCellType}
            />
        </div>
    );
};
