import Annotation from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import {
    addAnnotation,
    ManualAnnotatorMode,
    ManualAnnotatorModeParams,
    setActiveAnnotations,
    useActiveAnnotationIds,
    useAnnotations,
    useManualAnnotatorModeWithParams,
} from '@frontend/slices/annotationSlice';
import { useAnnotatorScale } from '@frontend/slices/annotatorScaleSlice';
import { findAnnotationWithCoords } from '@frontend/utils/annotationUtils';
import { getFileName } from '@frontend/utils/fileNameUtils';
import { UUID } from 'crypto';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { DraggableAnnotation } from './DraggableAnnotation';

const clickHandler = (
    e: any,
    imageAnnotations: Annotation[],
    activeAnnotationIds: UUID[],
    dispatch: any,
    mode: ManualAnnotatorMode,
    modeParams: ManualAnnotatorModeParams,
    shownImageUrl: string,
    scale: number,
) => {
    const x = e.nativeEvent.offsetX / scale;
    const y = e.nativeEvent.offsetY / scale;
    const annotationId = findAnnotationWithCoords(imageAnnotations, x, y);

    const createAnnotation = (cellType: CellType) => {
        const newAnnotation = new Annotation({
            center: [2 * x, 2 * y],
            radius: 80,
            cell_type: cellType,
            poses: [0, 0],
            source_name: getFileName(shownImageUrl),
            timestamp: 0,
        });

        dispatch(addAnnotation(Annotation.toPlainObject(newAnnotation)));
        dispatch(setActiveAnnotations([newAnnotation.id]));
    };

    switch (mode) {
    case ManualAnnotatorMode.Default:
        // if the click is not within an annotation, check if there is an active annotation.
        //! if there is, the DraggableAnnotation will handle the click
        if (!annotationId) {
            if (activeAnnotationIds.length > 0) {
                dispatch(setActiveAnnotations([]));
                return;
            }

            createAnnotation(modeParams.cellType || CellType.NOT_CLASSIFIED);
        }
        break;
    case ManualAnnotatorMode.Add:
        // create a new annotation, regardless of whether there is an annotation at the click location
        createAnnotation(modeParams.cellType || CellType.NOT_CLASSIFIED);
        break;
    default:
        break;
    }

    e.preventDefault();
};

export const AnnotatedImage = (props: { shownImageUrl: string }) => {
    const { shownImageUrl } = props;

    const [defaultWidth, defaultHeight] = [1920, 1080];

    const scale = useAnnotatorScale();

    const actualScale = scale / 2;

    const [topOffset, setTopOffset] = useState<number>(window.innerHeight / 2 - (defaultHeight * actualScale) / 2);
    const [leftOffset, setLeftOffset] = useState<number>(window.innerWidth / 2 - (defaultWidth * actualScale) / 2);

    console.log('AnnotatedImage', shownImageUrl, actualScale, topOffset, leftOffset);

    const { mode, modeParams } = useManualAnnotatorModeWithParams();

    const allAnnotations = useAnnotations();
    const activeAnnotationIds = useActiveAnnotationIds();

    const dispatch = useDispatch();

    useEffect(() => {
        function handleScaleSizeChange() {
            const xOffset = window.innerWidth / 2 - (defaultWidth * actualScale) / 2;
            const yOffset = window.innerHeight / 2 - (defaultHeight * actualScale) / 2;

            setLeftOffset(xOffset < 0 ? 0 : xOffset);
            setTopOffset(yOffset < 0 ? 0 : yOffset);
        }

        window.onresize = handleScaleSizeChange;

        handleScaleSizeChange();
    }, [actualScale]);

    if (!shownImageUrl) {
        return <div />;
    }

    const imageAnnotations = allAnnotations.filter(annotation => annotation.source_name === getFileName(shownImageUrl));

    return (
        <span style={{ height: defaultHeight * actualScale, marginTop: '60px' }}>
            <img
                src={shownImageUrl}
                alt='Annotated image'
                style={{ width: defaultWidth * actualScale, height: defaultHeight * actualScale }}
                onClick={(e) => {
                    clickHandler(
                        e,
                        imageAnnotations,
                        activeAnnotationIds,
                        dispatch,
                        mode,
                        modeParams,
                        shownImageUrl,
                        scale,
                    );
                }}
            />
            {imageAnnotations.map(annotation => (
                <DraggableAnnotation
                    key={annotation.id}
                    annotation={annotation}
                    topOffset={topOffset}
                    leftOffset={leftOffset}
                    activeAnnotationIds={activeAnnotationIds}
                />
            ))}
        </span>
    );
};
