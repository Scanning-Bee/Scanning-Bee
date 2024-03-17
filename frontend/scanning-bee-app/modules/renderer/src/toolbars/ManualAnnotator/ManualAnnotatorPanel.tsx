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
            <AnnotationsList />
            <ImagesList />
        </SplitPane>
    );
};
