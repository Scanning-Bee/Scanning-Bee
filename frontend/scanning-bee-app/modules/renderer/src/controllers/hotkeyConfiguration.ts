import { HotkeyConfig } from '@blueprintjs/core';
import {
    getActiveAnnotationIds,
    getAnnotations,
    getAnnotationsFolder,
    getImages,
    getShownImageUrl,
    mutateAnnotation,
    removeAnnotation,
    showImageWithURL,
} from '@frontend/slices/annotationSlice';
import { isMac } from '@frontend/utils/platform';

import { BackendInterface } from './backendInterface/backendInterface';

export interface HotkeyConfigurationInterface {
    dispatch: (action: any) => void;
}

type ArrowDirections = 'up' | 'down' | 'left' | 'right';

const moveAnnotationInDirection = (ifc: HotkeyConfigurationInterface, direction: ArrowDirections) => {
    const MOVE_AMOUNT = 2;

    const allAnnotations = getAnnotations();
    const activeAnnotationIds = getActiveAnnotationIds();

    activeAnnotationIds.forEach((annotationId) => {
        const annotation = allAnnotations.find(a => a.id === annotationId);

        if (!annotation) {
            return;
        }

        const originalCenter = annotation?.center;

        const newCenter = [
            direction === 'up' || direction === 'down'
                ? originalCenter[0]
                : direction === 'left'
                    ? originalCenter[0] - MOVE_AMOUNT
                    : originalCenter[0] + MOVE_AMOUNT,
            direction === 'left' || direction === 'right'
                ? originalCenter[1]
                : direction === 'up'
                    ? originalCenter[1] - MOVE_AMOUNT
                    : originalCenter[1] + MOVE_AMOUNT,
        ];

        ifc.dispatch(
            mutateAnnotation({
                id: annotationId,
                mutations: {
                    center: newCenter,
                },
            }),
        );
    });
};

export const initializeHotkeyConfiguration = (ifc: HotkeyConfigurationInterface): HotkeyConfig[] => [
    {
        combo: 'mod + s',
        global: true,
        label: 'Save annotations locally',
        onKeyDown: () => {
            const annotations = getAnnotations();
            const targetFolder = getAnnotationsFolder();

            if (!annotations || !targetFolder) {
                return;
            }

            BackendInterface.getInstance().saveAnnotations(annotations, targetFolder);
        },
    },
    {
        combo: 'mod + shift + s',
        global: true,
        label: 'Save annotations to database',
        onKeyDown: () => {
            const annotations = getAnnotations();

            if (!annotations) {
                return;
            }

            BackendInterface.getInstance().saveAnnotationsToDatabase(annotations);
        },
    },
    {
        combo: 'up',
        global: true,
        label: 'Move active annotation up',
        onKeyDown: () => moveAnnotationInDirection(ifc, 'up'),
    },
    {
        combo: 'down',
        global: true,
        label: 'Move active annotation down',
        onKeyDown: () => moveAnnotationInDirection(ifc, 'down'),
    },
    {
        combo: 'left',
        global: true,
        label: 'Move active annotation left',
        onKeyDown: () => moveAnnotationInDirection(ifc, 'left'),
    },
    {
        combo: 'right',
        global: true,
        label: 'Move active annotation right',
        onKeyDown: () => moveAnnotationInDirection(ifc, 'right'),
    },
    {
        combo: 'shift + right',
        global: true,
        label: 'Next image',
        onKeyDown: () => {
            const shownImageUrl = getShownImageUrl();
            const allImages = getImages();

            if (!shownImageUrl || !allImages) {
                return;
            }

            const currentIndex = allImages.indexOf(shownImageUrl);

            if (currentIndex === allImages.length - 1) {
                return;
            }

            ifc.dispatch(showImageWithURL(allImages[currentIndex + 1]));
        },
    },
    {
        combo: 'shift + left',
        global: true,
        label: 'Previous image',
        onKeyDown: () => {
            const shownImageUrl = getShownImageUrl();
            const allImages = getImages();

            if (!shownImageUrl || !allImages) {
                return;
            }

            const currentIndex = allImages.indexOf(shownImageUrl);

            if (currentIndex === 0) {
                return;
            }

            ifc.dispatch(showImageWithURL(allImages[currentIndex - 1]));
        },
    },
    {
        combo: isMac() ? 'mod + backspace' : 'delete',
        global: true,
        label: 'Delete active annotations',
        onKeyDown: () => {
            const activeAnnotationIds = getActiveAnnotationIds();

            activeAnnotationIds.forEach((annotationId) => {
                ifc.dispatch(removeAnnotation(annotationId));
            });
        },
    },
];
