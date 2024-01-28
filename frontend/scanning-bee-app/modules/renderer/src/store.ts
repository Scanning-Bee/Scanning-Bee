import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import annotationReducer from './slices/annotationSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
    reducer: combineReducers({
        annotation: annotationReducer,
        theme: themeReducer,
    }),
});

setupListeners(store.dispatch);

(window as any).store = store;

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
