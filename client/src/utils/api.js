import axios from "axios";
import { logoutUser } from "../redux/reducers/userSlice";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

// ✅ Use a function to set dispatch dynamically (fixes circular dependency)
export const setupInterceptors = (dispatch) => {
  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        dispatch(logoutUser());
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

// api.interceptors.response.use(
//   (response) => response, 
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       dispatch(logoutUser()); // ✅ Dispatch logout properly
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default api;