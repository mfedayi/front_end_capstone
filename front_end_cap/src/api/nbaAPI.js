import api from "./api";

//const NBA_API_URL = "https://www.thesportsdb.com/api/v1/json/3/";

const nbaAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // Fetch all NBA teams
    getAllTeams: builder.query({
      query: () => ({
        //url: `${NBA_API_URL}search_all_teams.php?l=NBA`,
        url: `/teams`,
        method: "GET",
      }),
      providesTags: ["Teams"],
    }),
    
    // Fetch team details by team name
    getTeamDetails: builder.query({
      query: (teamName) => ({
        url: `/teams/${teamName}`,
        method: "GET",
      }),
      providesTags: ["Teams"],
    }),
    
    // Fetch team roster by team ID
    getTeamRoster: builder.query({ 
      query: (idTeam) => ({
        url: `/teams/players/${idTeam}`,
        method: "GET",
      }),
      providesTags: ["Teams"], // Cache the response with the "Teams" tag
    }),
  }),
});

export const { useGetAllTeamsQuery, useGetTeamDetailsQuery, useGetTeamRosterQuery } = nbaAPI;
