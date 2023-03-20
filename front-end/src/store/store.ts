import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../features/movies/moviesSlice";
import watchlistReducer from "../features/watchlist/watchlistSlice";
import authReducer from "../features/auth/authSlice";
import registerReducer from '../features/register/registerSlice'
export const store = configureStore({
    reducer:{
        moviesReducer,
        watchlistReducer,
        authReducer,
        registerReducer,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>