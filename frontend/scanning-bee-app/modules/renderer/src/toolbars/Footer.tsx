import { useIsBackendOnline } from '@frontend/slices/backendStatusSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { checkIsBackendOnline, getMemoryUsage, initiateIsBackendOnlineCheck } from '@frontend/utils/miscUtils';
import { Theme } from '@utils/colours';
import React, { useEffect, useState } from 'react';

import { FooterRight } from './FooterRight';

export default function Footer() {
    const theme: Theme = useTheme();

    const [memoryUsage, setMemoryUsage] = useState(-1);
    const isBackendOnline = useIsBackendOnline();

    const footerBackground = theme.type === 'dark' ? theme.secondaryBackground : theme.tertiaryBackground;

    useEffect(() => {
        checkIsBackendOnline();

        getMemoryUsage()
            .then(usage => setMemoryUsage(usage));

        initiateIsBackendOnlineCheck();

        const interval = setInterval(async () => {
            getMemoryUsage()
                .then(usage => setMemoryUsage(usage));
        }, 30_000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div id="footer"
            // eslint-disable-next-line no-useless-concat
            className={'noselect'}
            style={{
                background: footerBackground,
                borderBottom: footerBackground === theme.primaryBackground
                    ? `1px solid ${theme.primaryBorder}` : 'none',
                color: theme.secondaryForeground,
            }}
        >
            <div className='footer-left'>
                <p style={{
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isBackendOnline ? '#116622' : '#771111',
                    color: 'white',
                    fontSize: '12px',
                    padding: '0 10px',
                    height: 'var(--footerSpace)',
                }}>
                    Backend: {isBackendOnline ? 'Online' : 'Offline'}
                </p>
                <p style={{
                    margin: '0 10px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    Memory Usage: {memoryUsage} MB
                </p>
            </div>
            <FooterRight />
        </div>
    );
}
