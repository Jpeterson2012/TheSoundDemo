import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";

import { apiSlice } from "./ApiSlice";

export const store = configureStore({
    reducer: {        
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: {warnAfter: 200},
            serializableCheck: { warnAfter: 200 }
        })
            .concat(apiSlice.middleware)
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>


