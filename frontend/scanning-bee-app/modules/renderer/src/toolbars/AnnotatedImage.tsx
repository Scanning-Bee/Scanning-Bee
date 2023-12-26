import Annotation from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import { addAnnotation, setActiveAnnotation, useAnnotations } from '@frontend/slices/annotationSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import { getFileName } from '@frontend/utils/fileNameUtils';
import { UUID } from 'crypto';
import React from 'react';
import { useDispatch } from 'react-redux';

export const AnnotatedImage = (props: { shownImageUrl: string }) => {
    const { shownImageUrl } = props;

    const [leftOffset, setLeftOffset] = React.useState<number>(window.innerWidth / 2 - 480);

    const allAnnotations = useAnnotations();
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

                    if (!annotationId) {
                        const newAnnotation = new Annotation({
                            center: [2 * x, 2 * y],
                            radius: 80,
                            cell_type: CellType.NOT_CLASSIFIED,
                            poses: [0, 0],
                            source_name: getFileName(shownImageUrl),
                            timestamp: 0,
                        });

                        dispatch(addAnnotation(Annotation.toPlainObject(newAnnotation)));
                        dispatch(setActiveAnnotation(newAnnotation.id));
                    }
                }}
            />
            {imageAnnotations.map((annotation) => {
                const centerX = annotation.center[0] / 2;
                const centerY = annotation.center[1] / 2;
                const radius = annotation.radius / 2;

                return (
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
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setActiveAnnotation(annotation.id));
                        }}
                    >
                        {annotation.cell_type}
                    </div>
                );
            })}
        </span>
    );
};
