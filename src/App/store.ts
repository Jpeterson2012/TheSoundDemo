import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";

import { apiSlice } from "./ApiSlice";

import defaultReducer from "./defaultSlice";

export const store = configureStore({
    reducer: {        
        defaultState: defaultReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: {warnAfter: 200},
            serializableCheck: { warnAfter: 200 }
        })
            .concat(apiSlice.middleware)
});

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;