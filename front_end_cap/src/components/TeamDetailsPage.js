import { useParams } from "react-router-dom";
import { useGetTeamDetailsQuery } from "../api/nbaAPI";

const TeamDetailsPage = () => {};
const { teamName } = useParams();

const { data: team, isLoding, error } = useGetTeamDetailsQuery(teamName);

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error loading team details</p>;

return (
  <div>
    <h1>{teamName}</h1>
    <img src={team.logo} alt={team.name} />
  </div>
);

export default TeamDetailsPage;
