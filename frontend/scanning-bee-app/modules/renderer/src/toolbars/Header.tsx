import { useTheme } from '@frontend/slices/themeSlice';
import { useZoom } from '@frontend/slices/zoomSlice';
import { isMac } from '@frontend/utils/platform';
import { Theme } from '@scanning_bee/ipc-interfaces';
import React from 'react';

import { HeaderButtons } from './HeaderButtons';
import { HeaderLeft } from './HeaderLeft';
import { HeaderTooltip } from './HeaderTooltip';

export default function Header(props: {
    page: PageType,
    setPage: (page: PageType) => void,
    goBack: () => void,
    goForward: () => void,
    getPreviousPage: () => PageType,
    getNextPage: () => PageType,
    fullScreen: boolean,
}) {
    const theme: Theme = useTheme();

    const zoom = useZoom();

    const headerBackground = theme.type === 'dark' ? theme.secondaryBackground : theme.tertiaryBackground;

    return (
        <div id="header"
            // eslint-disable-next-line no-useless-concat
            className={'noselect'}
            style={{
                background: headerBackground,
                borderBottom: headerBackground === theme.primaryBackground
                    ? `1px solid ${theme.primaryBorder}` : 'none',
                color: theme.secondaryForeground,
                padding: isMac()
                    ? `0 0 0 ${props.fullScreen ? '0' : Math.ceil(60 - (zoom * 10))}px`
                    : `0 ${Math.ceil(120 - (zoom * 23))}px 0 0`,
            }}
        >
            <div className='header-sub-flex-box' style={{ width: '30%' }}>
                <HeaderLeft />
            </div>
            <div className='header-sub-flex-box' style={{ width: '40%' }}>
                <HeaderTooltip
                    page={props.page}
                    setPage={props.setPage}
                    goBack={props.goBack}
                    goForward={props.goForward}
                    getPreviousPage={props.getPreviousPage}
                    getNextPage={props.getNextPage}
                />
            </div>
            <div className='header-sub-flex-box' style={{ width: '30%' }}>
                <HeaderButtons page={props.page} setPage={props.setPage} />
            </div>
        </div>
    );
}
