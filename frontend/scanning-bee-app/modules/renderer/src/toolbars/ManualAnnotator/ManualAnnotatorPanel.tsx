import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';
import SplitPane from 'react-split-pane';

import { AnnotationsList } from './AnnotationsList';
import { ImagesList } from './ImagesList';

export const ManualAnnotatorPanel = (props:{
    leftPanelOpen: boolean,
}) => {
    const {
        leftPanelOpen,
    } = props;

    const theme = useTheme();

    return (
        // @ts-ignore
        <SplitPane
            className='manual-annotator-panel shadowed'
            split="horizontal"
            minSize={200}
            defaultSize={'270px'}
            maxSize={400}
            style={{
                backgroundColor: `${theme.primaryBackground}AA`,
                opacity: leftPanelOpen ? 1 : 0,
                width: !leftPanelOpen && '0px',
                transition: 'opacity 0.1s',
            }}
            resizerStyle={{ border: `1px solid ${theme.secondaryForeground}`, height: '1px' }}
            allowResize={false}
            pane1Style={{ display: 'unset', width: '245px' }}
            resizerClassName='resizer'
        >
            <AnnotationsList />
            <ImagesList />
        </SplitPane>
    );
};
