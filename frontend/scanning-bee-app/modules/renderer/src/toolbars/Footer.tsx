import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { useBackendStatus } from '@frontend/slices/backendStatusSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { capitalizeFirstLetter, checkIsBackendOnline, getMemoryUsage, initiateIsBackendOnlineCheck } from '@frontend/utils/miscUtils';
import { Theme } from '@scanning_bee/ipc-interfaces';
import React, { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';

import { FooterRight } from './FooterRight';

export default function Footer() {
    const theme: Theme = useTheme();

    const [memoryUsage, setMemoryUsage] = useState(-1);
    const backendStatus = useBackendStatus();

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
                <p
                    className={`backend-status-indicator ${backendStatus}`}
                    onClick={() => {
                        if (backendStatus === 'offline') BackendInterface.getInstance().invokeBackend();
                    }}
                >
                    Backend: {capitalizeFirstLetter(backendStatus)}
                    {backendStatus === 'connecting' && <Loader
                        height={10}
                        width={10}
                        color='white'
                        type='TailSpin'
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '5px' }}
                    />}
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
