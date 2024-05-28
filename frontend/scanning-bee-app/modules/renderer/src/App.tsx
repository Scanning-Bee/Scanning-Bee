import React from 'react';
import { Provider } from 'react-redux';

import BackendInterface from './controllers/backendInterface/backendInterface';
import { HotkeyHandler } from './Hotkeys';
import { BeehivePage } from './pages/BeehivePage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ManualAnnotatorPage } from './pages/ManualAnnotatorPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import store from './store';
import Footer from './toolbars/Footer';
import Header from './toolbars/Header';

require('@assets/css/index.css');

const App = (props: {
    page: PageType,
    setPage: any,
    goBack: any,
    goForward: any
    getPreviousPage: any,
    getNextPage: any,
    fullScreen: boolean,
}) => {
    const { page, setPage, goBack, goForward, getNextPage, getPreviousPage, fullScreen } = props;

    return (
        <Provider store={store}>
            <div
                id="main-content"
                style={{
                    position: page === 'login' ? 'unset' : 'fixed',
                }}
            >
                {
                    page !== 'login'
                    && <Header
                        page={page}
                        setPage={setPage}
                        goBack={goBack}
                        goForward={goForward}
                        getPreviousPage={getPreviousPage}
                        getNextPage={getNextPage}
                        fullScreen={fullScreen}
                    />
                }

                {
                    (() => {
                        switch (page) {
                        case 'home':
                            return <HomePage setPage={setPage} />;
                        case 'manual-annotator':
                            return <ManualAnnotatorPage />;
                        case 'settings':
                            return <SettingsPage />;
                        case 'statistics':
                            BackendInterface.updateCache();
                            return <StatisticsPage />;
                        case 'login':
                            return <LoginPage setPage={setPage} />;
                        case 'beehive':
                            BackendInterface.updateCache();
                            return <BeehivePage />;
                        default:
                            return <div>Page not found</div>;
                        }
                    })()
                }

                {
                    page === 'manual-annotator' && <HotkeyHandler />
                }

                {
                    page !== 'login' && <Footer />
                }
            </div>
        </Provider>
    );
};

export default App;
