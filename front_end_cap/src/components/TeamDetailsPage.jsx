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

import { useGetTeamNewsQuery } from "../apiSlices/newsSlice";

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

  // Check if the team is already a favorite when page loads
  useEffect(() => {
    if (profile && team && favorites) {
      const isInFavorites = favorites.find(
        (fav) => fav.teamId === team?.teamId
      );
      setIsFavorite(isInFavorites);
    }
  }, [profile, team, favorites]); // Run this effect when profile, team, or favorites change

  const handleFavoriteClick = async () => {
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

  // if (isLoading || articleLoading) return <p>Loading...</p>;
  // if (error || articleError) return <p>Error loading team details</p>;

  return (
    <>
      <section>
        <div className="team-details-container">
          {/* Heart button to add/remove from favorites */}
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
            <p>{team?.description}</p>
          </div>
        </div>
      </section>
      <section>
        <div className="container mt-4 team-grid favorites-container ">
          {articles?.slice(0, 5).map((article) => (
            <div
              key={article.title}
              className="team-card"
              onClick={() => window.open(article.url, "_blank")}
              style={{ cursor: "pointer" }}
            >
              <div>
                <h4>{article.title}</h4>
              </div>
              <div>
                <h5>{article.author}</h5>
              </div>
              <div>
                <h5>{article.source.name}</h5>
              </div>
              <div>
                <p>{article.description}</p>
              </div>
              <div>
                <img src={article.urlToImage} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default TeamDetailsPage;
