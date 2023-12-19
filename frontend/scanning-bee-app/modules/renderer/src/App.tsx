import { Button, Icon } from '@blueprintjs/core';
import React from 'react';
import { Provider } from 'react-redux';

import { HomePage } from './pages/HomePage';
import { ManualAnnotatorPage } from './pages/ManualAnnotatorPage';
import store from './store';
import Header from './toolbars/Header';
import { lightTheme } from './utils/colours';

require('@assets/css/index.css');

const App = (props: { page: any, setPage: any }) => {
    const { page, setPage } = props;

    const theme = lightTheme;

    return (
        <Provider store={store}>
            <div
                id="main-content"
            >
                <Header />

                {page !== 'home' && (
                    <Button
                        icon={<Icon icon="home" style={{ color: theme.primaryForeground }} />}
                        className="floating-button"
                        onClick={
                            (e) => {
                            // ? this section prevents button spamming with spacebar.
                                e.preventDefault();

                                setPage('home');
                            }
                        }
                        minimal
                        style={{ background: theme.secondaryBackground }}
                    />
                )}

                {
                    (() => {
                        switch (page) {
                        case 'home':
                            return <HomePage setPage={setPage} />;
                        case 'manual-annotator':
                            return <ManualAnnotatorPage />;
                        default:
                            return <div>Page not found</div>;
                        }
                    })()
                }
            </div>
        </Provider>
    );
};

export default App;
