import { useGetMeQuery, useGetSingleUserQuery } from "../apiSlices/userSlice";
import { useGetFavoritesQuery } from "../apiSlices/favoritesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/profile-theme.css";

const UserProfile = () => {
  const { userId } = useParams();
  const { profile } = useSelector((state) => state.userAuth);
  const { data: user, isLoading: userLoading } = useGetSingleUserQuery(userId);
  const { data: favorites, isLoading: favLoading } = useGetFavoritesQuery(
    profile?.id
  );

  const isSelf = profile?.id === userId;
  const navigate = useNavigate();

  if (userLoading || favLoading) return <p>Loading...</p>;
  if (!user) return <p>User Not Found</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Personal Man Cave</h2>

      <section className="profile-card">
        {user.length === 0 ? (
          <p>No personal data yet.</p>
        ) : (
          <ul className="list-unstyled">
            <li key={user.id}>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Name:</strong> {user.firstname} {user.lastname}
              </p>
              <p>
                <strong>Member since:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <button
                className="btn btn-warning mt-2 profile-update-btn"
                onClick={() => navigate(`/update-user/${user.id}`)}
              >
                Update User
              </button>
            </li>
          </ul>
        )}
      </section>

      {isSelf && (
        <section className="favorites-section">
          <h2 className="favorites-title">Your Favorite Teams:</h2>
          {favorites?.length === 0 ? (
            <p>No favorite teams yet.</p>
          ) : (
            <ul className="favorites-list">
              {favorites?.map((team) => (
                <li key={team.teamId} className="favorite-team">
                  <img
                    src={team.teamLogo}
                    alt={team.teamName}
                    className="team-logo"
                  />
                  <p className="team-name">{team.teamName}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default UserProfile;
