import api from "./api";

const nbaAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeams: builder.query({
      query: () => ({
        url: `/teams`,
        method: "GET",
      }),
      providesTags: ["Teams"],
    }),
    getTeamDetails: builder.query({
      query: (teamName) => ({
        url: `/teams/${teamName}`,
        method: "GET",
      }),
      providesTags: ["Teams"],
    }),
  }),
});

export const { useGetAllTeamsQuery, useGetTeamDetailsQuery } = nbaAPI;
