import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPublicUserProfileQuery } from '../apiSlices/userSlice';
import { useGetUserPublicFavoritesQuery } from '../apiSlices/favoritesSlice';
import '../styles/profile-theme.css'; 

// PublicUserProfile component displays a non-editable view of a user's profile and their favorite teams.
const PublicUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading, error: userError } = useGetPublicUserProfileQuery(userId);
  const { data: favorites, isLoading: favLoading, error: favError } = useGetUserPublicFavoritesQuery(userId, {
    skip: !user, 
  }); // Skip fetching favorites if user data hasn't loaded yet.

  if (userLoading || favLoading) return <p className="text-center mt-5">Loading profile...</p>;
  if (userError) return <p className="text-center mt-5 text-danger">Error loading user: {userError.data?.error || userError.status}</p>;

  if (!user) return <p className="text-center mt-5">User not found.</p>;

  return (
    <div className="container mt-4">
      <h2 className="profile-summary-header">{user.username}'s Profile</h2>
      <section className="user-info" style={{ maxWidth: '600px', margin: '1.5rem auto 2rem auto' }}> {/* Inline style for centering and max-width of this section */}
        <div className="user-info-item">
          <p className="label">Username</p>
          <p className="value">{user.username}</p>
        </div>
        <div className="user-info-item">
          <p className="label">Member Since</p>
          <p className="value">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </section>

      <section>
        <h3 className="favorites-header" style={{ fontSize: '1.5rem' }}>Favorite Teams</h3> {/* Inline style for custom font size */}
        {favError && <p className="text-center text-warning small">Could not load favorite teams.</p>}
        {!favError && favorites?.length === 0 && (
          <p className="text-center">This user has no favorite teams yet.</p>
        )}
        {!favError && favorites && favorites.length > 0 && (
          <div className="favorites-container">
            {favorites.map((team) => (
              <div
                key={team.teamId}
                className="favorite-team-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/teams/${team.teamName}`)}
                title={`View details for ${team.teamName}`}
              >
                <img src={team.teamLogo} alt={team.teamName} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=No+Logo'; }} />
                <p>{team.teamName}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PublicUserProfile;
