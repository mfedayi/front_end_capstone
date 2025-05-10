import { configureStore } from "@reduxjs/toolkit";
import api from "../api/api"
import reducer from "../apiSlices/userSlice";
import userAuthReducer from "../apiSlices/userSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    userAuth: userAuthReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
