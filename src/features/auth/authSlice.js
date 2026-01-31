import { createSlice } from "@reduxjs/toolkit";
import { register, login, getCurrentUser, logout } from "./authThunk.js";

const trasnformErrors = (errorsArray) => {
  const errors = {};
  errorsArray.forEach((error) => {
    if (!errors[error.field]) {
      errors[error.field] = [];
    }

    errors[error.field].push(error.message);
  });
  return errors;
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isSuccess: false,
  isLoading: false,
  isError: null,
  message: "",
  errors: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = null;
      state.message = "";
      state.errors = {};
    },

    updateToken: (state, action) => {
      state.token = action.payload;
    },

    extraReducers: (builder) => {
      builder
        .addCase(register.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload.data;
          state.token = action.payload.data.accessToken;
          state.isAuthenticated = true;
        })
        .addCase(register.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload.message;
          state.errors = trasnformErrors(action.payload.errors);
        })
        .addCase(login.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload.data;
          state.token = action.payload.data.accessToken;
          state.isAuthenticated = true;
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload.message;
          state.errors = trasnformErrors(action.payload.errors);
        })
        .addCase(getCurrentUser.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getCurrentUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload.data;
          state.isAuthenticated = true;
        })
        .addCase(getCurrentUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })

        .addCase(logout.fulfilled, (state) => {
          return initialState;
        })
        .addCase(logout.rejected, (state, action) => {
          return initialState;
        });
    },
  },
});

export const { resetState, updateToken } = authSlice.actions;

export default authSlice.reducer;
