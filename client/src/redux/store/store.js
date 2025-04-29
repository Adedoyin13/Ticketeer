import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import logger from "redux-logger";
import storage from "redux-persist/lib/storage";
import userReducer from "../reducers/userSlice";
import eventReducer from "./../reducers/eventSlice";
import locationReducer from "./../reducers/locationSlice";
import walletReducer from "./../reducers/walletSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    events: eventReducer,
    location: locationReducer,
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger),
});

export const persistor = persistStore(store);
export default store;