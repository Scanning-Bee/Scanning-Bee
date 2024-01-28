import { useTheme } from '@frontend/slices/themeSlice';
import { isMac } from '@frontend/utils/platform';
import { Theme } from '@utils/colours';
import React from 'react';

import { HeaderButtons } from './HeaderButtons';
import { HeaderLeft } from './HeaderLeft';
import { HeaderTooltip } from './HeaderTooltip';

export default function Header(props: { page: PageType, setPage: (page: PageType) => void }) {
    const theme: Theme = useTheme();

    return (
        <div id="header"
            // eslint-disable-next-line no-useless-concat
            className={'noselect'}
            style={{
                background: theme.secondaryBackground,
                borderBottom: theme.secondaryBackground === theme.primaryBackground
                    ? `1px solid ${theme.primaryBorder}` : 'none',
                color: theme.secondaryForeground,
                padding: isMac() ? '0px 0px 0px 60px' : '0px 60px 0px 0px',
            }}
        >
            <HeaderLeft page={props.page} setPage={props.setPage} />
            <HeaderTooltip page={props.page} setPage={props.setPage} />
            <HeaderButtons page={props.page} setPage={props.setPage} />
        </div>
    );
}
