import api from "./api";

// API slice for fetching NBA team data.
const nbaAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeams: builder.query({
      // Fetches all NBA teams.
      query: () => ({
        url: `/teams`,
        method: "GET",
      }),
      providesTags: ["Teams"],
    }),
    getTeamDetails: builder.query({
      // Fetches details for a specific team by name.
      query: (teamName) => ({
        url: `/teams/${teamName}`,
        method: "GET",
      }),
      providesTags: ["Teams"],
    }),
  }),
});

export const { useGetAllTeamsQuery, useGetTeamDetailsQuery } = nbaAPI;
