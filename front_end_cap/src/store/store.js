import { configureStore } from "@reduxjs/toolkit";
import api from "./api";
import reducer from "../slices/userSlice";
import userAuthReducer from "../slices/userSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    userAuth: userAuthReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
