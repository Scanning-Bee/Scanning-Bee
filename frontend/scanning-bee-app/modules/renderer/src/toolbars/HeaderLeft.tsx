import BeeBlack from '@assets/images/bee-black.png';
import BeeWhite from '@assets/images/bee-white.png';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';

export const HeaderLeft = () => {
    const theme = useTheme();

    return (<div className="header-container header-container-left">
        <img
            src={theme.type === 'dark' ? BeeWhite : BeeBlack}
            alt="Scanning Bee Logo"
            className='header-logo'
        />
        {/* {props.page !== 'home' && <>
            <Divider style={{ margin: '0px 5px 0px 2px', backgroundColor: theme.secondaryForeground, width: '1px', height: '50%' }} />
            <p style={{ margin: 0, color: theme.tertiaryForeground }}>
                {
                    (() => {
                        switch (props.page) {
                        case 'manual-annotator':
                            return 'Manual Annotator';
                        case 'settings':
                            return 'Settings';
                        case 'statistics':
                            return 'Statistics';
                        default:
                            return 'Page not found';
                        }
                    })()
                }
            </p>
        </>} */}
    </div>);
};
