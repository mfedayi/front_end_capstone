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

    getMe: builder.query({
      query: () => "/user/me",
      providesTags: ["Me"],
    }),
  }),
});

const storeToken = (state, { payload }) => {
  localStorage.setItem("token", payload.token);
};

const storeProfile = (state, { payload }) => {
  state.profile = payload;
  state.isLoggedIn = true;
};

const clearProfileAndToken = (state) => {
  state.profile = null;
  localStorage.removeItem("token");
};

const userSlice = createSlice({
  name: "userAuth",
  initialState: { profile: null },
  reducers: {
    storeUserProfile: (state, { payload }) => {
      storeProfile(state, { payload });
    },
    logout: (state) => {
      clearProfileAndToken(state);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(usersAPI.endpoints.register.matchFulfilled, storeToken);
    builder.addMatcher(usersAPI.endpoints.getLogin.matchFulfilled, storeToken);
    builder.addMatcher(usersAPI.endpoints.getMe.matchFulfilled, storeProfile);
  },
});

export const { logout, storeUserProfile } = userSlice.actions;
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
} = usersAPI;
