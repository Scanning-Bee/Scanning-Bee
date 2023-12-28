import Annotation from '@frontend/models/annotation';
import { mutateAnnotation, setActiveAnnotations, setAnnotationAsActive } from '@frontend/slices/annotationSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import { isMac } from '@frontend/utils/platform';
import { UUID } from 'crypto';
import React from 'react';
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

    const radius = annotation.radius / 2;
    const centerX = annotation.center[0] / 2 - radius;
    const centerY = annotation.center[1] / 2 - radius;

    const isActive = activeAnnotationIds.includes(annotation.id);

    return (
        <div
            key={key}
            onMouseDown={(e) => {
                e.stopPropagation();
                console.log('mane');
                if ((isMac() && e.metaKey) || (!isMac() && e.ctrlKey)) {
                    dispatch(setAnnotationAsActive({ id: annotation.id, active: !isActive }));
                } else {
                    dispatch(setActiveAnnotations(
                        isActive ? [] : [annotation.id],
                    ));
                }
            }}
        >
            { /* @ts-ignore */ }
            <Draggable
                position={{ x: centerX, y: centerY }}
                onStart={() => {
                    setTimeout(() => {
                        dispatch(setActiveAnnotations([annotation.id]));
                    }, 20);
                }}
                onStop={(e, pos) => {
                    e.stopPropagation();

                    const newX = (pos.x);
                    const newY = (pos.y);

                    const mutation = {
                        id: annotation.id,
                        mutations: { center: [newX * 2 + radius * 2, newY * 2 + radius * 2] },
                    };

                    dispatch(mutateAnnotation(mutation));
                }}
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
