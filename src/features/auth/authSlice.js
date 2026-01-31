import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../../api/authService";
import { registerUser, loginUser } from "../auth/authThunk.js";
import { act } from "react";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  fieldErrors: {},
};

const formatErrors = (errors) => {
  const formatted = {};

  errors?.forEach((err) => {
    if (!formatted[err.field]) {
      formatted[err.field] = [];
    }

    formatted[err.field].push(err.message);
  });

  return formatted;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.fieldErrors = "";
    },

    logoutUser: (state) => {
      state.user = null;
      logout();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fullfilled, (state, actions) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = actions.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
        state.fieldErrors = formatErrors(action.payload.errors);
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fullfilled, (state, actions) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = actions.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
        state.fieldErrors = formatErrors(action.payload.errors);
      });
  },
});

export const { reset, logoutUser } = authSlice.actions;
export default authSlice.reducer;
