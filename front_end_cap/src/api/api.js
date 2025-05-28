import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL = `https://backend-capstone-dt11.onrender.com/api`;
const API_URL = `http://localhost:3000/api`;

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
  tagTypes: ["Users", "Favorites", "Posts", "Teams", "Me", "Replies", "News"],
  endpoints: () => ({}),
});

export default api;
