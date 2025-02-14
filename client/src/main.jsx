import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/merriweather";
import "@fontsource/inter";
import "@fontsource/cormorant-garamond";
import "@fontsource/spectral";
import "@fontsource/lora";
import "@fontsource/quicksand";
import "@fontsource/poppins";
import "@fontsource/montserrat";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <UserProvider> */}
      <BrowserRouter>
        <ToastContainer position="top-right" />
        <App />
      </BrowserRouter>
    {/* </UserProvider> */}
  </StrictMode>
);
