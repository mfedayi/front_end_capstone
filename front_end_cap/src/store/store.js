import { configureStore } from "@reduxjs/toolkit";
import api from "../api/api"
import userAuthReducer from "../apiSlices/userSlice";
import favoritesAPI from "../apiSlices/favoritesSlice";

const store = configureStore({ // create the store so we can use the api slice
  reducer: { // add the api slice to the store
    [api.reducerPath]: api.reducer, // Include the api slice for caching and invalidation
    userAuth: userAuthReducer, // include the userAuth slice for user authentication so we can use the user data in the store
    [favoritesAPI.reducerPath]: favoritesAPI.reducer, // add the favoritesAPI reducer so we can use the endpoints in the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // add the api middleware to the store
});

export default store;