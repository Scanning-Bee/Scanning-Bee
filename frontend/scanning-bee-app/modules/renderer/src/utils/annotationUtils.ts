import { UUID } from 'crypto';
import { IconName } from '@blueprintjs/core';
import Annotation from '@frontend/models/annotation';
import { ManualAnnotatorMode } from '@frontend/slices/annotationSlice';

export const getIconForMode = (mode: ManualAnnotatorMode): IconName => {
    switch (mode) {
    case 'default':
        return 'edit';
    case 'brush':
        return 'highlight';
    case 'add':
        return 'add';
    case 'delete':
        return 'delete';
    default:
        return 'blank';
    }
};

export const findAnnotationWithCoords = (annotations: Annotation[], x: number, y: number): UUID | undefined => {
    let annotationId: UUID | undefined;

    annotations.forEach((annotation) => {
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

    return annotationId;
};
