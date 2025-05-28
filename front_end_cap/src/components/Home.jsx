import { useState, useEffect, use } from "react";
import { useGetAllTeamsQuery } from "../api/nbaAPI";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

// Home component displaying a list of NBA teams and a search bar.
const Home = (props) => {
  const navigate = useNavigate();
  const { data: teams, isLoading, isError, error } = useGetAllTeamsQuery();
  const [searchTerm, setSearchTerm] = useState(""); 
  const { isNavbarExpanded } = props;

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, [searchTerm]);

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
    <div className="container mt-4" style={{ position: "relative" }}> 
      <div className={`nba-heading sticky-top ${isNavbarExpanded ? 'navbar-expanded-transparent-bg' : ''}`}>
       <span className="nba-teams-title">NBA Teams</span>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by team name..."
            className="search-input"
            value={searchTerm}
            onChange={ (e) => setSearchTerm(e.target.value)} 
          />
          {searchTerm && (
            <button 
              className="clear-search-button" 
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              &times; {/* This is the 'X' character */}
            </button>
          )}
        </div>
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
