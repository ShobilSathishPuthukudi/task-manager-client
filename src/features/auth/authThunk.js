import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      const response = await api.post("/login", credentials);

      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return thunkApi.rejectWithValue(error.response.data);
      }

      return thunkApi.rejectWithValue({
        success: false,
        message: "Network error",
        errors: [],
      });
    }
  },
);

const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkApi) => {
    try {
      const response = await api.post("/register", userData);

      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return thunkApi.rejectWithValue(error.response.data);
      }

      return thunkApi.rejectWithValue({
        success: false,
        message: "Network error",
        errors: [],
      });
    }
  },
);

const getMe = createAsyncThunk("/me", async (_, thunkApi) => {
  try {
    const response = await api.get("/me");

    return response.data;
  } catch (error) {
    if (error.response?.data) {
      return thunkApi.rejectWithValue(error.response.data);
    }

    return thunkApi.rejectWithValue({
      success: false,
      message: "Network error",
      errors: [],
    });
  }
});

const logout = createAsyncThunk("/logout", async (_, thunkApi) => {
  try {
    return await api.post("/logout");
  } catch (error) {
    return thunkApi.rejectWithValue({
      success: false,
      message: "Network error",
      errors: [],
    });
  }
});
