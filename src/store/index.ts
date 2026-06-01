import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ticketCategoriaReducer from "./slices/ticketCategorySlice"
import ticketReducer from "./slices/ticketSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    ticketCategoria: ticketCategoriaReducer,
    ticket: ticketReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
