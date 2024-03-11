import { Tab, Tabs } from '@blueprintjs/core';
import { useTheme } from '@frontend/slices/themeSlice';
import {
    AccessibilitySettings,
    AdvancedSettings,
    GeneralSettings,
    KeyboardShortcuts,
    ThemeSettings,
} from '@frontend/toolbars/SettingsContent/SettingsContent';
import React, { useState } from 'react';

export const SettingsPage = () => {
    const theme = useTheme();

    const [activeTab, setActiveTab] = useState('general');

    return (
        <div
            style={{
                backgroundColor: theme.primaryBackground,
                color: theme.primaryForeground,
                display: 'flex',
            }}
            className='page'
        >
            <div className='settings-page'>
                <Tabs
                    id='SettingsTabs'
                    onChange={id => setActiveTab(id.toString())}
                    defaultSelectedTabId='general'
                    selectedTabId={activeTab}
                    vertical
                    renderActiveTabPanelOnly
                >
                    <Tab
                        id='general'
                        title='General'
                        panel={<GeneralSettings />}
                        className='settings-tab'
                        style={{ color: theme.primaryForeground }}
                    />
                    <Tab
                        id='theme'
                        title='Theme'
                        panel={<ThemeSettings />}
                        className='settings-tab'
                        style={{ color: theme.primaryForeground }}
                    />
                    <Tab
                        id='accessibility'
                        title='Accessibility'
                        panel={<AccessibilitySettings />}
                        className='settings-tab'
                        style={{ color: theme.primaryForeground }}
                    />
                    <Tab
                        id='keyboard-shortcuts'
                        title='Keyboard Shortcuts'
                        panel={<KeyboardShortcuts />}
                        className='settings-tab'
                        style={{ color: theme.primaryForeground }}
                    />
                    <Tab
                        id='advanced'
                        title='Advanced'
                        panel={<AdvancedSettings />}
                        className='settings-tab'
                        style={{ color: theme.primaryForeground }}
                    />
                    <Tabs.Expander />
                </Tabs>
            </div>
        </div>
    );
};
