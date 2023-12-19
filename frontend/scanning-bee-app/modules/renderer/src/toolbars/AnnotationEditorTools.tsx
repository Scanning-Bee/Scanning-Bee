import { Button, Icon, IconName, Menu, MenuItem, Popover, Slider } from '@blueprintjs/core';
import Annotation, { AnnotationMutation, AnnotationProps } from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import { addAnnotation, mutateAnnotation, removeAnnotation } from '@frontend/slices/annotationSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

const JoystickLayout = (props: {
    annotation: Annotation,
}) => {
    const { annotation } = props;

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
                            disabled={!annotation}
                            key={buttonIndex}
                            icon={<Icon icon={button.icon} />}
                            onClick={() => {
                                const mutation: AnnotationMutation = {
                                    id: annotation.id,
                                    mutations: {
                                        center: [
                                            annotation.center[0] + button.direction[0],
                                            annotation.center[1] + button.direction[1],
                                        ],
                                    },
                                };

                                dispatch(mutateAnnotation(mutation));
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

const RadiusSlider = (props: {
    annotation: Annotation,
}) => {
    const { annotation } = props;

    const dispatch = useDispatch();

    return (
        <Slider
            disabled={!annotation}
            min={0}
            max={100}
            stepSize={1}
            labelStepSize={10}
            onChange={value => dispatch(mutateAnnotation({
                id: annotation.id,
                mutations: { radius: value },
            }))}
            value={annotation?.radius || 86}
        />
    );
};

const CellTypePicker = (props: {
    annotation: Annotation,
}) => {
    const { annotation } = props;

    const dispatch = useDispatch();

    return (
        <Popover
            interactionKind='click'
            position='right-top'
            disabled={!annotation}
        >
            <Button
                icon={<Icon icon='tag' />}
                text={annotation?.cell_type || 'Cell type'}
                minimal
                disabled={!annotation}
                rightIcon={<Icon icon='caret-right' />}
            />
            <Menu>
                {Object.keys(CellType).map((cellType, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => dispatch(mutateAnnotation({
                            id: annotation.id,
                            mutations: { cell_type: CellType[cellType] },
                        }))}
                        active={annotation?.cell_type === cellType}
                        disabled={!annotation}
                        text={cellType}
                    />
                ))}
            </Menu>
        </Popover>
    );
};

const DeleteAnnotationButton = (props: {
    annotation: Annotation,
}) => {
    const { annotation } = props;

    const dispatch = useDispatch();

    return (
        <Button
            icon={<Icon icon='trash' />}
            text='Delete annotation'
            intent='danger'
            minimal
            onClick={() => dispatch(removeAnnotation(annotation.id))}
            disabled={!annotation}
        />
    );
};

const CreateAnnotationButton = (props: { annotationProps: AnnotationProps }) => {
    const dispatch = useDispatch();

    return (
        <Button
            icon={<Icon icon='add' />}
            text='Create annotation'
            intent='primary'
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
    annotation: Annotation,
    newAnnotationProps: AnnotationProps,
}) => {
    const { annotation, newAnnotationProps } = props;

    return (
        <div className='column-flex-center' style={{ width: '500px' }}>
            <JoystickLayout annotation={annotation} />
            <RadiusSlider annotation={annotation} />
            <CellTypePicker annotation={annotation} />
            <div>
                <DeleteAnnotationButton annotation={annotation} />
                <CreateAnnotationButton annotationProps={newAnnotationProps} />
            </div>
        </div>
    );
};
