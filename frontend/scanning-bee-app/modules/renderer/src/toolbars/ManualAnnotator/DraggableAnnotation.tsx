import Annotation from '@frontend/models/annotation';
import {
    ManualAnnotatorMode,
    ManualAnnotatorModeParams,
    mutateAnnotation,
    removeAnnotation,
    setActiveAnnotations,
    setAnnotationAsActive,
    useManualAnnotatorModeWithParams,
} from '@frontend/slices/annotationSlice';
import { useAnnotatorScale } from '@frontend/slices/annotatorScaleSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import { isMac } from '@frontend/utils/platform';
import { UUID } from 'crypto';
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';

const clickHandler = (
    e: any,
    annotation: Annotation,
    isActive: boolean,
    dispatch: any,
    mode: ManualAnnotatorMode,
    modeParams: ManualAnnotatorModeParams,
) => {
    // e.stopPropagation();

    switch (mode) {
    case ManualAnnotatorMode.Default:
        if ((isMac() && e.metaKey) || (!isMac() && e.ctrlKey)) {
            dispatch(setAnnotationAsActive({ id: annotation.id, active: !isActive }));
        } else {
            dispatch(setActiveAnnotations(
                isActive ? [] : [annotation.id],
            ));
        }
        break;
    case ManualAnnotatorMode.Brush:
        dispatch(mutateAnnotation({
            id: annotation.id,
            mutations: { cell_type: modeParams.cellType },
        }));
        break;
    case ManualAnnotatorMode.Delete:
        dispatch(setActiveAnnotations([]));
        dispatch(removeAnnotation(annotation.id));
        break;
    default:
        break;
    }
};

export const DraggableAnnotation = (props: {
    key: any,
    annotation: Annotation,
    topOffset: number,
    leftOffset: number,
    activeAnnotationIds: UUID[],
}) => {
    const { key, annotation, topOffset, leftOffset, activeAnnotationIds } = props;

    const dispatch = useDispatch();

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const { mode, modeParams } = useManualAnnotatorModeWithParams();

    const scale = useAnnotatorScale();
    const actualScale = scale / 2;

    const radius = annotation.radius * actualScale;
    const diameter = radius * 2;

    const centerX = annotation.center[0] * actualScale - radius;
    const centerY = annotation.center[1] * actualScale - radius;

    const isActive = activeAnnotationIds.includes(annotation.id);

    const debouncedAnnotationActivator = () => {
        if (isDragging) return;

        dispatch(setActiveAnnotations([annotation.id]));

        setIsDragging(true);
    };

    const dragStopped = (e: any, pos: any) => {
        e.stopPropagation();

        const newX = (pos.x + radius) / actualScale;
        const newY = (pos.y + radius) / actualScale;

        const mutation = {
            id: annotation.id,
            mutations: { center: [newX, newY] },
        };

        dispatch(mutateAnnotation(mutation));

        setIsDragging(false);
    };

    return (
        <div
            key={key}
            onMouseDown={e => clickHandler(
                e,
                annotation,
                isActive,
                dispatch,
                mode,
                modeParams,
            )}
        >
            { /* @ts-ignore */ }
            <Draggable
                position={{ x: centerX, y: centerY }}
                onDrag={debouncedAnnotationActivator}
                onStop={dragStopped}
            >
                <div
                    key={annotation.id}
                    className='flex-center noselect'
                    style={{
                        position: 'absolute',
                        left: `${leftOffset}px`,
                        top: `${topOffset}px`,
                        width: `${diameter}px`,
                        height: `${diameter}px`,
                        border: `3px solid ${CellTypeColours[annotation.cell_type]}`,
                        borderRadius: '50%',
                        color: CellTypeColours[annotation.cell_type],
                        backgroundColor: isActive ? '#00FF0044' : 'transparent',
                        cursor: 'pointer',
                    }}
                >
                    {annotation.cell_type}
                </div>
            </Draggable>
        </div>
    );
};
