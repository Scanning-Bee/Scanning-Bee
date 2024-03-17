import { Button, Icon } from '@blueprintjs/core';
import { setActiveAnnotations, showImageWithURL, useAnnotations, useImages, useShownImageUrl } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { getFileName } from '@frontend/utils/fileNameUtils';
import React from 'react';
import { useDispatch } from 'react-redux';

export const ImagesList = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    const images = useImages();
    const shownImageUrl = useShownImageUrl();

    const annotations = useAnnotations();
    const annotatedImageNames = annotations.map(annotation => annotation.source_name);

    return (
        <div className='annotated-images-panel'>
            <h3 style={{ margin: '0 30px 10px ' }}>Images</h3>
            {images.map(image => (
                <Button
                    key={image}
                    id={`image-button-${image}`}
                    text={
                        <p
                            style={{ margin: 0, color: image === shownImageUrl ? 'white' : theme.secondaryForeground }}
                        >{getFileName(image)}</p>
                    }
                    minimal={image !== shownImageUrl}
                    onClick={() => {
                        dispatch(showImageWithURL(image));
                        dispatch(setActiveAnnotations([]));
                    }}
                    style={{ minWidth: 'fit-content' }}
                    intent={image === shownImageUrl ? 'primary' : 'none'}
                    icon={<Icon
                        icon={annotatedImageNames.includes(getFileName(image)) ? 'annotation' : 'blank'}
                        color={image === shownImageUrl ? 'white' : theme.tertiaryForeground}
                        style={{ margin: '0 5px 0 0' }}
                    />}
                    rightIcon={image === shownImageUrl ? 'eye-open' : 'blank'}
                    className='annotation-button-in-panel'
                    fill
                />
            ))}
        </div>
    );
};
