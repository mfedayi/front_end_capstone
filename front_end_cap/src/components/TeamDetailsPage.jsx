import { useParams } from "react-router-dom";
import { useGetTeamDetailsQuery } from "../api/nbaAPI";
import { useState, useEffect } from "react";
// to access the Redux store so we can get the userId from the store, 
// and to dispatch actions to add/remove a team from favorites
import { useSelector, useDispatch } from "react-redux"; 
import { useAddFavoritesMutation, useRemoveFavoritesMutation, useGetFavoritesQuery } from "../apiSlices/favoritesSlice"; // to add a team to favorites
import axios from "axios"; // to make API calls


const TeamDetailsPage = () => {
  const { teamName } = useParams();
  const { profile } = useSelector((state) => state.userAuth); // to get the userId from the Redux store
  const { data: favorites } = useGetFavoritesQuery(); // to get the favorite teams from the Redux store
  const dispatch = useDispatch(); // to dispatch actions to the Redux store
  const [addFavoriteTeam] = useAddFavoritesMutation(); // to add a team to favorites
  const [removeFavoriteTeam] = useRemoveFavoritesMutation(); // to remove a team from favorites
  const { data: team, isLoading, error } = useGetTeamDetailsQuery(teamName);
  const [isFavorite, setIsFavorite] = useState(false); // to check if the team is already a favorite

  // Check if the team is already a favorite when page loads
  useEffect(() => {
        if (profile && team && favorites) {
          const isInFavorites = favorites.find((fav) => fav.teamId === team?.teamId); // Check if the team is in the favorites array
          setIsFavorite(isInFavorites); // Set the isFavorite state based on the result
        }
  }, [profile, team, favorites]); // Run this effect when profile, team, or favorites change

  // Function to update the favorite status
  const handleFavoriteClick = async () => {
    if (isFavorite) {
      try {
      await removeFavoriteTeam({ teamId: team?.teamId }); // Remove the team from favorites;
      setIsFavorite(false); // Set the isFavorite state to false
      }
      catch (error) {
        console.error("Error removing favorite team:", error); // Log the error if it occurs
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
      console.error("Error adding favorite team:", error); // Log the error if it occurs
    }
  }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading team details</p>;

  return (
    <div className="team-details-container">
      {/* Heart button to add/remove from favorites */}
      {profile && ( // Only show the button if the user is logged in}
        <button
        className={`basketball-button ${isFavorite ? "liked" : "not-liked"}`} 
        onClick={handleFavoriteClick}>  
                  <i className="bi bi-dribbble"></i>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites!"}
        </button>
      )}

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