import BeeBlack from '@assets/images/bee-black.png';
import BeeWhite from '@assets/images/bee-white.png';
import ScanningBeeLogoBig from '@assets/images/scanning_bee_logo_big.png';
import { Card, Icon, Popover } from '@blueprintjs/core';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';

export const HomePage = (props: { setPage: (arg: PageType) => void }) => {
    const { setPage } = props;

    const theme = useTheme();

    return (
        <div
            style={{
                backgroundColor: theme.primaryBackground,
                color: theme.primaryForeground,
                display: 'flex',
            }}
            className='page'
        >
            <div className='home'>
                <img
                    src={ScanningBeeLogoBig}
                    className='main-logo'
                    alt={'Scanning Bee Logo'}
                />

                <div style={{ display: 'flex' }}>
                    <Card
                        onClick={() => setPage('manual-annotator')}
                        interactive
                        elevation={2}
                        className='homepage-card'
                        style={{ backgroundColor: theme.secondaryBackground, color: theme.primaryForeground }}
                    >
                        <Icon icon='annotation' iconSize={50} />
                        <h3 style={{ fontWeight: 'normal' }}>Manual Annotator</h3>
                    </Card>
                    <Card
                        onClick={() => setPage('statistics')}
                        interactive
                        elevation={2}
                        className='homepage-card'
                        style={{ backgroundColor: theme.secondaryBackground, color: theme.primaryForeground }}
                    >
                        <Icon icon='timeline-bar-chart' iconSize={50} />
                        <h3 style={{ fontWeight: 'normal' }}>Statistics</h3>
                    </Card>
                    <Popover
                        interactionKind='hover-target'
                        position='bottom'
                        lazy
                        canEscapeKeyClose
                    >
                        <Card
                            // onClick={() => setPage('beehive')} DISABLED
                            interactive={false}
                            elevation={2}
                            className='homepage-card disabled'
                            style={{ backgroundColor: theme.secondaryBackground, color: theme.primaryForeground }}
                        >
                            <img
                                src={theme.type === 'dark' ? BeeWhite : BeeBlack}
                                alt={'Scanning Bee Logo'}
                                className='disabled-image-icon'
                                style={{ width: '50px' }}
                            />
                            <h3 style={{ fontWeight: 'normal' }}>Beehive Information</h3>
                        </Card>
                        <div style={{ padding: '10px' }}>
                            This feature is not yet implemented.
                        </div>
                    </Popover>
                </div>
            </div>
        </div>
    );
};
