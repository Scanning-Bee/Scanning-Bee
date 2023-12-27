import Annotation from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import {
    addAnnotation,
    setActiveAnnotations,
    setAnnotationAsActive,
    useActiveAnnotationIds,
    useAnnotations,
} from '@frontend/slices/annotationSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import { getFileName } from '@frontend/utils/fileNameUtils';
import { isMac } from '@frontend/utils/platform';
import { UUID } from 'crypto';
import React from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';

export const AnnotatedImage = (props: { shownImageUrl: string }) => {
    const { shownImageUrl } = props;

    const [leftOffset, setLeftOffset] = React.useState<number>(window.innerWidth / 2 - 480);

    const allAnnotations = useAnnotations();
    const activeAnnotationIds = useActiveAnnotationIds();

    const dispatch = useDispatch();

    if (!shownImageUrl) {
        return <div />;
    }

    const imageAnnotations = allAnnotations.filter(annotation => annotation.source_name === getFileName(shownImageUrl));

    window.onresize = () => {
        const calculatedOffset = window.innerWidth / 2 - 480;

        setLeftOffset(calculatedOffset < 0 ? 0 : calculatedOffset);
    };

    return (
        <span>
            <img
                src={shownImageUrl}
                alt='Annotated image'
                style={{ width: '960px', height: '540px' }}
                onClick={(e) => {
                    const x = e.nativeEvent.offsetX;
                    const y = e.nativeEvent.offsetY;

                    let annotationId: UUID | undefined;

                    imageAnnotations.forEach((annotation) => {
                        const centerX = annotation.center[0] / 2;
                        const centerY = annotation.center[1] / 2;
                        const radius = annotation.radius / 2;

                        // if the click is within the annotation
                        if (
                            x >= centerX - radius
                            && x <= centerX + radius
                            && y >= centerY - radius
                            && y <= centerY + radius
                        ) {
                            annotationId = annotation.id;
                        }
                    });

                    // if the click is not within an annotation, check if there is an active annotation.
                    // if there is, deselect it. if there isn't, create a new annotation
                    if (!annotationId) {
                        if (activeAnnotationIds.length > 0) {
                            dispatch(setActiveAnnotations([]));
                            return;
                        }

                        const newAnnotation = new Annotation({
                            center: [2 * x, 2 * y],
                            radius: 80,
                            cell_type: CellType.NOT_CLASSIFIED,
                            poses: [0, 0],
                            source_name: getFileName(shownImageUrl),
                            timestamp: 0,
                        });

                        dispatch(addAnnotation(Annotation.toPlainObject(newAnnotation)));
                        dispatch(setActiveAnnotations([newAnnotation.id]));
                    }
                }}
            />
            {imageAnnotations.map((annotation) => {
                const centerX = annotation.center[0] / 2;
                const centerY = annotation.center[1] / 2;
                const radius = annotation.radius / 2;

                const isActive = activeAnnotationIds.includes(annotation.id);

                return (
                    // @ts-ignore
                    <Draggable
                        allowAnyClick
                        onMouseDown={(e) => {
                            e.stopPropagation();

                            if ((isMac() && e.metaKey) || (!isMac() && e.ctrlKey)) {
                                dispatch(setAnnotationAsActive({ id: annotation.id, active: !isActive }));
                            } else {
                                dispatch(setActiveAnnotations(
                                    isActive ? [] : [annotation.id],
                                ));
                            }
                        }}
                        onDrag={(e) => {
                            e.stopPropagation();

                            if ((isMac() && e.metaKey) || (!isMac() && e.ctrlKey)) {
                                dispatch(setAnnotationAsActive({ id: annotation.id, active: true }));
                            } else {
                                dispatch(setActiveAnnotations([annotation.id]));
                            }
                        }}
                    >
                        <div
                            key={annotation.id}
                            className='flex-center noselect'
                            style={{
                                position: 'absolute',
                                left: `${leftOffset + centerX - radius}px`,
                                top: `${centerY - radius}px`,
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
                );
            })}
        </span>
    );
};
