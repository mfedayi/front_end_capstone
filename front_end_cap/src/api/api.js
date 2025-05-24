import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = `https://backend-capstone-dt11.onrender.com/api`;

// Base API configuration using RTK Query.
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Defines tag types for caching and invalidation.
  tagTypes: ["Users", "Favorites", "Posts", "Teams", "Me", "Replies", "News"],
  endpoints: () => ({}),
});

export default api;
