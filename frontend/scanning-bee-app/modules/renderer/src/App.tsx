import React from 'react';
import { Provider } from 'react-redux';

import { HomePage } from './pages/HomePage';
import { ManualAnnotatorPage } from './pages/ManualAnnotatorPage';
import { SettingsPage } from './pages/SettingsPage';
import store from './store';
import Header from './toolbars/Header';

require('@assets/css/index.css');

const App = (props: { page: PageType, setPage: any, goBack: any }) => {
    const { page, setPage, goBack } = props;

    return (
        <Provider store={store}>
            <div
                id="main-content"
            >
                <Header page={page} setPage={setPage} />

                {
                    (() => {
                        switch (page) {
                        case 'home':
                            return <HomePage setPage={setPage} />;
                        case 'manual-annotator':
                            return <ManualAnnotatorPage />;
                        case 'settings':
                            return <SettingsPage goBack={goBack} />;
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
