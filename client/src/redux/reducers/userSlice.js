import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import {
  clearUserFromStorage,
  loadUserFromStorage,
  saveUserToStorage,
} from "../../utils/authStorage";

const storedUser = loadUserFromStorage();
const token = storedUser?.token || null;

export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register", formData, {
        withCredentials: true,
      });
      saveUserToStorage(response.data.user, response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", formData, {
        withCredentials: true,
      });
      saveUserToStorage(response.data.user, response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

// export const loginWithGoogle = createAsyncThunk(
//   "user/loginWithGoogle",
//   async (token, { rejectWithValue }) => {
//     try {
//       const response = await api.post(
//         "/user/auth/google",
//         { token },
//         { withCredentials: true }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Google login failed"
//       );
//     }
//   }
// );

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (googleToken, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/auth/google", {
        token: googleToken,
      });

      console.log('Response: ', res)

      const { user, token } = res.data;
      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Logout failed"
      );
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/get-user", {
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put("/user/update-user", formData, {
        withCredentials: true,
      });
      console.log(response)
      dispatch(getUser());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Update failed"
      );
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  "user/uploadProfilePhoto",
  async (photoFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      const response = await api.put("/user/update-photo", formData, {
        withCredentials: true,
      });
      return response.data.profilePicture;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Upload failed"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/user/delete-user", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Delete failed"
      );
    }
  }
);

export const toggleThemeMode = createAsyncThunk(
  "user/toggleThemeMode",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await api.put(
        "/user/theme",
        {},
        {
          withCredentials: true,
        }
      );
      return res.data.themeMode;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to toggle theme"
      );
    }
  }
);

const initialState = {
  user: storedUser?.user || null,
  token,
  status: "idle",
  error: null,
  // themeMode: storedUser?.user?.themeMode || "light",
  themeMode: localStorage.getItem("theme") || "light",
  loading: {
    register: false,
    login: false,
    googleLogin: false,
    logout: false,
    getUser: false,
    updateUser: false,
    uploadPhoto: false,
    deleteUser: false,
  },
  error: null,
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.status = "idle";
      clearUserFromStorage();
    },
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    toggleTheme(state) {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.themeMode);
      document.documentElement.classList.toggle("dark", state.themeMode === "dark");
    
      const storedUser = loadUserFromStorage();
      if (storedUser) {
        const updatedUser = {
          ...storedUser,
          user: {
            ...storedUser.user,
            themeMode: state.themeMode,
          },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }    
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.loading.register = false;
        state.status = "succeeded";
        saveUserToStorage(state.user, state.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.loading.login = false;
        state.status = "succeeded";
        saveUserToStorage(state.user, state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.loading.googleLogin = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.loading.googleLogin = false;
        state.status = "succeeded";
        saveUserToStorage(state.user, state.token);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading.googleLogin = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.loading.logout = false;
        clearUserFromStorage();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading.logout = false;
        state.status = "failed";
      })

      .addCase(getUser.pending, (state) => {
        state.loading.getUser = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const userData = action.payload.user || action.payload;
        state.user = userData;
        state.isAuthenticated = true;
        state.token = state.token || null;
        state.loading.getUser = false;
        state.status = "succeeded";

        if (!localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.error = action.payload;
        state.loading.getUser = false;
        state.status = "failed";
      })

      .addCase(toggleThemeMode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleThemeMode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.themeMode = action.payload;
        state.themeMode = state.themeMode === "light" ? "dark" : "light";
        localStorage.setItem("theme", state.themeMode);
      
        if (state.user) {
          state.user.themeMode = action.payload;
          saveUserToStorage(state.user, state.token); // ✅ persist updated theme
        }
      
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", action.payload === "dark");
        }
      })
      .addCase(toggleThemeMode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading.updateUser = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading.updateUser = false;
        state.status = "succeeded";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading.updateUser = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(uploadProfilePhoto.pending, (state) => {
        state.loading.uploadPhoto = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.loading.uploadPhoto = false;
        state.status = "succeeded";
        if (state.user) {
          state.user.photo = action.payload;
        }
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.loading.uploadPhoto = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading.deleteUser = true;
        state.status = "idle";
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading.deleteUser = false;
        state.status = "success";
        clearUserFromStorage();
      })
      .addCase(deleteUser.rejected, (state) => {
        state.user = action.payload;
        state.token = action.payload.token;
        state.loading.deleteUser = false;
        state.isAuthenticated = true;
        state.status = "failed";
      });
  },
});

export const { logout, clearError, setUser } = userSlice.actions;
export default userSlice.reducer;
