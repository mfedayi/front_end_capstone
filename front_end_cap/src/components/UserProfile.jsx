import { useGetMeQuery, useGetSingleUserQuery } from "../apiSlices/userSlice";
import { useGetFavoritesQuery } from "../apiSlices/favoritesSlice.js";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetTeamNewsQuery } from "../apiSlices/newsSlice"; // Import the news query
import "../styles/profile-theme.css";

// Sub-component to display news for a single favorited team
const TeamNewsFeed = ({ teamName }) => {
  const { data: articles, isLoading, error } = useGetTeamNewsQuery(teamName);

  if (isLoading)
    return <p className="text-muted small">Loading news for {teamName}...</p>;
  if (error)
    return (
      <p className="text-danger small">Error loading news for {teamName}.</p>
    );
  if (!articles || articles.length === 0)
    return (
      <p className="text-muted small">No recent news found for {teamName}.</p>
    );

  return (
    <div className="team-news-feed mb-4">
      <h4 className="team-news-feed-header">{teamName} - Latest News</h4>
      <ul className="list-unstyled">
        {articles.slice(0, 3).map(
          (
            article,
            idx // Show top 3 articles per team
          ) => (
            <li
              key={idx}
              className="news-article-item mb-2"
              onClick={() => window.open(article.url, "_blank")}
              style={{ cursor: "pointer" }}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="news-article-image me-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/60?text=News";
                  }}
                />
              )}
              <div className="news-article-content">
                <h6 className="news-article-title mb-0">{article.title}</h6>
                {article.author && (
                  <small className="text-muted d-block">
                    By: {article.author}
                  </small>
                )}
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

// UserProfile component for displaying the logged-in user's profile and favorite teams.
const UserProfile = () => {
  const { userId } = useParams();
  const { profile } = useSelector((state) => state.userAuth);
  const { data: user, isLoading: userLoading } = useGetSingleUserQuery(userId);
  const { data: favorites, isLoading: favLoading } = useGetFavoritesQuery(
    profile?.id
  );
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
            <button
              className="btn-update"
              onClick={() => navigate(`/update-user/${user.id}`)}
            >
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
              <p className="value">
                {user.firstname} {user.lastname}
              </p>
            </div>
            <div className="user-info-item">
              <p className="label">Member Since</p>
              <p className="value">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
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
                      <div
                        key={team.teamId}
                        className="favorite-team-card"
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

          {/* Personalized News Section for Favorited Teams */}
          {isSelf && favorites && favorites.length > 0 && (
            <div className="personalized-news-section mt-4">
              <h2 className="personalized-news-header profile-summary-header">
                Your Personalized News
              </h2>
              <div className="favorites-subbox">
                {" "}
                {/* Re-using favorites-subbox for consistent styling */}
                {favorites.map((fav) => (
                  <TeamNewsFeed
                    key={`news-${fav.teamId}`}
                    teamName={fav.teamName}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
