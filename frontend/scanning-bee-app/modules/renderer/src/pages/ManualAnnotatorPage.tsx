import { Button, ButtonGroup, Icon } from '@blueprintjs/core';
import {
    showImageWithURL,
    useActiveAnnotations,
    useAnnotationsFolder,
    useImages,
    useShownImageUrl,
} from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { setViewScale } from '@frontend/slices/viewScaleSlice';
import { ZoomSlider } from '@frontend/toolbars/common/ZoomSlider';
import { AnnotatedImage } from '@frontend/toolbars/ManualAnnotator/AnnotatedImage';
import { AnnotationEditorTools } from '@frontend/toolbars/ManualAnnotator/AnnotationEditorTools';
import { ManualAnnotatorPanel } from '@frontend/toolbars/ManualAnnotator/ManualAnnotatorPanel';
import { ModeButton } from '@frontend/toolbars/ManualAnnotator/ModeButton';
import { getFileName } from '@frontend/utils/fileNameUtils';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PickFolderPage } from './PickFolderPage';

export const ManualAnnotatorPage = () => {
    const theme = useTheme();

    const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(true);
    const [gridOpen, setGridOpen] = useState<boolean>(true);

    const folder = useAnnotationsFolder();
    const shownImageUrl = useShownImageUrl();
    const activeAnnotations = useActiveAnnotations();
    const images = useImages();

    const dispatch = useDispatch();

    const setShownImageUrl = (url: string) => {
        dispatch(showImageWithURL(url));
    };

    useEffect(() => {
        // if no image is shown or the image shown is not in the folder, set the shown image to the first image in the folder
        if (images.length > 0 && (!shownImageUrl || !images.includes(shownImageUrl))) {
            setShownImageUrl(images[0]);
        }
    }, [images, folder, shownImageUrl]);

    useEffect(() => {
        const panelElement = document.getElementById('left-panel');

        if (!panelElement) {
            return;
        }

        panelElement.style.width = leftPanelOpen ? '270px' : '0px';
    }, [leftPanelOpen]);

    if (!folder || !shownImageUrl) {
        return <PickFolderPage />;
    }

    const shownImageIndex = images.indexOf(shownImageUrl);

    return (
        <div style={{
            color: theme.primaryForeground,
            display: 'flex',
        }} className={`page ${gridOpen && 'grid'}`}>
            <div id="left-panel" className='panel'>
                <Button
                    icon={<Icon icon={'menu'} style={{ color: theme.primaryForeground }} />}
                    className='panel-button button-animation closed-margin-left'
                    onClick={
                        (e) => {
                            // ? this section prevents button spamming with spacebar.
                            e.preventDefault();

                            setLeftPanelOpen(!leftPanelOpen);
                        }
                    }
                    style={{ background: theme.secondaryBackground }}
                    minimal
                />

                <ManualAnnotatorPanel
                    leftPanelOpen={leftPanelOpen}
                />
            </div>

            <div className='column-flex-center' style={{ width: '100%' }}>
                <AnnotatedImage
                    shownImageUrl={images.find(image => image === shownImageUrl)}
                />

                <ButtonGroup className='image-navigator-buttons shadowed' style={{ backgroundColor: `${theme.secondaryBackground}88` }}>
                    <Button
                        icon={<Icon icon="chevron-left" style={{ color: theme.primaryForeground }} />}
                        disabled={shownImageIndex === 0}
                        onClick={() => {
                            const index = shownImageIndex;
                            setShownImageUrl(images[index - 1]);
                        }}
                        style={{ background: theme.secondaryBackground, margin: '10px' }}
                        minimal
                        small
                    />
                    <p
                        style={{ color: theme.primaryForeground }}
                        className='ellipsis-overflow image-navigator-image-name'
                    >{getFileName(shownImageUrl)}</p>
                    <Button
                        icon={<Icon icon="chevron-right" style={{ color: theme.primaryForeground }} />}
                        disabled={shownImageIndex === images.length - 1}
                        onClick={() => {
                            const index = shownImageIndex;
                            setShownImageUrl(images[index + 1]);
                        }}
                        style={{ background: theme.secondaryBackground, margin: '10px' }}
                        minimal
                        small
                    />
                </ButtonGroup>
                <AnnotationEditorTools
                    activeAnnotations={activeAnnotations}
                    toggleGrid={() => {
                        setGridOpen(!gridOpen);
                    }}
                />
                <ZoomSlider handleZoomChange={(zoom: number) => {
                    dispatch(setViewScale(zoom));
                }} />
                <ModeButton />
            </div>
        </div>
    );
};
