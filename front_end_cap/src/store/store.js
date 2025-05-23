import { configureStore } from "@reduxjs/toolkit";
import api from "../api/api"
import userAuthReducer from "../apiSlices/userSlice";

// Configures the Redux store for the application.
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // API slice for RTK Query
    userAuth: userAuthReducer,      // Slice for user authentication state
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Adds RTK Query middleware
});

export default store;