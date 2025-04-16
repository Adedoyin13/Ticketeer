import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register", formData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed");
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", formData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

// LOGIN WITH GOOGLE
export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/auth/google", { token }, { withCredentials: true });
      return response.data; // Return entire response for consistency
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Google login failed");
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Logout failed");
    }
  }
);

// GET CURRENT USER
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/get-user", { withCredentials: true });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch user");
    }
  }
);

// UPDATE USER
export const updateUser = createAsyncThunk(
  "user/update",
  async (eventData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put("/user/update-user", eventData, { withCredentials: true });
      dispatch(getUser());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Update failed");
    }
  }
);

// UPLOAD PHOTO
export const uploadProfilePhoto = createAsyncThunk(
  "user/uploadProfilePhoto",
  async (photoFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      const response = await api.put("/user/update-photo", formData, { withCredentials: true });
      return response.data.profilePicture; // Assuming this is the photo object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Upload failed");
    }
  }
);

// DELETE USER
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/user/delete-user", { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Delete failed");
    }
  }
);

// INITIAL STATE
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  status: "idle", // idle | loading | succeeded | failed
};

// SLICE
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // LOGIN WITH GOOGLE
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
      })

      // GET USER
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user || action.payload;
        console.log(state.user)
        state.isAuthenticated = true;
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.loading = false;
        state.status = "failed";
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // UPLOAD PHOTO
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        if (state.user) {
          state.user.photo = action.payload;
        }
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;