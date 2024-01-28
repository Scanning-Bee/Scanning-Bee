import { Button, ButtonGroup, Card, Menu, MenuItem, Popover } from '@blueprintjs/core';
import StorageService from '@frontend/services/StorageService';
import { setTheme, useTheme } from '@frontend/slices/themeSlice';
import { Themes } from '@frontend/utils/colours';
import { webFrame } from 'electron';
import React from 'react';
import { useDispatch } from 'react-redux';

export const GeneralSettings = () => (
    <div>
        <h2 className='settings-title'>General Settings</h2>
        <p>Scanning Bee v0.0.0</p>
    </div>
);

export const ThemeSettings = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    return (
        <div>
            <h2 className='settings-title'>Theme Settings</h2>
            <Card>
                <div className='settings-card'>
                    <p>
                        Theme
                    </p>
                    <Popover
                        content={
                            <Menu>
                                {Themes.map(t => (
                                    <MenuItem
                                        key={t.title}
                                        text={t.title}
                                        onClick={() => dispatch(setTheme(t))}
                                        icon={t.title === theme.title ? 'tick' : 'blank'}
                                    />
                                ))}
                            </Menu>
                        }
                    >
                        <Button
                            text={theme.title}
                            rightIcon='caret-down'
                            style={{ alignSelf: 'center' }}
                        />
                    </Popover>
                </div>
            </Card>
        </div>
    );
};

export const AccessibilitySettings = () => (
    <div>
        <h2 className='settings-title'>Accessibility Settings</h2>
        <Card>
            <div className='settings-card'>
                <p>
                    Change Zoom
                </p>
                <div style={{ display: 'flex' }}>
                    <ButtonGroup>
                        <Button
                            text='-'
                            onClick={() => {
                                webFrame.setZoomLevel(webFrame.getZoomLevel() - 1);
                            }}
                        />
                        <Button
                            text='+'
                            onClick={() => {
                                webFrame.setZoomLevel(webFrame.getZoomLevel() + 1);
                            }}
                        />
                    </ButtonGroup>
                    <Button
                        text='Reset'
                        onClick={() => {
                            webFrame.setZoomLevel(0);
                        }}
                        style={{ marginLeft: '5px' }}
                        intent='primary'
                    />
                </div>
            </div>
        </Card>
    </div>
);

export const AdvancedSettings = () => (
    <div>
        <h2 className='settings-title'>Advanced Settings</h2>
        <Card>
            <div className='settings-card'>
                <p>
                    Current Storage Size: {StorageService.getStorageSize()} bytes
                </p>
                <Button
                    text='Clear'
                    intent='danger'
                    onClick={() => {
                        StorageService.clearStorage();
                    }}
                    style={{ alignSelf: 'center', height: 'fit-content' }}
                />
            </div>
        </Card>
    </div>
);
