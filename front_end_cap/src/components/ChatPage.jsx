import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useCreateReplyMutation,
  useSoftDeleteOwnPostMutation,
  useAdminDeletePostMutation,
  useSoftDeleteOwnReplyMutation,
  useAdminDeleteReplyMutation,
  useUpdatePostMutation,
  useVotePostMutation,
} from "../apiSlices/postsSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import ReplyItem from "./ReplyItem";

// ChatPage component for displaying and interacting with forum posts and replies.
const ChatPage = () => {
  const navigate = useNavigate();
  const {
    data: postsData,
    isLoading,
    isError,
    error: fetchError,
  } = useGetPostsQuery();
  const [createPost, { isLoading: isCreatingPost, error: createPostError }] =
    useCreatePostMutation();
  const [createReply, { isLoading: isCreatingReply, error: createReplyError }] =
    useCreateReplyMutation();
  const [
    softDeleteOwnPost,
    { isLoading: isSoftDeletingPost, error: softDeletePostError },
  ] = useSoftDeleteOwnPostMutation();
  const [
    adminDeletePost,
    { isLoading: isAdminDeletingPost, error: adminDeletePostError },
  ] = useAdminDeletePostMutation();
  const [
    softDeleteOwnReply,
    { isLoading: isSoftDeletingOwnReply, error: softDeleteOwnReplyError },
  ] = useSoftDeleteOwnReplyMutation();
  const [
    adminDeleteReply,
    { isLoading: isAdminDeletingReply, error: adminDeleteReplyError },
  ] = useAdminDeleteReplyMutation();
  const [updatePost, { isLoading: isUpdatingPost, error: updatePostError }] =
    useUpdatePostMutation();
  const [votePost, { isLoading: isVotingPost, error: votePostError }] =
    useVotePostMutation();

  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);
  const loggedInUser = useSelector((state) => state.userAuth.profile);
  const loggedInUserId = loggedInUser?.id;
  const isAdmin = loggedInUser?.isAdmin;

  const posts = postsData || [];

  const [newPostContent, setNewPostContent] = useState("");
  const [replyContents, setReplyContents] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostContent, setEditingPostContent] = useState("");

  // Handles submission of a new post.
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please login or register to create a post.");
      navigate("/login");
      return;
    }
    if (!newPostContent.trim()) return;

    try {
      await createPost(newPostContent).unwrap();
      setNewPostContent("");
    } catch (err) {
      console.error("Failed to create post:", err?.data?.error || err);
      alert(
        `Failed to create post: ${
          err.data?.error || err.data?.errors?.join(", ") || "Please try again."
        }`
      );
    }
  };

  // Handles submission of a new reply to a post.
  const handleReplySubmit = async (e, postId) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please login or register to reply.");
      navigate("/login");
      return;
    }
    const content = replyContents[postId]?.trim();
    if (!content) return;

    try {
      await createReply({ postId, content }).unwrap();
      setReplyContents((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Failed to create reply:", err?.data?.error || err);
      alert(
        `Failed to create reply: ${err.data?.error || "Please try again."}`
      );
    }
  };

  // Handles soft deletion of a user's own post.
  const handleSoftDeletePostClick = async (postId) => {
    if (!isLoggedIn) return;
    if (
      window.confirm(
        "Are you sure you want to delete this post? The content will be marked as [deleted]."
      )
    ) {
      try {
        await softDeleteOwnPost(postId).unwrap();
      } catch (err) {
        console.error("Failed to soft delete post:", err?.data?.error || err);
        alert(
          `Failed to delete post: ${err.data?.error || "Please try again."}`
        );
      }
    }
  };

  // Handles permanent deletion of a post by an admin.
  const handleAdminHardDeletePostClick = async (postId) => {
    if (!isAdmin) return;
    if (
      window.confirm(
        "ADMIN: Are you sure you want to permanently delete this post and all its replies?"
      )
    ) {
      try {
        await adminDeletePost(postId).unwrap();
      } catch (err) {
        console.error("Failed to admin delete post:", err?.data?.error || err);
        alert(
          `Failed to admin delete post: ${
            err.data?.error || "Please try again."
          }`
        );
      }
    }
  };

  // Toggles the visibility of replies for a post.
  const toggleReplies = (postId) => {
    setExpandedReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Updates the content of a reply being typed.
  const handleReplyChange = (postId, value) => {
    setReplyContents((prev) => ({ ...prev, [postId]: value }));
  };

  // Sets up the state for editing a post.
  const handleEditPostClick = (post) => {
    if (post.content === "[deleted by user]") return;
    setEditingPostId(post.id);
    setEditingPostContent(post.content);
  };

  // Cancels the post editing mode.
  const handleCancelEditPost = () => {
    setEditingPostId(null);
    setEditingPostContent("");
  };

  // Saves the updated content of a post.
  const handleSavePostUpdate = async (postId) => {
    if (!editingPostContent.trim()) {
      alert("Post content cannot be empty.");
      return;
    }
    try {
      await updatePost({ postId, content: editingPostContent }).unwrap();
      setEditingPostId(null);
      setEditingPostContent("");
    } catch (err) {
      console.error("Failed to update post:", err);
      alert(`Failed to update post: ${err.data?.error || "Please try again."}`);
    }
  };

  // Handles voting (like/dislike) on a post.
  const handleVotePost = async (postId, voteType) => {
    if (!isLoggedIn) {
      alert("Please login to vote.");
      navigate("/login");
      return;
    }
    try {
      await votePost({ postId, voteType }).unwrap();
    } catch (err) {
      console.error("Failed to vote on post:", err);
      alert(`Failed to vote: ${err.data?.error || "Please try again."}`);
    }
  };

  if (isLoading) return <p className="text-center mt-5">Loading posts...</p>;
  if (isError)
    return (
      <p className="text-center mt-5 text-danger">
        Error loading posts:{" "}
        {fetchError?.data?.error || fetchError?.message || fetchError?.status}
      </p>
    );

  return (
    <div className="container mt-4">
      <h1 className="chat-page-title">Talk Sports</h1>

      {isLoggedIn ? (
        <form onSubmit={handlePostSubmit} className="chat-form-container">
          <h4>Share Your Thoughts</h4>
          <div className="form-group">
            <textarea
              id="newPostContent"
              className="form-control"
              rows="4"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your thoughts..."
              disabled={isCreatingPost}
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn chat-action-button mt-2" 
            disabled={isCreatingPost}
          >
            {isCreatingPost ? "Posting..." : "Post"}
          </button>
          {createPostError && (
            <p className="text-danger mt-1 small">
              Error:{" "}
              {createPostError.data?.error ||
                createPostError.data?.errors?.join(", ") ||
                "Could not post."}
            </p>
          )}
        </form>
      ) : (
        <div className="alert alert-info text-center" role="alert">
          Please <Link to="/login">Login</Link> or{" "}
          <Link to="/register">Register</Link> to create posts and replies.
        </div>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="card chat-post-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>
                  {post.user?.id ? (
                    <Link
                      to={`/profile/${post.user.id}`}
                      className="text-decoration-none text-dark username-link"
                    >
                      {post.user.username}{" "}
                    </Link>
                  ) : (
                    post.user?.username || "Anonymous"
                  )}
                </strong>{" "}
                -{" "}
                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleString()}
                </small>
              </div>
              <div>
                {isLoggedIn &&
                  loggedInUserId === post.userId &&
                  post.content !== "[deleted by user]" &&
                  editingPostId !== post.id && (
                    <button
                      className="btn btn-outline-secondary btn-sm py-0 px-1 me-2"
                      onClick={() => handleEditPostClick(post)}
                      disabled={isUpdatingPost}
                    >
                      Edit Post
                    </button>
                  )}
                {isLoggedIn &&
                  loggedInUserId === post.userId &&
                  post.content !== "[deleted by user]" && (
                    <button
                      className="btn btn-outline-warning btn-sm py-0 px-1 me-2"
                      onClick={() => handleSoftDeletePostClick(post.id)}
                      disabled={isSoftDeletingPost}
                    >
                      Delete Post
                    </button>
                  )}
                {isLoggedIn && isAdmin && (
                  <button
                    className="btn btn-danger btn-sm py-0 px-1"
                    onClick={() => handleAdminHardDeletePostClick(post.id)}
                    disabled={isAdminDeletingPost}
                  >
                    Admin Delete Post
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {editingPostId === post.id ? (
                <div>
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    value={editingPostContent}
                    onChange={(e) => setEditingPostContent(e.target.value)}
                    disabled={isUpdatingPost}
                  />
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleSavePostUpdate(post.id)}
                    disabled={isUpdatingPost}
                  >
                    {isUpdatingPost ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCancelEditPost}
                    disabled={isUpdatingPost}
                  >
                    Cancel
                  </button>
                  {updatePostError && editingPostId === post.id && (
                    <p className="text-danger mt-1 small">
                      Error:{" "}
                      {updatePostError.data?.error || "Could not update post."}
                    </p>
                  )}
                </div>
              ) : (
                <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                  {post.content}
                </p>
              )}

              {isLoggedIn && post.content !== "[deleted by user]" && (
                <div className="mt-2">
                  <button
                    className={`btn btn-sm me-2 ${
                      post.userVote === "LIKE"
                        ? "btn-success"
                        : "btn-outline-success"
                    }`}
                    onClick={() => handleVotePost(post.id, "LIKE")}
                    disabled={isVotingPost}
                  >
                    <i className="bi bi-hand-thumbs-up"></i> Like (
                    {post.likeCount || 0})
                  </button>
                  <button
                    className={`btn btn-sm ${
                      post.userVote === "DISLIKE"
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                    onClick={() => handleVotePost(post.id, "DISLIKE")}
                    disabled={isVotingPost}
                  >
                    <i className="bi bi-hand-thumbs-down"></i> Dislike (
                    {post.dislikeCount || 0})
                  </button>
                </div>
              )}

              {}
              {((post.replies && post.replies.length > 0) || isLoggedIn) && (
                <hr className="my-3" />
              )}

              {post.replies && post.replies.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-secondary mb-2"
                  onClick={() => toggleReplies(post.id)}
                >
                  {expandedReplies[post.id] ? "Hide" : "View"}
                  {post.replies.length} Replies
                </button>
              )}
              {expandedReplies[post.id] && post.replies && (
                <div className="replies-section ml-4 pl-3 border-left">
                  {post.replies.map((reply) => (
                    <ReplyItem
                      key={reply.id}
                      reply={reply}
                      postId={post.id}
                      level={0}
                      loggedInUserId={loggedInUserId}
                      isAdmin={isAdmin}
                      isLoggedIn={isLoggedIn}
                      navigate={navigate}
                    />
                  ))}
                </div>
              )}

              {isLoggedIn && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, post.id)}
                  className="mt-3"
                >
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-sm chat-reply-input"
                      placeholder="Reply to this post..."
                      value={replyContents[post.id] || ""}
                      onChange={(e) =>
                        handleReplyChange(post.id, e.target.value)
                      }
                      disabled={isCreatingReply}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn chat-action-button btn-sm mt-1" // Changed to use chat-action-button
                    disabled={isCreatingReply}
                  >
                    {isCreatingReply ? "Replying..." : "Reply to post"}
                  </button>
                  {createReplyError && replyContents[post.id] && (
                    <p className="text-danger mt-1 small">
                      Error:{" "}
                      {createReplyError.data?.error || "Could not reply."}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        ))}
        {posts.length === 0 && !isLoading && (
          <p className="text-center">No posts yet. Be the first to share!</p>
        )}
      </div>
      {updatePostError && !editingPostId && (
        <p className="text-danger mt-1 small">
          Error updating post:{" "}
          {updatePostError.data?.error || "Please try again."}
        </p>
      )}
      {votePostError && !editingPostId && (
        <p className="text-danger mt-1 small">
          Error voting on post:{" "}
          {votePostError.data?.error || "Please try again."}
        </p>
      )}
      {softDeletePostError && (
        <p className="text-danger mt-1 small">
          Error: {softDeletePostError.data?.error || "Could not delete post."}
        </p>
      )}
      {adminDeletePostError && (
        <p className="text-danger mt-1 small">
          Error (Admin):{" "}
          {adminDeletePostError.data?.error || "Could not delete post."}
        </p>
      )}
      {softDeleteOwnReplyError && (
        <p className="text-danger mt-1 small">
          Error:{" "}
          {softDeleteOwnReplyError.data?.error || "Could not delete reply."}
        </p>
      )}
      {adminDeleteReplyError && (
        <p className="text-danger mt-1 small">
          Error (Admin):{" "}
          {adminDeleteReplyError.data?.error || "Could not delete reply."}
        </p>
      )}
    </div>
  );
};

export default ChatPage;
