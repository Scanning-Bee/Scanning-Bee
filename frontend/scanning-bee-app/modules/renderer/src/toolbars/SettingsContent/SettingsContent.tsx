import {
    Button, ButtonGroup, Card, FormGroup, InputGroup, Menu, MenuItem, NumericInput, Popover, Position,
} from '@blueprintjs/core';
import { initializeHotkeyConfiguration } from '@frontend/controllers/hotkeyConfiguration';
import StorageService from '@frontend/services/StorageService';
import { updateWorkspaceInfo, useWorkspaceInfo } from '@frontend/slices/annotationSlice';
import { setTheme, useTheme } from '@frontend/slices/themeSlice';
import { resetZoom, setZoom } from '@frontend/slices/zoomSlice';
import { Themes } from '@frontend/utils/colours';
import { getUnicodeIconRepresentation } from '@frontend/utils/miscUtils';
import { webFrame } from 'electron';
import React from 'react';
import { useDispatch } from 'react-redux';

export const GeneralSettings = () => (
    <div>
        <h2 className='settings-title'>General Settings</h2>
        <p>Scanning Bee v0.0.0</p>
    </div>
);

export const AppearanceSettings = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    return (
        <div>
            <h2 className='settings-title'>Theme</h2>
            <Card style={{ backgroundColor: theme.secondaryBackground }}>
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

export const AccessibilitySettings = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    return (
        <div>
            <h2 className='settings-title'>Accessibility Settings</h2>
            <Card style={{ backgroundColor: theme.secondaryBackground }}>
                <div className='settings-card'>
                    <p>
                    Change Zoom
                    </p>
                    <div style={{ display: 'flex' }}>
                        <ButtonGroup>
                            <Button
                                text='-'
                                onClick={() => dispatch(setZoom(webFrame.getZoomLevel() - 1))}
                            />
                            <Button
                                text='+'
                                onClick={() => dispatch(setZoom(webFrame.getZoomLevel() + 1))}
                            />
                        </ButtonGroup>
                        <Button
                            text='Reset'
                            onClick={() => dispatch(resetZoom())}
                            style={{ marginLeft: '5px' }}
                            intent='primary'
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const KeyboardShortcuts = () => {
    const theme = useTheme();

    const dispatch = useDispatch();

    const hotkeysContent = initializeHotkeyConfiguration({ dispatch });

    return (
        <div>
            <h2 className='settings-title'>Manual Annotator</h2>
            <Card style={{ backgroundColor: theme.secondaryBackground }}>
                <div className='settings-card' style={{ flexDirection: 'column' }}>
                    {
                        hotkeysContent.map(hotkey => (
                            <div
                                key={hotkey.combo}
                                className='shortcut-settings'
                            >
                                <p>
                                    {hotkey.label}
                                </p>
                                <p>
                                    {getUnicodeIconRepresentation(hotkey.combo)}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </Card>
        </div>
    );
};

export const AdvancedSettings = () => {
    const theme = useTheme();

    return (
        <div>
            <h2 className='settings-title'>Advanced Settings</h2>
            <Card style={{ backgroundColor: theme.secondaryBackground }}>
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
};

export const WorkspaceSettings = () => {
    const theme = useTheme();

    const workspace = useWorkspaceInfo();

    const dispatch = useDispatch();

    return (
        <div>
            <h2 className='settings-title'>Workspace Settings</h2>
            <Card style={{ backgroundColor: theme.secondaryBackground }}>
                <div className='settings-card'>
                    <p>
                    Workspace Name
                    </p>
                    <FormGroup
                    >
                        <InputGroup
                            id='workspace-input'
                            value={workspace.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(updateWorkspaceInfo({
                                name: e.target.value,
                            }))}
                        />
                    </FormGroup>
                </div>
            </Card>
            <Card style={{ backgroundColor: theme.secondaryBackground }}>
                <div className='settings-card'>
                    <p>
                    Workspace Frame
                    </p>
                    <NumericInput
                        placeholder='change'
                        value={workspace.frame}
                        onValueChange={val => dispatch(updateWorkspaceInfo({
                            frame: val,
                        }))}
                        buttonPosition={Position.LEFT}
                        style={{
                            width: '50px',
                        }}
                        min={0}
                    />
                </div>
            </Card>
            <Card style={{ backgroundColor: theme.secondaryBackground }}>
                <div className='settings-card'>
                    <p>
                    Workspace Hive
                    </p>
                    <Popover
                        interactionKind='click'
                    >
                        <Button
                            text={workspace.hive}
                            rightIcon='caret-down'
                            style={{ alignSelf: 'center' }}
                        />
                        <Menu>
                            {
                                [
                                    'Austria',
                                    'Belgium',
                                    'Bulgaria',
                                    'Turkey',
                                    workspace.hive,
                                ].map((beehive, index) => (
                                    <MenuItem
                                        key={index}
                                        text={beehive}
                                        onClick={() => {
                                            dispatch(updateWorkspaceInfo({
                                                hive: beehive,
                                            }));
                                        }}
                                        style={{
                                            padding: '5px',
                                            margin: '0 5px',
                                            color: 'black',
                                        }}
                                        active={beehive === workspace.hive}
                                    />
                                ))
                            }
                        </Menu>
                    </Popover>
                </div>
            </Card>
        </div>
    );
};
