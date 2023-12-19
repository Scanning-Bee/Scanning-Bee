import Bee from '@assets/images/bee-primary.png';
import ScanningBeeLogoBig from '@assets/images/scanning_bee_logo_big.png';
import { Card, Icon, Popover } from '@blueprintjs/core';
import React from 'react';

export const HomePage = (props: { setPage: any }) => {
    const { setPage } = props;

    return (
        <div>
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
                >
                    <Icon icon='annotation' iconSize={50} />
                    <h3 style={{ fontWeight: 'normal' }}>Manual Annotator</h3>
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
                    >
                        <img src={Bee} alt={'Scanning Bee Logo'} className='disabled-image-icon' style={{ width: '50px' }} />
                        <h3 style={{ fontWeight: 'normal' }}>Beehive Information</h3>
                    </Card>
                    <div style={{ padding: '10px' }}>
                        This feature is not yet implemented.
                    </div>
                </Popover>
            </div>

        </div>
    );
};
