import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  message: "",
  fieldErrors: [],
};

const formatErrors = (errors) => {
  console.log("called");
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

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.fieldErrors = [];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const { user } = action.payload.data;

        state.user = user;

        state.isAuthenticated = true;

        api.defaults.headers.common["Authorization"] =
          `Bearer ${user.accessToken}`;
      })
      .addCase(loginUser.rejected, (state, payload) => {
        state.loading = false;
        state.message = payload.message;
        state.fieldErrors = formatErrors(payload.errors);
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.fieldErrors = [];
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        const { user } = action.payload.data;

        state.user = user;

        state.isAuthenticated = true;

        api.defaults.headers.common["Authorization"] =
          `Bearer ${user.accessToken}`;
      })
      .addCase(registerUser.rejected, (state, payload) => {
        state.loading = false;
        state.message = payload.message;
        state.fieldErrors = formatErrors(payload.errors);
      })

      .addCase(getMe.fulfilled, (state, action) => {
        const { user } = action.payload.data;

        state.user = user;

        state.isAuthenticated = true;

        api.defaults.headers.common["Authorization"] =
          `Bearer ${user.accessToken}`;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;

        state.isAuthenticated = false;

        delete api.defaults.headers.common["Authorization"];
      });
  },
});

export default authSlice.reducer;
