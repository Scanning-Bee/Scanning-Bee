import { useTheme } from '@frontend/slices/themeSlice';
import { getMemoryUsage } from '@frontend/utils/miscUtils';
import { Theme } from '@utils/colours';
import React, { useEffect, useState } from 'react';

export default function Footer() {
    const theme: Theme = useTheme();

    const SCANNING_BEE_VERSION = process.env.SCANNING_BEE_VERSION || 'development';

    const [memoryUsage, setMemoryUsage] = useState(getMemoryUsage());

    const footerBackground = theme.type === 'dark' ? theme.secondaryBackground : theme.tertiaryBackground;

    useEffect(() => {
        const interval = setInterval(() => {
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
                <p style={{ margin: 0, fontSize: '12px' }}>
                        Memory Usage: {memoryUsage} MB
                </p>
            </div>

            <div className='footer-right'>
                <p style={{ margin: 0, fontSize: '12px' }}>
                        Scanning Bee {SCANNING_BEE_VERSION}
                </p>
            </div>
        </div>
    );
}
