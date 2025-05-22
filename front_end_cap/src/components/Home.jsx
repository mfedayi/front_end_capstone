import { useState } from "react";
import { useGetAllTeamsQuery } from "../api/nbaAPI";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const Home = () => {
  const navigate = useNavigate();
  const { data: teams, isLoading, isError, error } = useGetAllTeamsQuery();
  const [searchTerm, setSearchTerm] = useState(""); 


  if (isLoading) {
    return <h1>is loading...</h1>;
  }

  if (isError) {
    return (
      <h1>Error: {error?.data?.message || error?.status || "Unknown error"}</h1>
    );
  }

  const filteredTeams = teams?.filter((team) =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <div className="home-bg">
    <div className="container mt-4" style={{ position: "relative" }}> {/* Background image styling */}
      <div className="nba-heading">
        NBA Teams
        <input
          type="text"
          placeholder="Search by team name..."
          className="search-input"
          value={searchTerm}
          onChange={ (e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="team-grid"> 
      {filteredTeams?.map((team) => (
        <div
          key={team.teamId}
          className="team-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/teams/${team.teamName}`)}
        >
          <img
            src={team.teamLogo}
            alt={team.teamName}
            className="team-logo"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"; 
            }}
          />
          <h5>{team.teamName}</h5>
        </div>
      ))}
      </div>
    </div>
  </div>
  );
};

export default Home;
