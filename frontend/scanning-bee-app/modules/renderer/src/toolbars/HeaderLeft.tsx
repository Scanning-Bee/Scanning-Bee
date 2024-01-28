import HeaderLogo from '@assets/images/bee.png';
import { Button, Divider } from '@blueprintjs/core';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';

export const HeaderLeft = (props: { page: any, setPage: any }) => {
    const theme = useTheme();

    return (<div className="header-container header-container-left">
        <Button
            minimal
            icon={<img
                src={HeaderLogo}
                alt="Scanning Bee Logo"
                className='header-logo'
            />}
            text={<p style={{ fontSize: 'large', margin: 0 }}>Scanning Bee</p>}
            onClick={(e) => {
                e.preventDefault();
                props.setPage('home');
            }}
            large
            className='header-button'
            style={{ padding: '5px' }}
        />
        {props.page !== 'home' && <>
            <Divider style={{ margin: '0px 5px 0px 2px', color: theme.primaryBorder, width: '1px', height: '50%' }} />
            <p style={{ margin: 0, color: theme.tertiaryForeground }}>
                {
                    (() => {
                        switch (props.page) {
                        case 'manual-annotator':
                            return 'Manual Annotator';
                        case 'settings':
                            return 'Settings';
                        default:
                            return 'Page not found';
                        }
                    })()
                }
            </p>
        </>}
    </div>);
};
