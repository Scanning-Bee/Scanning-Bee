import { Button, Icon } from '@blueprintjs/core';
import BackendInterface from '@frontend/controllers/backendInterface/backendInterface';
import {
    createNewAnnotation,
    setActiveAnnotations,
    useActiveAnnotationIds,
    useAnnotations,
    useShownImageUrl,
} from '@frontend/slices/annotationSlice';
import { useBackendStatus } from '@frontend/slices/backendStatusSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { CellTypeColours } from '@frontend/utils/colours';
import { getFileName } from '@frontend/utils/fileNameUtils';
import { HexagonBase } from '@frontend/views/base/HexagonBase';
import React from 'react';
import { useDispatch } from 'react-redux';

export const AnnotationsList = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    const backendStatus = useBackendStatus();

    const annotations = useAnnotations();
    const shownImageUrl = useShownImageUrl();

    const activeAnnotationIds = useActiveAnnotationIds();
    const shownImageAnnotations = annotations.filter(annotation => annotation.source_name === getFileName(shownImageUrl));

    return (
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
                                    at x:{annotation.center[0].toFixed(2)}, y:{annotation.center[1].toFixed(2)}
                                    </p>
                                </span>
                                }
                                minimal
                                icon={<div style={{ margin: '0 5px 0 0' }}>
                                    <HexagonBase
                                        color={CellTypeColours[annotation.cell_type]}
                                        height={16}
                                        width={16}
                                    />
                                </div>}
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
                    BackendInterface.generateAnnotationsByAI(getFileName(shownImageUrl));
                }}
                intent='success'
                icon='send-to-graph'
                style={{ margin: '5px', backgroundColor: 'darkgreen' }}
                className='inline-box-important'
                disabled={backendStatus !== 'online'}
            />
        </div>
    );
};
