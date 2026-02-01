import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

const getTasks = createAsyncThunk(
  "tasks/get",
  async (queryParams = "", thunkApi) => {
    try {
      const response = await api.get(`/tasks?${queryParams}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Fetching tasks failed";
      const errors = error.response?.data?.errors || [];
      return thunkApi.rejectWithValue({ message, errors });
    }
  },
);

const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, thunkApi) => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create task";
      const errors = error.response?.data?.errors || [];
      return thunkApi.rejectWithValue({ message, errors });
    }
  },
);

const updateTask = createAsyncThunk(
  "task/update",
  async ({ id, taskData }, thunkApi) => {
    try {
      const response = await api.patch(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update task";
      const errors = error.response?.data?.errors || [];
      return thunkApi.rejectWithValue({ message, errors });
    }
  },
);

const deleteTask = createAsyncThunk("tasks/delete", async (id, thunkApi) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete task";
    const errors = error.response?.data?.errors || [];
    return thunkApi.rejectWithValue({ message, errors });
  }
});

const getTrashTasks = createAsyncThunk(
  "tasks/trash/get",
  async (_, thunkApi) => {
    try {
      const response = await api.get("/tasks/trash");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch trashed task";
      const errors = error.response?.data?.errors || [];
      return thunkApi.rejectWithValue({ message, errors });
    }
  },
);

const restoreTask = createAsyncThunk("tasks/restore", async (id, thunkApi) => {
  try {
    const response = await api.patch(`tasks/${id}/restore`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to restore task";
    const errors = error.response?.data?.errors || [];
    return thunkApi.rejectWithValue({ message, errors });
  }
});

const permanentlyDeleteTask = createAsyncThunk(
  "tasks/permanent/delete",
  async (id, thunkApi) => {
    try {
      const response = await api.delete(`tasks/${id}/permanent`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete permanently";
      const errors = error.response?.data?.errors || [];
      return thunkApi.rejectWithValue({ message, errors });
    }
  },
);

const emptyTrash = createAsyncThunk(
  "tasks/trash/empty",
  async (_, thunkApi) => {
    try {
      const response = await api.delete(`tasks/trash/empty`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Emoty trash failed";
      const errors = error.response?.data?.errors || [];
      return thunkApi.rejectWithValue({ message, errors });
    }
  },
);

const initialState = {
  tasks: [],
  trashTasks: [],
  isLoading: false,
  isError: false,
  message: null,
  errors: {},
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTask: (state) => {
      return initialState;
    },
    clearTaskError: (state) => {
      state.isError = false;
      state.message = null;
      state.errors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.data;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload.data);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id,
        );

        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const taskToDelete = action.payload.data;

        state.tasks = state.tasks.filter(
          (task) => task._id !== taskToDelete._id,
        );

        state.trashTasks.unshift(taskToDelete);
      })

      .addCase(getTrashTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trashTasks = action.payload.data;
      })
      .addCase(restoreTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const taskToRestore = action.payload.data;

        state.trashTasks = state.trashTasks.filter(
          (task) => task._id !== taskToRestore._id,
        );
      })
      .addCase(permanentlyDeleteTask.fulfilled, (state, action) => {
        const taskToDelete = action.payload.data;
        state.isLoading = false;
        state.trashTasks = state.trashTasks.filter(
          (task) => task._id !== taskToDelete._id,
        );
      })
      .addCase(emptyTrash.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trashTasks = [];
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.isError = false;
          state.message = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message =
            action.payload.message || "Error occured, Try again later.";
          state.errors = action.payload.errors || [];
        },
      );
  },
});

export const { clearTask, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTrashTasks,
  restoreTask,
  permanentlyDeleteTask,
  emptyTrash,
};
