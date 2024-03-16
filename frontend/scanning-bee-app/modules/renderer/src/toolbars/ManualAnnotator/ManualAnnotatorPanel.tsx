import { Button, Icon } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import Annotation from '@frontend/models/annotation';
import { setActiveAnnotations } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { getFileName } from '@frontend/utils/fileNameUtils';
import React from 'react';
import { useDispatch } from 'react-redux';
import SplitPane from 'react-split-pane';

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
    } = props;

    const theme = useTheme();

    const dispatch = useDispatch();

    const annotatedImageNames = annotations.map(annotation => annotation.source_name);

    return (
        // @ts-ignore
        <SplitPane
            split="horizontal"
            minSize={200}
            defaultSize={'250px'}
            maxSize={400}
            style={{
                backgroundColor: theme.secondaryBackground,
                opacity: leftPanelOpen ? 1 : 0,
                width: !leftPanelOpen && '0px',
                transition: 'opacity 0.1s',
            }}
            resizerStyle={{ border: `1px solid ${theme.secondaryForeground}`, height: '1px' }}
            allowResize={leftPanelOpen}
            pane1Style={{ display: 'unset', width: '245px' }}
            resizerClassName='resizer'
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
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
                {images.map(image => (
                    <Button
                        key={image}
                        text={
                            <p
                                style={{ margin: 0, color: image === shownImageUrl ? 'white' : theme.secondaryForeground }}
                            >{getFileName(image)}</p>
                        }
                        minimal={image !== shownImageUrl}
                        onClick={() => {
                            setShownImageUrl(image);
                            dispatch(setActiveAnnotations([]));
                        }}
                        style={{ minWidth: 'fit-content', margin: '0 25px' }}
                        intent={image === shownImageUrl ? 'primary' : 'none'}
                        icon={<Icon
                            icon={annotatedImageNames.includes(getFileName(image)) ? 'annotation' : 'blank'}
                            color={image === shownImageUrl ? 'white' : theme.tertiaryForeground}
                        />}
                        rightIcon={image === shownImageUrl ? 'eye-open' : 'blank'}
                    />
                ))}
            </div>
        </SplitPane>
    );
};
