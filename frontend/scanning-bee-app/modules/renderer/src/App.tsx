import React from 'react';
import { Provider } from 'react-redux';

import { HomePage } from './pages/HomePage';
import { ManualAnnotatorPage } from './pages/ManualAnnotatorPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import store from './store';
import Header from './toolbars/Header';

require('@assets/css/index.css');

const App = (props: {
    page: PageType,
    setPage: any,
    goBack: any,
    goForward: any
    getPreviousPage: any,
    getNextPage: any,
}) => {
    const { page, setPage, goBack, goForward, getNextPage, getPreviousPage } = props;

    return (
        <Provider store={store}>
            <div
                id="main-content"
            >
                <Header
                    page={page}
                    setPage={setPage}
                    goBack={goBack}
                    goForward={goForward}
                    getPreviousPage={getPreviousPage}
                    getNextPage={getNextPage}
                />

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
                            return <StatisticsPage />;
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
