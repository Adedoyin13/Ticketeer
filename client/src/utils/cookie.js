// cookies.js
import Cookies from "js-cookie";

// Set a cookie (e.g., authentication state or JWT token)
export const setCookie = (key, value, options = { expires: 7 }) => {
  Cookies.set(key, value, options); // Default expires in 7 days
};

// Get a cookie by key
export const getCookie = (key) => {
  return Cookies.get(key); // Returns the value of the cookie or undefined if it doesn't exist
};

// Remove a cookie by key
export const removeCookie = (key) => {
  Cookies.remove(key);
};