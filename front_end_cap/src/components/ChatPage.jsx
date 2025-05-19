import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useCreateReplyMutation,
  useSoftDeleteOwnPostMutation,
  useAdminDeletePostMutation,
  useSoftDeleteOwnReplyMutation,
  useAdminDeleteReplyMutation,
} from "../apiSlices/postsSlice";
import "../styles/chat-theme.css";

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
  const [softDeleteOwnPost, { error: softDeletePostError }] =
    useSoftDeleteOwnPostMutation();
  const [adminDeletePost, { error: adminDeletePostError }] =
    useAdminDeletePostMutation();
  const [softDeleteOwnReply, { error: softDeleteOwnReplyError }] =
    useSoftDeleteOwnReplyMutation();
  const [adminDeleteReply, { error: adminDeleteReplyError }] =
    useAdminDeleteReplyMutation();

  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);
  const loggedInUser = useSelector((state) => state.userAuth.profile);
  const loggedInUserId = loggedInUser?.id;
  const isAdmin = loggedInUser?.isAdmin;

  const posts = postsData || [];

  const [newPostContent, setNewPostContent] = useState("");
  const [replyContents, setReplyContents] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});

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

  const handleSoftDeletePostClick = async (postId) => {
    if (!isLoggedIn) return;
    if (window.confirm("Delete this post? It will be marked as [deleted].")) {
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

  const handleAdminHardDeletePostClick = async (postId) => {
    if (!isAdmin) return;
    if (
      window.confirm("ADMIN: Permanently delete this post and its replies?")
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

  const handleSoftDeleteOwnReplyClick = async (replyId) => {
    if (!isLoggedIn) return;
    if (window.confirm("Delete this reply?")) {
      try {
        await softDeleteOwnReply(replyId).unwrap();
      } catch (err) {
        console.error("Failed to delete reply:", err?.data?.error || err);
        alert(
          `Failed to delete reply: ${err.data?.error || "Please try again."}`
        );
      }
    }
  };

  const handleAdminDeleteReplyClick = async (replyId) => {
    if (!isAdmin) return;
    if (window.confirm("ADMIN: Permanently delete this reply?")) {
      try {
        await adminDeleteReply(replyId).unwrap();
      } catch (err) {
        console.error("Failed to admin delete reply:", err?.data?.error || err);
        alert(
          `Failed to admin delete reply: ${
            err.data?.error || "Please try again."
          }`
        );
      }
    }
  };

  const toggleReplies = (postId) => {
    setExpandedReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleReplyChange = (postId, value) => {
    setReplyContents((prev) => ({ ...prev, [postId]: value }));
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
    <div className="container mt-4 chat-container">
      <h1 className="chat-title text-center mb-4">Talk Sports</h1>

      {isLoggedIn ? (
        <form onSubmit={handlePostSubmit} className="chat-post-form">
          <h4 className="text-dark">Have something to say?</h4>
          <textarea
            className="form-control chat-textarea"
            rows="4"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your thoughts..."
            disabled={isCreatingPost}
          ></textarea>
          <button
            type="submit"
            className="btn btn-primary mt-2 chat-post-button"
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
          <div key={post.id} className="card chat-post-card mb-4">
            <div className="card-header d-flex justify-content-between">
              <div>
                <strong>{post.user?.username || "Anonymous"}</strong>{" "}
                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="d-flex gap-2">
                {isLoggedIn &&
                  loggedInUserId === post.userId &&
                  post.content !== "[deleted by user]" && (
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => handleSoftDeletePostClick(post.id)}
                    >
                      Delete
                    </button>
                  )}
                {isLoggedIn && isAdmin && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAdminHardDeletePostClick(post.id)}
                  >
                    Admin Delete
                  </button>
                )}
              </div>
            </div>

            <div className="card-body">
              <p className="chat-post-content">{post.content}</p>

              {post.replies?.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-secondary mb-2"
                  onClick={() => toggleReplies(post.id)}
                >
                  {expandedReplies[post.id] ? "Hide" : "View"}{" "}
                  {post.replies.length} Replies
                </button>
              )}

              {expandedReplies[post.id] && post.replies && (
                <div className="replies-section">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="chat-reply-box">
                      <div className="d-flex justify-content-between">
                        <strong>{reply.user?.username || "Anonymous"}</strong>
                        <div className="d-flex gap-2">
                          {isLoggedIn && loggedInUserId === reply.userId && (
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() =>
                                handleSoftDeleteOwnReplyClick(reply.id)
                              }
                            >
                              Delete
                            </button>
                          )}
                          {isLoggedIn && isAdmin && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleAdminDeleteReplyClick(reply.id)
                              }
                            >
                              Admin Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="chat-reply-content">{reply.content}</p>
                      <small className="text-muted">
                        {new Date(reply.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {isLoggedIn && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, post.id)}
                  className="mt-3"
                >
                  <input
                    type="text"
                    className="form-control form-control-sm chat-reply-input"
                    placeholder="Write a reply..."
                    value={replyContents[post.id] || ""}
                    onChange={(e) => handleReplyChange(post.id, e.target.value)}
                    disabled={isCreatingReply}
                  />
                  <button
                    type="submit"
                    className="btn btn-info btn-sm mt-1"
                    disabled={isCreatingReply}
                  >
                    {isCreatingReply ? "Replying..." : "Reply"}
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

      {/* 🔽 Global error messages preserved here */}
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
