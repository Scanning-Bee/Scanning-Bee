import Annotation from '@frontend/models/annotation';
import { mutateAnnotation, setActiveAnnotations, setAnnotationAsActive } from '@frontend/slices/annotationSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import { isMac } from '@frontend/utils/platform';
import { UUID } from 'crypto';
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';

export const DraggableAnnotation = (props: {
    key: any,
    annotation: Annotation,
    leftOffset: number,
    activeAnnotationIds: UUID[],
}) => {
    const { key, annotation, leftOffset, activeAnnotationIds } = props;

    const dispatch = useDispatch();

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const radius = annotation.radius / 2;
    const centerX = annotation.center[0] / 2 - radius;
    const centerY = annotation.center[1] / 2 - radius;

    const isActive = activeAnnotationIds.includes(annotation.id);

    const toggleActiveState = (e: any) => {
        e.stopPropagation();

        if ((isMac() && e.metaKey) || (!isMac() && e.ctrlKey)) {
            dispatch(setAnnotationAsActive({ id: annotation.id, active: !isActive }));
        } else {
            dispatch(setActiveAnnotations(
                isActive ? [] : [annotation.id],
            ));
        }
    };

    const debouncedAnnotationActivator = () => {
        if (isDragging) return;

        dispatch(setActiveAnnotations([annotation.id]));

        setIsDragging(true);
    };

    const dragStopped = (e: any, pos: any) => {
        e.stopPropagation();

        const newX = (pos.x + radius) * 2;
        const newY = (pos.y + radius) * 2;

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
            onMouseDown={toggleActiveState}
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
                        top: 0,
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                        border: `3px solid ${CellTypeColours[annotation.cell_type]}`,
                        borderRadius: '50%',
                        color: CellTypeColours[annotation.cell_type],
                        backgroundColor: isActive ? '#00FF0044' : 'transparent',
                    }}
                >
                    {annotation.cell_type}
                </div>
            </Draggable>
        </div>
    );
};
