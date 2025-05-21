
import api from "../api/api";

const newsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamNews: builder.query({
      query: (teamName) => `/news/team/${teamName}`,
      transformResponse: (response) => response, // Only return the articles array from the Object
      providesTags: ["News"],
    }),
  }),
});

export const { useGetTeamNewsQuery } = newsAPI;
