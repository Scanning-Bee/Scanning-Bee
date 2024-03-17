import { Button, Icon } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import Annotation from '@frontend/models/annotation';
import { createNewAnnotation, setActiveAnnotations, useActiveAnnotationIds } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { CellTypeColours } from '@frontend/utils/colours';
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
    const activeAnnotationIds = useActiveAnnotationIds();
    const shownImageAnnotations = annotations.filter(annotation => annotation.source_name === getFileName(shownImageUrl));

    const panelBackground = theme.type === 'dark' ? theme.tertiaryBackground : theme.secondaryBackground;

    return (
        // @ts-ignore
        <SplitPane
            split="horizontal"
            minSize={200}
            defaultSize={'270px'}
            maxSize={400}
            style={{
                backgroundColor: panelBackground,
                opacity: leftPanelOpen ? 1 : 0,
                width: !leftPanelOpen && '0px',
                transition: 'opacity 0.1s',
            }}
            resizerStyle={{ border: `1px solid ${theme.secondaryForeground}`, height: '1px' }}
            allowResize={false}
            pane1Style={{ display: 'unset', width: '245px' }}
            resizerClassName='resizer'
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', height: '250px', marginTop: '5px' }}>
                <div
                    className='annotations-panel'
                >
                    <h3 style={{ margin: '0 30px 10px ' }}>{
                        shownImageAnnotations.length > 0
                            ? 'Annotations'
                            : 'No annotations'
                    }
                    </h3>
                    {
                        shownImageAnnotations.length === 0
                            && <Button
                                text="Create new annotation"
                                onClick={() => {
                                    dispatch(createNewAnnotation());
                                }}
                                intent='success'
                                icon={<Icon
                                    icon='plus'
                                    style={{ margin: '0 5px 0 0' }}
                                />}
                                style={{ margin: '5px' }}
                                className='annotation-button-in-panel'
                                minimal
                                fill
                            />
                    }
                    {
                        shownImageAnnotations
                            .map(annotation => (
                                <Button
                                    key={annotation.id}
                                    text={<span>
                                        <p style={{ margin: 0, color: theme.primaryForeground }}>
                                            {annotation.cell_type}
                                        </p>
                                        <p style={{ margin: 0, color: theme.primaryForeground, fontWeight: '200', fontSize: 'smaller' }}>
                                            at x:{annotation.center[0]}, y:{annotation.center[1]}
                                        </p>
                                    </span>
                                    }
                                    minimal
                                    icon={<Icon
                                        icon='full-circle'
                                        color={CellTypeColours[annotation.cell_type]}
                                        style={{ margin: '0 5px 0 0' }}
                                    />}
                                    onClick={() => {
                                        dispatch(setActiveAnnotations([annotation.id]));
                                    }}
                                    intent='none'
                                    rightIcon={
                                        activeAnnotationIds.includes(annotation.id)
                                            && <Icon icon='tick' intent='success' />
                                    }
                                    className='annotation-button-in-panel'
                                    fill
                                />
                            ))
                    }
                </div>
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
                <h3 style={{ margin: '0 30px 10px ' }}>Images</h3>
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
        </SplitPane>
    );
};
