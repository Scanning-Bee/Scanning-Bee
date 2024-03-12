import { Hotkey, Hotkeys } from '@blueprintjs/core';
import { HotkeysTarget } from '@blueprintjs/core/lib/esnext';
import React from 'react';

import { initializeHotkeyConfiguration } from './controllers/hotkeyConfiguration';

class HotkeysUnwrapped extends React.Component {
    render() {
        return <></>;
    }

    renderHotkeys() {
        const { dispatch } = (window as any).store;

        const hotkeys = initializeHotkeyConfiguration({
            dispatch,
        });

        return (
            <Hotkeys>
                {hotkeys.map(hotkey => (
                    <Hotkey
                        key={hotkey.combo}
                        global={true}
                        {...hotkey}
                    />
                ))}
            </Hotkeys>
        );
    }
}

export const HotkeyHandler = HotkeysTarget(HotkeysUnwrapped);
