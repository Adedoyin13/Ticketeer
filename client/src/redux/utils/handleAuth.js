import { logoutUser } from "../reducers/userSlice";
import store from "../store/store";

export const handleAuthError = (error) => {
  if (error.response && error.response.status === 401) {
    store.dispatch(logoutUser()); // Dispatch logout action
    window.location.href = "/login"; // Redirect to login page
  }
  return Promise.reject(error);
};