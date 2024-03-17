import { useIsBackendOnline } from '@frontend/slices/backendStatusSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { checkIsBackendOnline, getMemoryUsage, initiateIsBackendOnlineCheck } from '@frontend/utils/miscUtils';
import { Theme } from '@utils/colours';
import React, { useEffect, useState } from 'react';

export default function Footer() {
    const theme: Theme = useTheme();

    const SCANNING_BEE_VERSION = process.env.SCANNING_BEE_VERSION || 'development';

    const [memoryUsage, setMemoryUsage] = useState(getMemoryUsage());
    const isBackendOnline = useIsBackendOnline();

    const footerBackground = theme.type === 'dark' ? theme.secondaryBackground : theme.tertiaryBackground;

    useEffect(() => {
        checkIsBackendOnline();

        initiateIsBackendOnlineCheck();

        const interval = setInterval(async () => {
            setMemoryUsage(getMemoryUsage());
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
                    margin: '0 5px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    Memory Usage: {memoryUsage} MB
                </p>
            </div>

            <div className='footer-right' style={{ marginRight: '10px' }}>
                <p style={{ margin: 0, fontSize: '12px' }}>
                        Scanning Bee {SCANNING_BEE_VERSION}
                </p>
            </div>
        </div>
    );
}
