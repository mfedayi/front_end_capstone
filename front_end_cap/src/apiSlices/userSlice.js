import api from "../api/api";
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
      invalidatesTags: ["Users", "Me"],
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
      invalidatesTags: ["Me"],
    }),

    getAllUsers: builder.query({
      query: () => "/user",
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
        url: `/user/${userId}`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["Users", "Me"],
    }),

    updateMe: builder.mutation({
      query: ({ ...userData }) => ({
        url: `/user/me`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["Users", "Me"],
    }),

    getMe: builder.query({
      query: () => "/user/me",
      providesTags: ["Me"],
    }),

    getPublicUserProfile: builder.query({
      query: (userId) => `/user/public/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Users", id: userId }],
    }),
  }),
});

const storeTokenAndSetAuthStatus = (state, { payload }) => {
  localStorage.setItem("token", payload.token);
  state.isLoggedIn = true;
};

const storeProfile = (state, { payload }) => {
  state.profile = payload;
  state.isLoggedIn = true;
};

const clearProfileAndToken = (state) => {
  state.profile = null;
  state.isLoggedIn = false;
  localStorage.removeItem("token");
};

const userSlice = createSlice({
  name: "userAuth",
  initialState: {
    profile: null,
    isLoggedIn: !!localStorage.getItem("token"),
  },
  reducers: {
    logout: (state) => {
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
