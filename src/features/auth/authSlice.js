import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkApi) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      const errors = error.response?.data?.errors || [];
      return thunkApi.rejectWithValue({ message, errors });
    }
  },
);

const login = createAsyncThunk("auth/login", async (credentials, thunkApi) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    const errors = error.response?.data?.errors || [];
    return thunkApi.rejectWithValue({ message, errors });
  }
});

const getCurrentUser = createAsyncThunk("auth/me", async (_, thunkApi) => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to get current user";
    return thunkApi.rejectWithValue(message);
  }
});

const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    return thunkApi.rejectWithValue("Logout failed");
  }
});

const trasnformErrors = (errorsArray) => {
  const errors = {};
  errorsArray?.forEach((error) => {
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
        state.isError = false;
        state.message = "";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      .addCase(logout.rejected, (state, action) => {
        return initialState;
      });
  },
});

export const { resetState, updateToken } = authSlice.actions;
export default authSlice.reducer;
export { register, login, getCurrentUser, logout };
