import api from "../api/api";

// API slice for fetching team-specific news articles.
const newsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamNews: builder.query({
      // Fetches news articles related to a specific team name.
      query: (teamName) => `/news/team/${teamName}`,
      providesTags: ["News"],
    }),
  }),
});

export const { useGetTeamNewsQuery } = newsAPI;
