// src/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;

      // Save token in cookie instead of localStorage
      Cookies.set("token", token, { secure: true, sameSite: "Strict" });
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // Remove token from cookie
      Cookies.remove("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
