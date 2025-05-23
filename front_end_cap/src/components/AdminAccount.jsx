import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  // useUpdateUserMutation,
  // useGetSingleUserQuery,
} from "../apiSlices/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile-theme.css";

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
      <h2 className="nba-heading">NBA Teams</h2>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a user..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </div>
      <div
        className="team-grid"
        style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
      >
        {" "}
        {/* Grid container */}
        {filteredUsers?.map((user) => (
          <div
            className="team-card"
            style={{
              color: "#ec9c5b",
              backgroundColor: "rgba(87, 76, 64, 0.8)",
              minHeight: "260px",
              display: "flex",
              justifyContent: "space-between", // button goes to bottom
              transition: "all 0.3s ease",
              borderRadius: "10px",
              flexDirection: "column",
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {
              <div key={user.id}>
                <div style={{ flexShrink: 0 }}>
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={user.email}
                  >
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={user.username}
                  >
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <strong>Name:</strong> {user.firstname} {user.lastname}
                  </p>
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={user.createdAt}
                  >
                    <strong>Member since:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    className="update-button"
                    style={{
                      //opacity: 0, // start hidden
                      // pointerEvents: "none", // not clickable unless visible
                      transition: "opacity 0.3s ease", // smooth fade in
                      marginTop: "3rem",
                      // 👈 Pushes button to bottom
                      marginBottom: "0.5rem", // 👈 Adds some space from the bottom
                      marginTop: "auto", // 👈 THIS pushes it to the bottom
                      marginBottom: "0.5rem",
                      alignSelf: "flex-start", // optional: left align button
                    }}
                    onClick={() => navigate(`/update-user/${user.id}`)}
                  >
                    Update User
                  </button>
                </div>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminAccount;
