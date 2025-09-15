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

      Cookies.set("token", token, { secure: true, sameSite: "Strict" });
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      Cookies.remove("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
