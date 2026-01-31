import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "../../api/authService";

const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      return await login(credentials);
    } catch (error) {
      const data = error.response?.data;

      return thunkApi.rejectWithValue({
        message: data?.message || "Login failed",
        errors: data?.errors || [],
      });
    }
  },
);

const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkApi) => {
    try {
      return await register(userData);
    } catch (error) {
      const data = error.response?.data;

      return thunkApi.rejectWithValue({
        message: data?.message || "Registration failed",
        errors: data?.errors || [],
      });
    }
  },
);
