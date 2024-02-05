import { Button, Icon } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import CellType from '@frontend/models/cellType';
import {
    useActiveAnnotations,
    useAnnotations,
    useAnnotationsFolder,
    useImages,
} from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { AnnotatedImage } from '@frontend/toolbars/ManualAnnotator/AnnotatedImage';
import { AnnotationEditorTools } from '@frontend/toolbars/ManualAnnotator/AnnotationEditorTools';
import { ManualAnnotatorPanel } from '@frontend/toolbars/ManualAnnotator/ManualAnnotatorPanel';
import { getFileName } from '@frontend/utils/fileNameUtils';
import React, { useEffect, useState } from 'react';

type AnnotationMode = 'default' | 'brush';

export const ManualAnnotatorPage = () => {
    const theme = useTheme();

    const [shownImageUrl, setShownImageUrl] = useState<string | undefined>(undefined);
    const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(true);
    const [gridOpen, setGridOpen] = useState<boolean>(true);
    const [mode, setMode] = useState<AnnotationMode>('default');
    const [brushCellType, setBrushCellType] = useState<CellType>(CellType.NOT_CLASSIFIED);

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
        return <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.primaryBackground,
            color: theme.primaryForeground,
            justifyContent: 'center',
        }} className='page'>
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
        <div style={{
            color: theme.primaryForeground,
            display: 'flex',
        }} className={`page ${gridOpen && 'grid'}`}>
            <div id="left-panel" className='panel'>
                <Button
                    icon={<Icon icon={leftPanelOpen ? 'arrow-left' : 'arrow-right'} style={{ color: theme.primaryForeground }} />}
                    className={`panel-button button-animation ${leftPanelOpen ? 'open-margin-left' : 'closed-margin-left'}`}
                    onClick={
                        (e) => {
                            // ? this section prevents button spamming with spacebar.
                            e.preventDefault();

                            setLeftPanelOpen(!leftPanelOpen);
                        }
                    }
                    style={{ background: theme.secondaryBackground }}
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

            <div className='column-flex-center' style={{ width: '100%', height: '100%' }}>
                <AnnotatedImage
                    shownImageUrl={images.find(image => image === shownImageUrl)}
                    mode={mode}
                    brushCellType={brushCellType}
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
                    toggleGrid={() => {
                        setGridOpen(!gridOpen);
                    }}
                    mode={mode}
                    setBrushMode={(set: boolean = false) => setMode(
                        mode === 'default' || set
                            ? 'brush'
                            : 'default',
                    )}
                    brushCellType={brushCellType}
                    setBrushCellType={setBrushCellType}
                />
            </div>
        </div>
    );
};
