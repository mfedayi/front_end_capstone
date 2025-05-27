import { useParams } from "react-router-dom";
import { useGetTeamDetailsQuery } from "../api/nbaAPI";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useAddFavoritesMutation,
  useRemoveFavoritesMutation,
  useGetFavoritesQuery,
} from "../apiSlices/favoritesSlice";

import "../styles/TeamDetailsPage.css";

import { useGetTeamNewsQuery } from "../apiSlices/newsSlice";

// TeamDetailsPage component for displaying detailed information about a specific NBA team.
const TeamDetailsPage = () => {
  const { teamName } = useParams();
  const { profile } = useSelector((state) => state.userAuth);
  const { data: favorites } = useGetFavoritesQuery();
  const navigate = useNavigate();

  const [addFavoriteTeam] = useAddFavoritesMutation();
  const [removeFavoriteTeam] = useRemoveFavoritesMutation();

  const { data: team, isLoading, error } = useGetTeamDetailsQuery(teamName);

  const {
    data: articles,
    isLoading: articleLoading,
    error: articleError,
  } = useGetTeamNewsQuery(teamName);

  const [isFavorite, setIsFavorite] = useState(false);

  console.log(`Team Name: ${teamName}`);

  useEffect(() => {
    // Checks if the current team is in the user's favorites and updates state.
    if (profile && team && favorites) {
      const isInFavorites = favorites.find(
        (fav) => fav.teamId === team?.teamId
      );
      setIsFavorite(isInFavorites);
    }
  }, [profile, team, favorites]); // Run this effect when profile, team, or favorites change
  
  const handleFavoriteClick = async () => {
    // Toggles the favorite status of the team for the logged-in user.
    if (isFavorite) {
      try {
        await removeFavoriteTeam({ teamId: team?.teamId });
        setIsFavorite(false);
      } catch (error) {
        console.error("Error removing favorite team:", error);
      }
    } else {
      console.log("Adding to favorites", team?.teamId);
      try {
        addFavoriteTeam({
          teamId: team?.teamId,
          userId: profile?.userId,
        });
        setIsFavorite(true); // Toggle the favorite status
      } catch (error) {
        console.error("Error adding favorite team:", error);
      }
    }
  };

  return (
    <>
      <div className="team-social-links">
        {team?.facebook && (
          <a
            href={`https://${team.facebook}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              class="bi bi-facebook"
              style={{ fontSize: "2rem", color: "#1877F2" }}
            ></i>
          </a>
        )}
        {team?.instagram && (
          <a
            href={`https://${team.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              class="bi bi-instagram"
              style={{ fontSize: "2rem", color: "#E1306C" }}
            ></i>
          </a>
        )}
        {team?.twitter && (
          <a
            href={`https://${team.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              class="bi bi-twitter-x"
              style={{ fontSize: "2rem", color: "#1DA1F2" }}
            ></i>
          </a>
        )}
        <a
          href={`https://www.youtube.com/@${team?.teamName?.replace(
            /\s+/g,
            ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i
            class="bi bi-youtube"
            style={{ fontSize: "2rem", color: "#FF0000" }}
          ></i>
        </a>
      </div>
      <div className="team-details-page">
        <div className="team-details-main">
          <section>
            <div className="team-details-container">
              {profile && ( // Only show the button if the user is logged in}
                <button
                  className={`basketball-button ${
                    isFavorite ? "liked" : "not-liked"
                  }`}
                  onClick={handleFavoriteClick}
                >
                  <i className="bi bi-dribbble"></i>
                  {isFavorite ? "Liked" : "Click to Like!"}
                </button>
              )}

              {/* Display team logo and name */}
              <div className="team-header">
                <img
                  src={team?.teamBadge}
                  alt={team?.teamName}
                  className="team-details-logo"
                />
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
                  <a
                    href={
                      team?.website?.startsWith("http")
                        ? team?.website
                        : `https://${team?.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer" // to prevent security issues
                  >
                    {team?.website}
                  </a>
                </p>
              </div>
              <div className="team-description">
                <article>{team?.description}</article>
              </div>
            </div>
          </section>
        </div>

        <aside className="team-news-sidebar">
          <section>
            <h4>Latest</h4>
            <ul>
              {articles?.slice(0, 7).map((article, idx) => (
                <li
                  key={idx}
                  onClick={() => window.open(article.url, "_blank")}
                >
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt={article.title} />
                  )}
                  <div>
                    <h6>
                      {article.title.length > 60
                        ? article.title.slice(0, 57) + "..."
                        : article.title}
                    </h6>
                    <small>
                      {article.author ||
                        article.source?.name ||
                        "Unknown Source"}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
};

export default TeamDetailsPage;
