import api from "../api/api";

// API slice for managing user favorite teams.
const favoritesAPI = api.injectEndpoints({ 
  endpoints: (builder) => ({
    addFavorites: builder.mutation({ 
      // Adds a team to the user's favorites.
      query: ({ teamId, teamName, teamLogo }) => ({
        url: `/favorites/${teamId}`,
        method: "POST",
        body: {
          teamId,
          teamName,
          teamLogo,
        },
      }),
      invalidatesTags: ["Favorites"], 
    }),
    removeFavorites: builder.mutation({
      // Removes a team from the user's favorites.
      query: ({ teamId }) => ({
        url: `/favorites/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
    }),
    getFavorites: builder.query({
      // Gets the current user's favorite teams.
      query: () => "/favorites",
      providesTags: ["Favorites"],
    }),
    getUserPublicFavorites: builder.query({
      // Gets the public list of favorite teams for a specific user.
      query: (userId) => `/favorites/public/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Favorites", id: `public-${userId}` }], // Unique tag for public favorites
    }),
  }),
});

export const {useAddFavoritesMutation, useRemoveFavoritesMutation, useGetFavoritesQuery, useGetUserPublicFavoritesQuery} = favoritesAPI;

export default favoritesAPI;