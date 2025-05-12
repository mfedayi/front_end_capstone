import { useParams } from "react-router-dom";
import { useGetTeamDetailsQuery } from "../api/nbaAPI";

const TeamDetailsPage = () => {
  const { teamName } = useParams();

  const { data: team, isLoading, error } = useGetTeamDetailsQuery(teamName);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading team details</p>;

  return (
    <div className="team-details-container">
      {/* Display team logo and name */}
      <div className="team-header">
      <img src={team?.teamLogo} alt={team?.teamName} 
      className="team-details-logo" />
      <h2 className="team-details-name">{team?.teamName}</h2>
    </div>

    {/* Display team details */}
    <div className="team-details-content">
      <div className="team-info">
        <h3>Team Information</h3>
        <p><strong>Founded:</strong> {team?.formedYear}</p>
        <p><strong>Stadium:</strong> {team?.stadium}</p>
        <p><strong>Location:</strong> {team?.city}</p>
        <p><strong>Website:</strong> <a href={team?.website} target="_blank" rel="noopener noreferrer">{team?.website}</a></p>
        <p>{team?.description}</p>
      </div>
    </div>
  </div>
  );
};

export default TeamDetailsPage;
