import api from "../api/api";
// This slice is used to manage the favorites of the user
// It allows the user to add, delete and get their favorite teams

// add a favorite team by id
const favoritesAPI = api.injectEndpoints({ 
  endpoints: (builder) => ({
    addFavorites: builder.mutation({ 
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
    // delete a favorite team by id
    removeFavorites: builder.mutation({
      query: ({ teamId }) => ({
        url: `/favorites/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
    }),
    // get all favorite teams
    getFavorites: builder.query({
      query: () => "/favorites",
      providesTags: ["Favorites"],
    }),
  }),
});

export const {useAddFavoritesMutation, useRemoveFavoritesMutation, useGetFavoritesQuery} = favoritesAPI; // export the hooks for the endpoints

export default favoritesAPI; // export the api slice