import { useTheme } from '@frontend/slices/themeSlice';
import { useZoom } from '@frontend/slices/zoomSlice';
import { isMac } from '@frontend/utils/platform';
import { Theme } from '@utils/colours';
import React from 'react';

import { HeaderButtons } from './HeaderButtons';
import { HeaderLeft } from './HeaderLeft';
import { HeaderTooltip } from './HeaderTooltip';

export default function Header(props: { page: PageType, setPage: (page: PageType) => void }) {
    const theme: Theme = useTheme();

    const zoom = useZoom();

    console.log(Math.ceil(120 - (zoom * 23)));

    return (
        <div id="header"
            // eslint-disable-next-line no-useless-concat
            className={'noselect'}
            style={{
                background: theme.secondaryBackground,
                borderBottom: theme.secondaryBackground === theme.primaryBackground
                    ? `1px solid ${theme.primaryBorder}` : 'none',
                color: theme.secondaryForeground,
                padding: isMac()
                    ? '0px 0px 0px 60px'
                    : `0 ${Math.ceil(120 - (zoom * 23))}px 0 0`,
            }}
        >
            <HeaderLeft page={props.page} setPage={props.setPage} />
            <HeaderTooltip page={props.page} setPage={props.setPage} />
            <HeaderButtons page={props.page} setPage={props.setPage} />
        </div>
    );
}
