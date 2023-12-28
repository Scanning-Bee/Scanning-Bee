import { Button, Divider, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import Annotation from '@frontend/models/annotation';
import { setActiveAnnotations } from '@frontend/slices/annotationSlice';
import { lightTheme } from '@frontend/utils/colours';
import { getFileName } from '@frontend/utils/fileNameUtils';
import React from 'react';
import { useDispatch } from 'react-redux';
import SplitPane from 'react-split-pane';

const SaveToDatabaseButton = (props: { annotations: Annotation[], shownImageUrl: string }) => (
    <Popover
        interactionKind='click'
        position='right'
        lazy
        canEscapeKeyClose
    >
        <Button
            text='Save annotations to database'
            intent='primary'
            icon='database'
            style={{ margin: '5px' }}
            className='inline-box-important'
        />
        <Menu>
            <MenuItem
                text={`Save annotations for ${getFileName(props.shownImageUrl)}`}
                onClick={() => {
                    const filteredAnnotations = props.annotations
                        .filter(annotation => annotation.source_name === getFileName(props.shownImageUrl));

                    BackendInterface.getInstance().saveAnnotationsToDatabase(filteredAnnotations);
                }}
                icon='media'
            />
            <MenuItem
                text='Save all annotations'
                onClick={() => {
                    BackendInterface.getInstance().saveAnnotationsToDatabase(props.annotations);
                }}
                icon='tick'
            />
        </Menu>
    </Popover>
);

export const ManualAnnotatorPanel = (props:{
    images: string[],
    annotations: Annotation[],
    shownImageUrl: string,
    setShownImageUrl: (url: string) => void,
    leftPanelOpen: boolean,
    folder: string,
}) => {
    const {
        annotations,
        images,
        shownImageUrl,
        setShownImageUrl,
        leftPanelOpen,
        folder,
    } = props;

    const dispatch = useDispatch();

    const annotatedImageNames = annotations.map(annotation => annotation.source_name);

    const sortedImages = [...images].sort((a, b) => {
        const imageNumberA = parseInt(a.split('.')[0].split('_')[1], 10);
        const imageNumberB = parseInt(b.split('.')[0].split('_')[1], 10);

        return imageNumberA - imageNumberB;
    });

    return (
        // @ts-ignore
        <SplitPane
            split="horizontal"
            minSize={200}
            defaultSize={'250px'}
            maxSize={400}
            style={{
                backgroundColor: lightTheme.secondaryBackground,
                opacity: leftPanelOpen ? 1 : 0,
                width: !leftPanelOpen && '0px',
                transition: 'opacity 0.1s',
            }}
            resizerStyle={{ backgroundColor: lightTheme.secondaryBackground, height: '1px' }}
            allowResize={leftPanelOpen}
            pane1Style={{ display: 'unset', width: '245px' }}
            resizerClassName='resizer'
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                <h2>Annotations</h2>
                <Divider style={{ width: '240px' }}/>
                <Button
                    text='Open a folder'
                    onClick={() => {
                        BackendInterface.getInstance().openFolderDialog();
                    }}
                    intent='primary'
                    icon='folder-new'
                    style={{ margin: '5px' }}
                    className='inline-box-important'
                />
                <Button
                    text='Save annotations locally'
                    onClick={() => {
                        BackendInterface.getInstance().saveAnnotations(annotations, folder);
                    }}
                    intent='primary'
                    icon='floppy-disk'
                    style={{ margin: '5px' }}
                    className='inline-box-important'
                />
                <SaveToDatabaseButton annotations={annotations} shownImageUrl={shownImageUrl} />
                <Button
                    text='Generate annotations with AI'
                    onClick={() => {
                        BackendInterface.getInstance().generateAnnotationsByAI(getFileName(shownImageUrl));
                    }}
                    intent='success'
                    icon='send-to-graph'
                    style={{ margin: '5px', backgroundColor: 'darkgreen' }}
                    className='inline-box-important'
                />
            </div>
            <div className='annotated-images-panel'>
                <h2 style={{ margin: '0 35px 10px ' }}>Images</h2>
                <Divider style={{ width: '240px' }}/>
                {sortedImages.map(image => (
                    <Button
                        key={image}
                        text={getFileName(image)}
                        minimal={image !== shownImageUrl}
                        onClick={() => {
                            setShownImageUrl(image);
                            dispatch(setActiveAnnotations([]));
                        }}
                        style={{ minWidth: 'fit-content', margin: '0 25px' }}
                        intent={image === shownImageUrl ? 'primary' : 'none'}
                        icon={annotatedImageNames.includes(getFileName(image)) ? 'annotation' : 'blank'}
                        rightIcon={image === shownImageUrl ? 'eye-open' : 'blank'}
                    />
                ))}
            </div>
        </SplitPane>
    );
};
