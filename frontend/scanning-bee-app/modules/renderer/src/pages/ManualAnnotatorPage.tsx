import { Button, Icon } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import CellType from '@frontend/models/cellType';
import {
    useActiveAnnotations,
    useAnnotations,
    useAnnotationsFolder,
    useImages,
} from '@frontend/slices/annotationSlice';
import { AnnotatedImage } from '@frontend/toolbars/ManualAnnotator/AnnotatedImage';
import { AnnotationEditorTools } from '@frontend/toolbars/ManualAnnotator/AnnotationEditorTools';
import { ManualAnnotatorPanel } from '@frontend/toolbars/ManualAnnotator/ManualAnnotatorPanel';
import { lightTheme } from '@frontend/utils/colours';
import { getFileName } from '@frontend/utils/fileNameUtils';
import React, { useEffect, useState } from 'react';

export const ManualAnnotatorPage = () => {
    const [shownImageUrl, setShownImageUrl] = useState<string | undefined>(undefined);
    const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(true);

    const folder = useAnnotationsFolder();
    const activeAnnotations = useActiveAnnotations();
    const annotations = useAnnotations();
    const images = useImages();

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

        panelElement.style.width = leftPanelOpen ? '250px' : '0px';
    }, [leftPanelOpen]);

    if (!folder || !shownImageUrl) {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
                text='Open a folder'
                minimal
                large
                onClick={() => {
                    BackendInterface.getInstance().openFolderDialog();
                }}
                intent='success'
                icon='folder-new'
                style={{ padding: '5px', margin: '2px' }}
            />
            <p style={{ fontWeight: 'normal', fontSize: '16px' }} className='nomargin'>to start annotating or see your annotations.</p>
        </div>;
    }

    return (
        <div className='page'>
            <div id="left-panel" className='panel'>
                <Button
                    icon={<Icon icon={leftPanelOpen ? 'arrow-left' : 'arrow-right'} style={{ color: lightTheme.primaryForeground }} />}
                    className={`panel-button button-animation ${leftPanelOpen ? 'open-margin-left' : 'closed-margin-left'}`}
                    onClick={
                        (e) => {
                            // ? this section prevents button spamming with spacebar.
                            e.preventDefault();

                            setLeftPanelOpen(!leftPanelOpen);
                        }
                    }
                    style={{ background: lightTheme.secondaryBackground }}
                />

                <ManualAnnotatorPanel
                    images={images}
                    annotations={annotations}
                    folder={folder}
                    leftPanelOpen={leftPanelOpen}
                    setShownImageUrl={setShownImageUrl}
                    shownImageUrl={shownImageUrl}
                />
            </div>

            <div className='column-flex-center' style={{ width: '100vw' }}>
                <AnnotatedImage
                    shownImageUrl={images.find(image => image === shownImageUrl)}
                />
                <AnnotationEditorTools
                    annotations={activeAnnotations}
                    newAnnotationProps={{
                        center: [480, 270],
                        radius: 86,
                        cell_type: CellType.NOT_CLASSIFIED,
                        poses: [],
                        source_name: getFileName(shownImageUrl),
                        timestamp: 0,
                    }}
                />
            </div>
        </div>
    );
};
