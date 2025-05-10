import api from "./api";

//const NBA_API_URL = "https://www.thesportsdb.com/api/v1/json/3/";

const nbaAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeams: builder.query({
      query: () => ({
        //url: `${NBA_API_URL}search_all_teams.php?l=NBA`,
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
