import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateReplyMutation,
  useSoftDeleteOwnReplyMutation,
  useAdminDeleteReplyMutation,
  useUpdateReplyMutation,
  useVoteReplyMutation, // For voting on replies
} from "../apiSlices/postsSlice";
import { Link } from "react-router-dom";

// ReplyItem component for displaying a single reply and its nested children.
const ReplyItem = ({
  reply,
  postId,
  level = 0,
  loggedInUserId,
  isAdmin,
  isLoggedIn,
  navigate,
}) => {
  if (!reply || !reply.user) {
    return null;
  }

  const [isReplying, setIsReplying] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [areChildrenExpanded, setAreChildrenExpanded] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  const [
    createReply,
    { isLoading: isCreatingNestedReply, error: createNestedReplyError },
  ] = useCreateReplyMutation();
  const [softDeleteOwnReply, { isLoading: isSoftDeletingOwnReply }] =
    useSoftDeleteOwnReplyMutation();
  const [adminDeleteReply, { isLoading: isAdminDeletingReply }] =
    useAdminDeleteReplyMutation();
  const [updateReply, { isLoading: isUpdatingReply, error: updateReplyError }] =
    useUpdateReplyMutation();
  const [voteReply, { isLoading: isVotingReply, error: voteReplyError }] =
    useVoteReplyMutation();

  // Handles submission of a nested reply.
  const handleNestedReplySubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please login or register to reply.");
      navigate("/login");
      return;
    }
    if (!newReplyContent.trim()) return;

    try {
      await createReply({
        postId,
        content: newReplyContent,
        parentId: reply.id,
      }).unwrap();
      setNewReplyContent("");
      setIsReplying(false);
      setAreChildrenExpanded(true);
    } catch (err) {
      console.error("Failed to submit nested reply:", err);
      alert(
        `Failed to submit reply: ${err.data?.error || "Please try again."}`
      );
    }
  };

  // Toggles the visibility of child replies.
  const toggleChildReplies = () => {
    setAreChildrenExpanded(!areChildrenExpanded);
  };

  // Handles soft deletion of the user's own reply.
  const handleSoftDeleteOwnReplyClick = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this reply? The content will be marked as [deleted]."
      )
    ) {
      try {
        await softDeleteOwnReply(reply.id).unwrap();
      } catch (err) {
        alert(
          `Failed to delete reply: ${err.data?.error || "Please try again."}`
        );
      }
    }
  };

  // Handles permanent deletion of a reply by an admin.
  const handleAdminDeleteReplyClick = async () => {
    if (
      window.confirm(
        "ADMIN: Are you sure you want to permanently delete this reply?"
      )
    ) {
      try {
        await adminDeleteReply(reply.id).unwrap();
      } catch (err) {
        alert(
          `Failed to admin delete reply: ${
            err.data?.error || "Please try again."
          }`
        );
      }
    }
  };

  // Sets up the state for editing a reply.
  const handleEditReplyClick = (currentReply) => {
    if (currentReply.content === "[reply has been deleted by the user]") return;
    setEditingReplyId(currentReply.id);
    setEditingReplyContent(currentReply.content);
  };

  // Cancels the reply editing mode.
  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditingReplyContent("");
  };

  // Saves the updated content of a reply.
  const handleSaveReplyUpdate = async (currentReplyId) => {
    if (!editingReplyContent.trim()) {
      alert("Reply content cannot be empty.");
      return;
    }
    try {
      await updateReply({
        replyId: currentReplyId,
        content: editingReplyContent,
      }).unwrap();
      setEditingReplyId(null);
      setEditingReplyContent("");
    } catch (err) {
      console.error("Failed to update reply:", err);
      alert(
        `Failed to update reply: ${err.data?.error || "Please try again."}`
      );
    }
  };

  // Handles voting (like/dislike) on a reply.
  const handleVoteReply = async (replyId, voteType) => {
    if (!isLoggedIn) {
      alert("Please login to vote.");
      navigate("/login");
      return;
    }
    try {
      await voteReply({ replyId, voteType }).unwrap();
    } catch (err) {
      console.error("Failed to vote on reply:", err);
      alert(`Failed to vote: ${err.data?.error || "Please try again."}`);
    }
  };
  const softDeletedReplyContent = "[reply has been deleted by the user]";
  const displayContent =
    reply.content === softDeletedReplyContent
      ? softDeletedReplyContent
      : reply.content;
  const isSoftDeleted = reply.content === softDeletedReplyContent;

  return (
    <div
      className={`reply mb-2 p-2 rounded`}
      style={{
        marginLeft: `${level * 25}px`,
        borderLeft: level > 0 ? "2px solid rgba(255,255,255,0.1)" : "none", // Adjusted border color for dark theme
        paddingLeft: level > 0 ? "15px" : "0",
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <strong>
            {reply.user?.id ? (
              <Link
                to={`/profile/${reply.user.id}`}
                className="text-decoration-none text-dark username-link"
              >
                {reply.user.username}
              </Link>
            ) : (
              reply.user?.username || "Anonymous"
            )}
            :
          </strong>{" "}
          {editingReplyId === reply.id ? (
            <div className="mt-1">
              <textarea
                className="form-control form-control-sm mb-1 chat-reply-input"
                rows="2"
                value={editingReplyContent}
                onChange={(e) => setEditingReplyContent(e.target.value)}
                disabled={isUpdatingReply}
              />
              <button
                className="btn btn-outline-success btn-sm me-1 py-0 px-1"
                onClick={() => handleSaveReplyUpdate(reply.id)}
                disabled={isUpdatingReply}
              >
                {isUpdatingReply ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm py-0 px-1"
                onClick={handleCancelEditReply}
                disabled={isUpdatingReply}
              >
                Cancel
              </button>
              {updateReplyError && editingReplyId === reply.id && (
                <p className="text-danger mt-1 small">
                  Error: {updateReplyError.data?.error || "Could not update."}
                </p>
              )}
            </div>
          ) : (
            <p
              style={{
                whiteSpace: "pre-wrap",
                margin: "5px 0 0 0",
                fontStyle: isSoftDeleted ? "italic" : "normal",
                color: isSoftDeleted ? "#6c757d" : "inherit", // Will be overridden by .reply p
              }}
            >
              {displayContent}
            </p>
          )}
          <small className="text-muted">
            {new Date(reply.createdAt).toLocaleString()}
          </small>
          {/* Like/Dislike buttons for Reply */}
          {isLoggedIn && !isSoftDeleted && editingReplyId !== reply.id && (
            <div className="mt-1">
              <button
                className={`btn btn-sm me-2 ${
                  reply.userVote === "LIKE"
                    ? "btn-user-voted-like"
                    : "btn-outline-success"
                }`}
                onClick={() => handleVoteReply(reply.id, "LIKE")}
                disabled={isVotingReply}
              >
                <i className="bi bi-hand-thumbs-up"></i> ({reply.likeCount || 0}
                )
              </button>
              <button
                className={`btn btn-sm ${
                  reply.userVote === "DISLIKE"
                    ? "btn-user-voted-dislike"
                    : "btn-outline-danger"
                }`}
                onClick={() => handleVoteReply(reply.id, "DISLIKE")}
                disabled={isVotingReply}
              >
                <i className="bi bi-hand-thumbs-down"></i> (
                {reply.dislikeCount || 0})
              </button>
            </div>
          )}
          {isLoggedIn && !isSoftDeleted && (
            <button
              className="btn chat-toggle-button btn-sm mt-1"
              onClick={() => setIsReplying(!isReplying)}
              style={{ textDecoration: "none" }}
            >
              {isReplying ? "Cancel" : "Reply"}
            </button>
          )}
          {isLoggedIn &&
            loggedInUserId === reply.userId &&
            !isSoftDeleted &&
            editingReplyId !== reply.id && (
              <button
                className="btn chat-toggle-button btn-sm mt-1"
                onClick={() => handleEditReplyClick(reply)}
                style={{ textDecoration: "none" }}
              >
                Edit
              </button>
            )}
          {reply.childReplies && reply.childReplies.length > 0 && (
            <button
              className="btn chat-toggle-button btn-sm mt-1"
              onClick={toggleChildReplies}
              style={{ textDecoration: "none" }}
            >
              {areChildrenExpanded
                ? "Hide Replies"
                : `View ${reply.childReplies.length} Replies`}
            </button>
          )}
        </div>
        <div className="ms-2 d-flex flex-column">
          {isLoggedIn && loggedInUserId === reply.userId && !isSoftDeleted && (
            <button
              className="btn btn-outline-warning btn-sm py-0 px-1 mb-1"
              onClick={handleSoftDeleteOwnReplyClick}
              disabled={isSoftDeletingOwnReply}
            >
              Delete
            </button>
          )}
          {isLoggedIn && isAdmin && (
            <button
              className="btn btn-danger btn-sm py-0 px-1"
              onClick={handleAdminDeleteReplyClick}
              disabled={isAdminDeletingReply}
            >
              Admin Delete
            </button>
          )}
        </div>
      </div>

      {isReplying && isLoggedIn && (
        <form onSubmit={handleNestedReplySubmit} className="mt-2 ms-3">
          <div className="form-group">
            <textarea
              className="form-control form-control-sm chat-reply-input"
              rows="2"
              placeholder={`Replying to ${
                reply.user?.username || "Anonymous"
              }...`}
              value={newReplyContent}
              onChange={(e) => setNewReplyContent(e.target.value)}
              disabled={isCreatingNestedReply}
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn chat-action-button btn-sm mt-1" // Changed to use chat-action-button
            disabled={isCreatingNestedReply}
          >
            {isCreatingNestedReply ? "Submitting..." : "Submit Reply"}
          </button>
          {createNestedReplyError && (
            <p className="text-danger mt-1 small">
              Error: {createNestedReplyError.data?.error || "Could not reply."}
            </p>
          )}
        </form>
      )}

      {areChildrenExpanded &&
        reply.childReplies &&
        reply.childReplies.length > 0 && (
          <div className="nested-replies mt-2">
            {reply.childReplies.map((childReply) => (
              <ReplyItem
                key={childReply.id}
                reply={childReply}
                postId={postId}
                level={level + 1}
                loggedInUserId={loggedInUserId}
                isAdmin={isAdmin}
                isLoggedIn={isLoggedIn}
                navigate={navigate}
              />
            ))}
            {updateReplyError && !editingReplyId && (
              <p className="text-danger mt-1 small">
                Error updating reply:{" "}
                {updateReplyError.data?.error || "Please try again."}
              </p>
            )}
            {voteReplyError && (
              <p className="text-danger mt-1 small">
                Vote Error:{" "}
                {voteReplyError.data?.error || "Could not process vote."}
              </p>
            )}
          </div>
        )}
    </div>
  );
};

export default ReplyItem;
