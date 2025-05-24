import { useGetMeQuery, useGetSingleUserQuery } from "../apiSlices/userSlice";
import { useGetFavoritesQuery } from "../apiSlices/favoritesSlice.js";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/profile-theme.css";

const UserProfile = () => {
  const { userId } = useParams();
  const { profile } = useSelector((state) => state.userAuth);
  const { data: user, isLoading: userLoading } = useGetSingleUserQuery(userId);
  const { data: favorites, isLoading: favLoading } = useGetFavoritesQuery(profile?.id);
  const navigate = useNavigate();

  const isSelf = profile?.id === userId;
  if (userLoading || favLoading) return <p>Loading...</p>;
  if (!user) return <p>User Not Found</p>;

  return (
  <div className="profile-bg">
    <div className="profile-page-container">
    {/* Profile Summary */}
    <div className="profile-card">
      <div className="update-button-wrapper">
        <button className="btn-update" onClick={() => navigate(`/update-user/${user.id}`)}>
          Update User
        </button>
      </div>

    <h2 className="profile-summary-header">Profile Summary</h2>
      
    <div className="profile-avatar-card">
      <div className="avatar-circle">
        {user.firstname?.[0]?.toUpperCase() || "U"}
      </div>
      <p className="avatar-name">{user.username}</p>
    </div>

    <div className="user-info-grid">
      <div className="user-info-item">
          <p className="label">Email</p>
          <p className="value">{user.email}</p>
        </div>
        <div className="user-info-item">
          <p className="label">Name</p>
          <p className="value">{user.firstname} {user.lastname}</p>
        </div>
        <div className="user-info-item">
          <p className="label">Member Since</p>
          <p className="value">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    </div>

    {/* Favorite Teams */}
    {isSelf && (
        <div className="favorites-section">
          <h2 className="favorites-summary-header">Favorite Teams</h2>

          <div className="favorites-subbox">
          {favorites?.length === 0 ? (
            <p>No favorite teams yet.</p>
          ) : (
            <div className="favorites-container">
              {favorites.map((team) => (
                <div key={team.teamId} className="favorite-team-card"
                    role="button"
                    tabIndex={0} 
                    onClick={() => navigate(`/teams/${team.teamName}`)}
                >
                  <img src={team.teamLogo} alt={team.teamName} />
                  <p>{team.teamName}</p>
               </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
    </div>
  </div>
  );
  };

export default UserProfile;