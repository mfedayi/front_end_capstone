import { useParams } from "react-router-dom";
import { useGetTeamDetailsQuery } from "../api/nbaAPI";

const TeamDetailsPage = () => {
  const { teamName } = useParams();
  const { data: team, isLoading, error } = useGetTeamDetailsQuery(teamName);

  console.log("Team Details:", team);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading team details</p>;

  return (
    <div className="team-details-container">
      {/* Display team logo and name */}
      <div className="team-header">
      <img src={team?.teamBadge} alt={team?.teamName} 
      className="team-details-logo" />
      <h2 className="team-details-name">{team?.teamName}</h2>
    </div>

    {/* Display team details */}
      <div className="team-info">
        <h3>Team Information</h3>
        <div className="team-info-details">
          <div> 
            <strong>Founded</strong> 
            <p>{team?.formedYear}</p>
          </div>
          <div>
            <strong>Stadium</strong>
            <p>{team?.stadium}</p>
          </div>
          <div>
            <strong>Location</strong>
            <p>{team?.city}</p>
          </div>
        </div>
        <p>
          <a href={team?.website?.startsWith('http') ? team?.website : `https://${team?.website}`} 
        target="_blank" 
        rel="noopener noreferrer" // to prevent security issues
        >
          {team?.website}
          </a>
        </p>
      </div>

      <div className="team-description">
        <p>{team?.description}</p>
      </div>
    </div>
  );
};
export default TeamDetailsPage;
