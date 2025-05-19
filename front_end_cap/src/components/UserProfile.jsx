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
    <div>
      <h2 className="profile-summary-header">Profile Summary</h2>
      <section className="user-info">
        {user.length === 0 ? (
          <p>No personal data yet.</p>
        ) : (
          <>
          <div className="user-info-row">
            <div className="user-info-item">
                <p className="label">Email</p>
                <p className="value">{user.email}</p>
              </div>
              <div className="user-info-item">
                <p className="label">Username</p>
                <p className="value">{user.username}</p>
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
            <div className="update-button-wrapper">
                <button
                  className="btn-update"
                  onClick={() => navigate(`/update-user/${user.id}`)}
                >
                  Update User
                </button>
              </div>
          </> 
        )}
      </section>

      {isSelf && (
        <section>
          <h2 className="favorites-header">Your Favorite Teams</h2>
          {favorites?.length === 0 ? (
            <p>No favorite teams yet.</p>
          ) : (
            <div className="favorites-container">
              {favorites?.map((team) => (
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
        </section>
      )}
    </div>
  );
};

export default UserProfile;