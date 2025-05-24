import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetPublicUserProfileQuery } from '../apiSlices/userSlice';
import { useGetUserPublicFavoritesQuery } from '../apiSlices/favoritesSlice';
import '../styles/profile-theme.css'; 

const PublicUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading, error: userError } = useGetPublicUserProfileQuery(userId);
  const { data: favorites, isLoading: favLoading, error: favError } = useGetUserPublicFavoritesQuery(userId, {
    skip: !user, 
  });

  if (userLoading || favLoading) return <p className="text-center mt-5">Loading profile...</p>;
  if (userError) return <p className="text-center mt-5 text-danger">Error loading user: {userError.data?.error || userError.status}</p>;
  if (!user) return <p className="text-center mt-5">User not found.</p>;

  return (
    <div className="profile-bg">
      <div className="profile-page-container">
        <div className="profile-card">
          <h2 className="profile-summary-header">{user.username}'s Profile</h2>
      
          <div className="profile-avatar-card">
          <div className="avatar-circle">
            {user.firstname?.[0] ? (
              <span>{user.firstname[0].toUpperCase()}</span>
            ) : (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png"
                alt="Basketball Avatar"
                className="avatar-icon"
              />
           )}
          </div>
          <p className="avatar-name">{user.username}</p>
        </div>

      <div className="user-info-grid">
        <div className="user-info-item">
          <p className="label">Username</p>
          <p className="value">{user.username}</p>
        </div>
        <div className="user-info-item">
          <p className="label">Member Since</p>
          <p className="value">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
  
      <div className="favorites-section">
        <h3 className="favorites-summary-header">Favorite Teams</h3>
        <div className="favorites-subbox">
          {favError && <p className="text-center text-warning small">Could not load favorite teams.</p>}
          {!favError && favorites?.length === 0 && (
            <p className="text-center">This user has no favorite teams yet.</p>
          )}
          {!favError && favorites?.length > 0 && (
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
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PublicUserProfile;
