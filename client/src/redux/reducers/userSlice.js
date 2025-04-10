import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register", formData, { withCredentials: true });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/user/login", formData, { withCredentials: true });
      console.log(response.data);
      return response.data
      // return dispatch(getUser()).unwrap();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
      dispatch(logout());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// GET CURRENT USER
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/get-user", { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

// UPDATE USER
export const updateUser = createAsyncThunk(
  "user/update",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put("/user/update-user", formData, { withCredentials: true });
      dispatch(getUser());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
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
      const response = await api.put("/user/update-photo", formData, {
        // headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      // dispatch(getUser());
      console.log(response.data)
      console.log(response.data.photo)
      const photo =  { photo: response.data.profilePicture };
      return photo;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Upload failed");
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
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// INITIAL STATE
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  status: false,
};

// SLICE
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
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
        state.status = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        console.log(action.payload)
        state.isAuthenticated = true;
        state.loading = false;
        state.status = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        console.log(action.payload)
        state.isAuthenticated = true;
        state.loading = false;
        state.status = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // GET USER
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.status = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.loading = false;
        state.status = false;
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = true;
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
        state.loading = false;
        state.status = false;
      })

      // UPLOAD PHOTO
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
      })
      
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        if (state.user) {
          console.log(state.user)
          state.user.photo = action.payload;
          console.log(action.payload)
          console.log(action.payload.photo.profilePicture)
        }
      })
      
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
        state.status = false;
      })      

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;