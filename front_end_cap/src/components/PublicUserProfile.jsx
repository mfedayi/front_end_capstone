import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPublicUserProfileQuery } from '../apiSlices/userSlice';
import { useGetUserPublicFavoritesQuery } from '../apiSlices/favoritesSlice';
import { useGetUserPostsQuery, useGetUserRepliesQuery } from '../apiSlices/postsSlice'; // Import new hooks
import '../styles/profile-theme.css'; 

// PublicUserProfile component displays a non-editable view of a user's profile and their favorite teams.
const PublicUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading, error: userError } = useGetPublicUserProfileQuery(userId);
  const { data: favorites, isLoading: favLoading, error: favError } = useGetUserPublicFavoritesQuery(userId, {
    skip: !user, 
  });
  const { data: userPosts, isLoading: postsLoading, error: postsError } = useGetUserPostsQuery(userId, {
    skip: !user,
  });
  const { data: userReplies, isLoading: repliesLoading, error: repliesError } = useGetUserRepliesQuery(userId, {
    skip: !user,
  });

  if (userLoading || favLoading || postsLoading || repliesLoading) return <p className="text-center mt-5">Loading profile...</p>;
  if (userError) return <p className="text-center mt-5 text-danger">Error loading user: {userError.data?.error || userError.status}</p>;

  if (!user) return <p className="text-center mt-5">User not found.</p>;

  return (
    <div className="profile-bg">
      <div className="profile-page-container">
        <div className="profile-card">
          <h2 className="profile-summary-header">{user.username}'s Profile</h2>

          <div className="profile-avatar-card">
            <div className="avatar-circle">
              {/* Display first letter of firstname if available, otherwise 'U' or a generic icon */}
              {user.firstname?.[0]?.toUpperCase() || (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png" // Fallback icon
                  alt="User Avatar"
                  className="avatar-icon" // Add class if you have specific styles for icon vs letter
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
            <h2 className="favorites-summary-header">Favorite Teams</h2>
            <div className="favorites-subbox">
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
            </div>
          </div>
           {/* User's Posts Section */}
          <div className="user-activity-section">
            <h2 className="user-activity-header">Recent Posts</h2>
            <div className="activity-subbox">
              {postsError && <p className="text-center text-warning small">Could not load posts.</p>}
              {!postsError && userPosts?.length === 0 && (
                <p className="text-center">This user has no posts yet.</p>
              )}
              {!postsError && userPosts && userPosts.length > 0 && (
                <ul className="list-group list-group-flush">
                  {userPosts.slice(0, 5).map((post) => ( // Show latest 5 posts
                    <li key={post.id} className="list-group-item user-activity-item">
                      <p className="activity-content">{post.content.length > 100 ? `${post.content.substring(0, 97)}...` : post.content}</p>
                      <small className="text-muted activity-timestamp">Posted on: {new Date(post.createdAt).toLocaleDateString()}</small>
                      {/* Future: Link to post: onClick={() => navigate(`/chat#post-${post.id}`)} */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* User's Replies Section */}
          <div className="user-activity-section">
            <h2 className="user-activity-header">Recent Replies</h2>
            <div className="activity-subbox">
              {repliesError && <p className="text-center text-warning small">Could not load replies.</p>}
              {!repliesError && userReplies?.length === 0 && (
                <p className="text-center">This user has no replies yet.</p>
              )}
              {!repliesError && userReplies && userReplies.length > 0 && (
                <ul className="list-group list-group-flush">
                  {userReplies.slice(0, 5).map((reply) => ( // Show latest 5 replies
                    <li key={reply.id} className="list-group-item user-activity-item">
                      <p className="activity-content">{reply.content.length > 100 ? `${reply.content.substring(0, 97)}...` : reply.content}</p>
                      {reply.post && (
                        <small className="text-muted d-block">
                          Replied to post: "{reply.post.content.substring(0,30)}..."
                          {/* Future: Link to post: onClick={() => navigate(`/chat#post-${reply.postId}`)} */}
                        </small>
                      )}
                      <small className="text-muted activity-timestamp">Replied on: {new Date(reply.createdAt).toLocaleDateString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
