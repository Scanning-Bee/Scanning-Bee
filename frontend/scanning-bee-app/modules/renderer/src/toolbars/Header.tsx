import HeaderLogo from '@assets/images/header-logo.png';
import { Overlay } from '@blueprintjs/core';
import { lightTheme, Theme } from '@utils/colours';
import React from 'react';

export default function Header() {
    const theme: Theme = lightTheme;

    return (
        <Overlay isOpen={true} hasBackdrop={false}>

            <div id="header"
            // eslint-disable-next-line no-useless-concat
                className={'noselect'}
                style={{
                    background: theme.secondaryBackground,
                    borderBottom: theme.secondaryBackground === theme.primaryBackground
                        ? `1px solid ${theme.primaryBorder}` : 'none',
                }}
            >
                <div className="header-container">
                    <img
                        src={HeaderLogo}
                        alt="Scanning Bee Logo"
                        className='header-logo'
                    />
                    <h1 className='header-title'>
                        Scanning Bee
                    </h1>
                </div>
            </div>
        </Overlay>
    );
}
