import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateReplyMutation,
  useSoftDeleteOwnReplyMutation,
  useAdminDeleteReplyMutation,
} from "../apiSlices/postsSlice";
import { Link } from "react-router-dom";

const ReplyItem = ({ reply, postId, level = 0 }) => {
  if (!reply || !reply.user) {
    return null;
  }

  const navigate = useNavigate();
  const [isReplying, setIsReplying] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [areChildrenExpanded, setAreChildrenExpanded] = useState(false); // State for child replies visibility

  const [
    createReply,
    { isLoading: isCreatingNestedReply, error: createNestedReplyError },
  ] = useCreateReplyMutation();
  const [softDeleteOwnReply, { isLoading: isSoftDeletingOwnReply }] =
    useSoftDeleteOwnReplyMutation();
  const [adminDeleteReply, { isLoading: isAdminDeletingReply }] =
    useAdminDeleteReplyMutation();

  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);
  const loggedInUser = useSelector((state) => state.userAuth.profile);
  const loggedInUserId = loggedInUser?.id;
  const isAdmin = loggedInUser?.isAdmin;

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
      setAreChildrenExpanded(true); // Auto-expand to show the new reply
    } catch (err) {
      console.error("Failed to submit nested reply:", err);
      alert(
        `Failed to submit reply: ${err.data?.error || "Please try again."}`
      );
    }
  };

  const toggleChildReplies = () => {
    setAreChildrenExpanded(!areChildrenExpanded);
  };

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

  const displayContent =
    reply.content === "[Reply deleted by User]"
      ? "[Reply deleted by User]"
      : reply.content;
  const isSoftDeleted = reply.content === "[Reply deleted by User]";

  return (
    <div
      className={`reply mb-2 p-2 bg-light rounded`}
      style={{
        marginLeft: `${level * 25}px`,
        borderLeft: level > 0 ? "2px solid #eee" : "none",
        paddingLeft: level > 0 ? "15px" : "0",
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <strong>{reply.user?.username || "Anonymous"}:</strong>
          <p
            style={{
              whiteSpace: "pre-wrap",
              margin: "5px 0 0 0",
              fontStyle: isSoftDeleted ? "italic" : "normal",
              color: isSoftDeleted ? "#6c757d" : "inherit",
            }}
          >
            {displayContent}
          </p>
          <small className="text-muted">
            {new Date(reply.createdAt).toLocaleString()}
          </small>
          {isLoggedIn && !isSoftDeleted && (
            <button
              className="btn btn-link btn-sm p-0 ms-2"
              onClick={() => setIsReplying(!isReplying)}
              style={{ textDecoration: "none" }}
            >
              {isReplying ? "Cancel" : "Reply"}
            </button>
          )}
          {/* Button to toggle visibility of child replies */}
          {reply.childReplies && reply.childReplies.length > 0 && (
            <button
              className="btn btn-link btn-sm p-0 ms-2"
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
              className="form-control form-control-sm"
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
            className="btn btn-info btn-sm mt-1"
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

      {/* Recursively render child replies, conditionally based on areChildrenExpanded */}
      {areChildrenExpanded && reply.childReplies && reply.childReplies.length > 0 && (
        <div className="nested-replies mt-2">
          {reply.childReplies.map((childReply) => (
            <ReplyItem
              key={childReply.id}
              reply={childReply}
              postId={postId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyItem;
