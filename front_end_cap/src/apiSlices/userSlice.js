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
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

const storeToken = (state, { payload }) => {
  localStorage.setItem("token", payload.token);
  state.isLoggedIn = true;
};

const userSlice = createSlice({
  name: "userAuth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setLoggedIn(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      localStorage.removeItem("token");
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(usersAPI.endpoints.register.matchFulfilled, storeToken);
    builder.addMatcher(usersAPI.endpoints.getLogin.matchFulfilled, storeToken);
  },
});
const { setLoggedIn, logout } = userSlice.actions;
export default userSlice.reducer;

export const {
  useRegisterMutation,
  useGetLoginMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetSingleUserQuery,
} = usersAPI;
