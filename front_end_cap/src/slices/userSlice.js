import api from "../store/api";
import { createSlice } from "@reduxjs/toolkit";

const usersAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ firstname, lastname, username, email, password }) => ({
        url: `/user/register`,
        method: "POST",
        body: {
          firstname,
          lastname,
          email,
          username,
          password,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    // getProfile: builder.query({
    //   query: () => ({
    //     url: "/user/me",
    //     method: "GET",
    //   }),
    //   providesTags: ["Users"],
    // }),

    // getReservations: builder.query({
    //   query: () => ({
    //     url: "/reservations",
    //     method: "GET",
    //   }),
    //   providesTags: ["Users"],
    // }),

    // getReservations: builder.query({
    //   query: () => ({
    //     url: "/reservations",
    //     method: "GET",
    //   }),
    //   providesTags: ["Res"],
    // }),

    getLogin: builder.mutation({
      query: ({ username, password }) => ({
        url: `/user/login`,
        method: "POST",
        body: {
          username,
          password,
        },
      }),
      providesTags: ["Users"],
    }),
  }),
});
const storeToken = (state, { payload }) => {
  localStorage.setItem("token", payload.token);
};
const userSlice = createSlice({
  name: "register",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.register.matchFulfilled, storeToken);
    builder.addMatcher(api.endpoints.getLogin.matchFulfilled, storeToken);
  },
});

export default userSlice.reducer;
export const { useRegisterMutation, useGetLoginMutation } =
  usersAPI;
