import ScanningBeeLogoBig from '@assets/images/scanning_bee_logo_big.png';
import React, { StrictMode } from 'react';

import Header from './toolbars/Header';

require('@assets/css/index.css');

const App = props => (
    <StrictMode>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
        }}>
            <Header />

            <div id="content">
                <img
                    src={ScanningBeeLogoBig}
                    className='main-logo'
                    alt={`Scanning Bee Logo${props.page}`}
                />

                <p>
                    The application is currently in progress! Stay tuned for updates.
                </p>
            </div>
        </div>
    </StrictMode>
);

export default App;
