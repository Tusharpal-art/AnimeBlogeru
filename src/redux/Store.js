import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice";
import { blogApi } from "../services/apiSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { apiLogger } from "../services/apiLogger";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "auth",
  storage,
  // Sirf 'auth' ko save karenge, 'blogApi' ko nahi
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    // API reducer ko dynamic path pe add karein
    [blogApi.reducerPath]: blogApi.reducer,
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(blogApi.middleware)
      .concat(apiLogger), // API Middleware zaroori hai
});

export const persister = persistStore(store);
