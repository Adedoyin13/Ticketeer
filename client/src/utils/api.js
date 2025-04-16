// api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

let store;

export const injectStore = (_store) => {
  store = _store;
};

api.interceptors.request.use((config) => {
  const state = store?.getState();
  const user = state?.user?.user;

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const user = store?.getState()?.user?.user;

    if (error.response?.status === 401 && user) {
      store.dispatch({ type: "user/logout" }); // replace with your logout action
    }

    return Promise.reject(error);
  }
);

export default api;