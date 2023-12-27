import React from 'react';
import { Provider } from 'react-redux';

import { HomePage } from './pages/HomePage';
import { ManualAnnotatorPage } from './pages/ManualAnnotatorPage';
import store from './store';
import Header from './toolbars/Header';

require('@assets/css/index.css');

const App = (props: { page: any, setPage: any }) => {
    const { page, setPage } = props;

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
