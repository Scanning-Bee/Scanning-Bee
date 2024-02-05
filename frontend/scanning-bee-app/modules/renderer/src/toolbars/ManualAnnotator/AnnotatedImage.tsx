import Annotation from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import {
    addAnnotation,
    setActiveAnnotations,
    useActiveAnnotationIds,
    useAnnotations,
} from '@frontend/slices/annotationSlice';
import { getFileName } from '@frontend/utils/fileNameUtils';
import { UUID } from 'crypto';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { DraggableAnnotation } from './DraggableAnnotation';

export const AnnotatedImage = (props: { shownImageUrl: string, mode: string, brushCellType: CellType }) => {
    const { shownImageUrl, mode, brushCellType } = props;

    const [topOffset, setTopOffset] = useState<number>(window.innerHeight / 2 - 270);
    const [leftOffset, setLeftOffset] = useState<number>(window.innerWidth / 2 - 480);

    const allAnnotations = useAnnotations();
    const activeAnnotationIds = useActiveAnnotationIds();

    const dispatch = useDispatch();

    if (!shownImageUrl) {
        return <div />;
    }

    const imageAnnotations = allAnnotations.filter(annotation => annotation.source_name === getFileName(shownImageUrl));

    window.onresize = () => {
        const xOffset = window.innerHeight / 2 - 270;
        const yOffset = window.innerWidth / 2 - 480;

        setTopOffset(xOffset < 0 ? 0 : xOffset);
        setLeftOffset(yOffset < 0 ? 0 : yOffset);
    };

    return (
        <span style={{ height: '540px' }}>
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
            {imageAnnotations.map(annotation => (
                <DraggableAnnotation
                    key={annotation.id}
                    annotation={annotation}
                    topOffset={topOffset}
                    leftOffset={leftOffset}
                    activeAnnotationIds={activeAnnotationIds}
                    mode={mode}
                    brushCellType={brushCellType}
                />
            ))}
        </span>
    );
};
