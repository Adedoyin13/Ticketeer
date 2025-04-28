// utils/authStorage.js
export const saveUserToStorage = (user, token, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(user));
    storage.setItem("token", token);
  };
  
  export const loadUserFromStorage = () => {
    const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
    const user = JSON.parse(storage.getItem("user") || "null");
    const token = storage.getItem("token");
    return { user, token };
  };
  
  export const clearUserFromStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };
  