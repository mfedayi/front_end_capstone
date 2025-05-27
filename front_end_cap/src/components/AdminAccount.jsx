import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../apiSlices/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile-theme.css";

// AdminAccount component for managing user accounts.
const AdminAccount = () => {
  const { data: users, error, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    return <p>Error: {error?.status || "Error loading profiles"}</p>;
  }

  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="nba-heading">Admin User Management</h2>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a user..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div
        className="admin-user-grid"
      >
        {filteredUsers?.map((user) => (
          <div
            className="admin-user-card" // Changed class name
            key={user.id} // Key moved to the outer card element
          >
            <div className="admin-user-card-content"> {/* Wrapper for user details */}
              <p title={user.email}> {/* User details */}
                <strong>Email:</strong> {user.email}
              </p>
              <p title={user.username}>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Name:</strong> {user.firstname} {user.lastname}
              </p>
              <p title={user.createdAt}>
                <strong>Member since:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              className="update-button"
              onClick={() => navigate(`/update-user/${user.id}`)}
            >
              Update User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminAccount;
