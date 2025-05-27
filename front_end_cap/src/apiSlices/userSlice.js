import api from "../api/api";
import { createSlice } from "@reduxjs/toolkit";

// API slice for user authentication and management.
const usersAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      // Registers a new user.
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
      invalidatesTags: ["Users", "Me"],
    }),
    getLogin: builder.mutation({
      // Logs in an existing user.
      query: ({ username, password }) => ({
        url: `/user/login`,
        method: "POST",
        body: {
          username,
          password,
        },
      }),
      invalidatesTags: ["Me"],
    }),
    getAllUsers: builder.query({
      // Fetches all users (Admin only).
      query: () => "/user",
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      // Deletes a specific user (Admin only).
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getSingleUser: builder.query({
      // Fetches details for a single user by ID.
      query: (userId) => `/user/${userId}`,
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      // Updates a specific user's details (Admin only).
      query: ({ userId, ...userData }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["Users", "Me"],
    }),
    updateMe: builder.mutation({
      // Allows the authenticated user to update their own profile.
      query: ({ ...userData }) => ({
        url: `/user/me`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["Users", "Me"],
    }),
    getMe: builder.query({
      // Fetches the profile of the currently authenticated user.
      query: () => "/user/me",
      providesTags: ["Me"],
    }),
    getPublicUserProfile: builder.query({
      // Fetches a limited public profile for any user.
      query: (userId) => `/user/public/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Users", id: userId }],
    }),
  }),
});

// Helper function to store token and set auth status in Redux state.
const storeTokenAndSetAuthStatus = (state, { payload }) => {
  localStorage.setItem("token", payload.token);
  state.isLoggedIn = true;
};

// Helper function to store user profile data in Redux state.
const storeProfile = (state, { payload }) => {
  state.profile = payload;
  state.isLoggedIn = true;
};

// Helper function to clear profile and token from Redux state and localStorage.
const clearProfileAndToken = (state) => {
  state.profile = null;
  state.isLoggedIn = false;
  localStorage.removeItem("token");
};

const userSlice = createSlice({
  // Redux slice for managing user authentication state.
  name: "userAuth",
  initialState: {
    profile: null,
    isLoggedIn: !!localStorage.getItem("token"),
  },
  reducers: {
    logout: (state) => {
      // Action to log out the user.
      clearProfileAndToken(state);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      usersAPI.endpoints.register.matchFulfilled,
      storeTokenAndSetAuthStatus
    );
    builder.addMatcher(
      usersAPI.endpoints.getLogin.matchFulfilled,
      storeTokenAndSetAuthStatus
    );
    builder.addMatcher(usersAPI.endpoints.getMe.matchFulfilled, storeProfile);
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;

export const {
  useRegisterMutation,
  useGetLoginMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetSingleUserQuery,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useGetPublicUserProfileQuery,
} = usersAPI;
