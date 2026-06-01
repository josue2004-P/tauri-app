import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../types/auth";
import type { User } from "../../types/auth/User";

const initialState: AuthState = {
  id: undefined,
  token: undefined,
  user: null,
  isLoggedIn: false,
  error: null,
  checking: true, 
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onLogin: (
      state,
      action: PayloadAction<{ id: string; token: string; user: User}>
    ) => {
      state.id = action.payload.id;
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isLoggedIn = true;
      state.checking = false;
    },
    onLogout: (state) => {
      state.id = undefined;
      state.token = undefined;
      state.user = null;
      state.isLoggedIn = false;
      state.checking = false;
    },
    onSetError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
      state.isLoggedIn = false;
      state.checking = false;
    },
  },
});

export const { onLogin, onLogout, onSetError } = authSlice.actions;
export default authSlice.reducer;
