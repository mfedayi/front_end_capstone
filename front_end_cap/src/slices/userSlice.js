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

    getLogin: builder.mutation({
      query: ({ username, password }) => ({
        url: `/user/login`,
        method: "POST",
        body: {
          username,
          password,
        },
      }),
    }),

    getAllUsers: builder.query({
      query: () => "/user",
      url: "/user",
      method: "GET",
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    getSingleUser: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: ["Users"],
    }),

    updateUser: builder.mutation({
      query: ({ userId, ...userData }) => ({
        url: "/user/${userId}",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

const storeToken = (state, { payload }) => {
  localStorage.setItem("token", payload.token);
};

const userSlice = createSlice({
  name: "userAuth",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(usersAPI.endpoints.register.matchFulfilled, storeToken);
    builder.addMatcher(usersAPI.endpoints.getLogin.matchFulfilled, storeToken);
  },
});

export default userSlice.reducer;

export const {
  useRegisterMutation,
  useGetLoginMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetSingleUserQuery,
} = usersAPI;
