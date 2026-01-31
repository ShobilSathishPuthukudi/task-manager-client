import { createAsyncThunk } from "@reduxjs/toolkit";
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

export { register, login, getCurrentUser, logout };
