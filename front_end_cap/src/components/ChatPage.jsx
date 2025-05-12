import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useCreateReplyMutation,
} from "../apiSlices/postsSlice"; // Make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const { data: postsData, isLoading, isError, error: fetchError } = useGetPostsQuery();
  const [createPost, { isLoading: isCreatingPost, error: createPostError }] = useCreatePostMutation();
  const [createReply, { isLoading: isCreatingReply, error: createReplyError }] = useCreateReplyMutation();

  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);
  const posts = postsData || []; // Ensure posts is an array even if data is undefined initially

  const [newPostContent, setNewPostContent] = useState("");
  const [replyContents, setReplyContents] = useState({}); // { postId: "reply text" }
  const [expandedReplies, setExpandedReplies] = useState({}); // { postId: true/false }

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
      console.error("Failed to create post:", err);
      alert(`Failed to create post: ${err.data?.error || err.data?.errors?.join(', ') || 'Please try again.'}`);
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
      setReplyContents(prev => ({ ...prev, [postId]: "" })); // Clear reply input for this post
    } catch (err) {
      console.error("Failed to create reply:", err);
      alert(`Failed to create reply: ${err.data?.error || 'Please try again.'}`);
    }
  };

  const toggleReplies = (postId) => {
    setExpandedReplies(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleReplyChange = (postId, value) => {
    setReplyContents(prev => ({ ...prev, [postId]: value }));
  };

  if (isLoading) return <p className="text-center mt-5">Loading posts...</p>;
  if (isError) return <p className="text-center mt-5 text-danger">Error loading posts: {fetchError?.data?.error || fetchError?.status}</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Talk Sports</h1>

      {isLoggedIn ? (
        <form onSubmit={handlePostSubmit} className="mb-5 p-3 border rounded bg-light">
          <h4>Create a New Post</h4>
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
          <button type="submit" className="btn btn-primary mt-2" disabled={isCreatingPost}>
            {isCreatingPost ? "Posting..." : "Post"}
          </button>
          {createPostError && <p className="text-danger mt-1 small">Error: {createPostError.data?.error || createPostError.data?.errors?.join(', ') || "Could not post."}</p>}
        </form>
      ) : (
        <div className="alert alert-info text-center" role="alert">
          Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to create posts and replies.
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="card mb-3">
            <div className="card-header bg-white">
              <strong>{post.user?.username || "Anonymous"}</strong> - <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
            </div>
            <div className="card-body">
              <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

              {post.replies && post.replies.length > 0 && (
                <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => toggleReplies(post.id)}>
                  {expandedReplies[post.id] ? "Hide" : "View"} {post.replies.length} Replies
                </button>
              )}
              {expandedReplies[post.id] && post.replies && (
                <div className="replies-section ml-4 pl-3 border-left">
                  {post.replies.map(reply => (
                    <div key={reply.id} className="reply mb-2 p-2 bg-light rounded">
                      <strong>{reply.user?.username || "Anonymous"}:</strong>
                      <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{reply.content}</p>
                      <small className="text-muted">{new Date(reply.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              )}

              {isLoggedIn && (
                <form onSubmit={(e) => handleReplySubmit(e, post.id)} className="mt-3">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Write a reply..."
                      value={replyContents[post.id] || ""}
                      onChange={(e) => handleReplyChange(post.id, e.target.value)}
                      disabled={isCreatingReply}
                    />
                  </div>
                  <button type="submit" className="btn btn-info btn-sm mt-1" disabled={isCreatingReply}>
                    {isCreatingReply ? "Replying..." : "Reply"}
                  </button>
                  {createReplyError && replyContents[post.id] && <p className="text-danger mt-1 small">Error: {createReplyError.data?.error || "Could not reply."}</p>}
                </form>
              )}
            </div>
          </div>
        ))}
        {posts.length === 0 && !isLoading && <p className="text-center">No posts yet. Be the first to share!</p>}
      </div>
    </div>
  );
};

export default ChatPage;
