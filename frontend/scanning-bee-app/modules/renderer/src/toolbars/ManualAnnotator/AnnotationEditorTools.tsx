import { Button, Icon, IconName, Menu, MenuItem, Popover, Slider } from '@blueprintjs/core';
import Annotation, { AnnotationProps } from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import { addAnnotation, mutateAnnotation, removeAnnotation } from '@frontend/slices/annotationSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

const JoystickLayout = (props: {
    annotations: Annotation[],
}) => {
    const { annotations } = props;

    const dispatch = useDispatch();

    const joystickContent: { icon: IconName, direction: number[] }[][] = [
        [
            { icon: 'arrow-top-left', direction: [-1, -1] },
            { icon: 'arrow-up', direction: [0, -1] },
            { icon: 'arrow-top-right', direction: [1, -1] },
        ],
        [
            { icon: 'arrow-left', direction: [-1, 0] },
            { icon: 'circle', direction: [0, 0] },
            { icon: 'arrow-right', direction: [1, 0] },
        ],
        [
            { icon: 'arrow-bottom-left', direction: [-1, 1] },
            { icon: 'arrow-down', direction: [0, 1] },
            { icon: 'arrow-bottom-right', direction: [1, 1] },
        ],
    ];

    return (
        <div>
            {joystickContent.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((button, buttonIndex) => (
                        <Button
                            disabled={annotations.length === 0}
                            key={buttonIndex}
                            icon={<Icon icon={button.icon} />}
                            onClick={() => {
                                annotations.forEach((annotation) => {
                                    const mutation = {
                                        id: annotation.id,
                                        mutations: {
                                            center: [
                                                annotation.center[0] + button.direction[0],
                                                annotation.center[1] + button.direction[1],
                                            ],
                                        },

                                    };

                                    dispatch(mutateAnnotation(mutation));
                                });
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

const RadiusSlider = (props: {
    annotations: Annotation[],
}) => {
    const { annotations } = props;

    const dispatch = useDispatch();

    return (
        <Slider
            disabled={annotations.length !== 1}
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
    );
};

const CellTypePicker = (props: {
    annotations: Annotation[],
}) => {
    const { annotations } = props;

    const dispatch = useDispatch();

    const allAnnotationsAreSameCellType = annotations.length !== 0
        && annotations.every(annotation => annotation.cell_type === annotations[0].cell_type);

    return (
        <Popover
            interactionKind='click'
            position='right-top'
            disabled={annotations.length === 0}
        >
            <Button
                icon={<Icon icon='tag' />}
                text={(annotations.length === 1 || allAnnotationsAreSameCellType) ? annotations[0].cell_type : 'Cell type'}
                minimal
                disabled={annotations.length === 0}
                rightIcon={<Icon icon='caret-right' />}
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
                        disabled={annotations.length === 0}
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
            text={`Delete ${annotations.length} annotation${annotations.length === 1 ? '' : 's'}`}
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
            text='Create annotation'
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

export const AnnotationEditorTools = (props: {
    annotations: Annotation[],
    newAnnotationProps: AnnotationProps,
}) => {
    const { annotations, newAnnotationProps } = props;

    return (
        <div className='column-flex-center' style={{ width: '300px', margin: '40px' }}>
            <JoystickLayout annotations={annotations} />
            <RadiusSlider annotations={annotations} />
            <CellTypePicker annotations={annotations} />
            <div>
                <DeleteAnnotationButton annotations={annotations} />
                <CreateAnnotationButton annotationProps={newAnnotationProps} />
            </div>
        </div>
    );
};
