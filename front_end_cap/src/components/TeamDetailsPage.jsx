import { useParams } from "react-router-dom";
import { useGetTeamDetailsQuery, useGetTeamRosterQuery } from "../api/nbaAPI";

const TeamDetailsPage = () => {
  const { teamName } = useParams();

  // Fetch team details using the team name from the URL
  const { data: teamDetails, isLoading: loadingDetails, error: errorDetails } = useGetTeamDetailsQuery(teamName);

  // Fetch team roster using the team ID from the team details
  const { data: teamRoster, isLoading: loadingRoster, error: errorRoster } = useGetTeamRosterQuery(teamDetails?.teamId);

  if (loadingDetails || loadingRoster) return <p>Loading...</p>;
  if (errorDetails || errorRoster) return <p>Error loading team details or roster</p>;

  return (
    <div className="team-details-container">
      {/* Display team logo and name */}
      <div className="team-header">
      <img 
      src={teamDetails?.teamLogo} 
      alt={teamDetails?.teamName}
      className="team-details-logo"
      />
      <h2 className="team-details-name">{teamDetails?.teamName}</h2> 
    </div>

    {/* Create two columns for team details and roster */}
    <div className="team-details-content">
      <div className="team-roster">
        <h3>Team Roster</h3>
        <ul>
          {teamRoster?.map((player) => (
            <li key={player.idPlayer}>
              <img 
                src={player.cutout} 
                alt={player.name} 
                className="player-image" 
              />
              <p>{player.name}</p>
              <p>{player.position}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="team-info">
        <h3>Team Information</h3>
        <p><strong>Founded:</strong> {teamDetails?.formedYear}</p>
        <p><strong>Stadium:</strong> {teamDetails?.stadium}</p>
        <p><strong>Location:</strong> {teamDetails?.city}</p>
        <p><strong>Website:</strong> <a href={`https://${teamDetails?.website}`} target="_blank" rel="noopener noreferrer">{teamDetails?.website}</a></p>
        <p><strong>Description:</strong> {teamDetails?.description}</p>
      </div>
    </div>
  </div>
  );
};

export default TeamDetailsPage;

