import FooterBlack from '@assets/svg/footer-black.svg';
import FooterWhite from '@assets/svg/footer-white.svg';
import { useTheme } from '@frontend/slices/themeSlice';
import React from 'react';

import { DynamicHomePage } from './home/Dynamic';
import { StaticHomePage } from './home/Static';

const homePageType = 'static';

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
            {
                homePageType === 'static'
                    ? <StaticHomePage setPage={setPage} />
                    : <DynamicHomePage />
            }
            <img
                src={theme.type === 'dark' ? FooterWhite : FooterBlack}
                alt={'Footer'}
                style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                }}
            />
        </div>
    );
};
