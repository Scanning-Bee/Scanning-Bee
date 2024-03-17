import { Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { useTheme } from '@frontend/slices/themeSlice';
import { resetZoom, setZoom } from '@frontend/slices/zoomSlice';
import { webFrame } from 'electron';
import React from 'react';
import { useDispatch } from 'react-redux';

export const FooterRight = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    const SCANNING_BEE_VERSION = process.env.SCANNING_BEE_VERSION || 'development';

    return (
        <div className='footer-right' style={{ marginRight: '10px' }}>
            <Popover
                interactionKind='click'
                position='top'
                canEscapeKeyClose
                usePortal
                minimal
                fill={false}
            >
                <Icon className='footer-zoom-icon' size={12} icon="search" style={{ color: theme.secondaryForeground }} />
                <Menu style={{ display: 'flex' }}>
                    <MenuItem
                        icon={<Icon icon="zoom-out" size={20}/>}
                        onClick={() => dispatch(setZoom(webFrame.getZoomLevel() - 1))}
                        style={{ width: '35px' }}
                    />
                    <MenuItem
                        text="Reset"
                        onClick={() => dispatch(resetZoom())}
                    />
                    <MenuItem
                        icon={<Icon icon="zoom-in" size={20}/>}
                        onClick={() => dispatch(setZoom(webFrame.getZoomLevel() + 1))}
                        style={{ width: '35px' }}
                    />
                </Menu>
            </Popover>
            <p style={{ margin: 0, fontSize: '12px', alignSelf: 'center' }}>
                        Scanning Bee {SCANNING_BEE_VERSION}
            </p>
        </div>
    );
};
