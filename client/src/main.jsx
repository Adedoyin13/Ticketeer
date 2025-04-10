import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store/store";

import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";

import "@fontsource/merriweather";
import "@fontsource/inter";
import "@fontsource/cormorant-garamond";
import "@fontsource/spectral";
import "@fontsource/lora";
import "@fontsource/quicksand";
import "@fontsource/poppins";
import "@fontsource/montserrat";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer position="top-right" />
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);