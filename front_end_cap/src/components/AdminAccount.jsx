import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetSingleUserQuery,
} from "../apiSlices/userSlice";
//import { useReturnBookMutation } from "../slices/tempSlice";
import { useState} from "react";
import {  useNavigate } from "react-router-dom";

const AdminAccount = () => {
  const { data: users, error, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  //const [reservations, setReservations] = useState([]);
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
      <h2 className="nba-heading">NBA Teams</h2> {/* Title */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a user..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </div>
      <div className="team-grid">
        {" "}
        {/* Grid container */}
        {filteredUsers?.map((user) => (
          <ul>
            {
              <li key={user.id}>
                <p>Email: {user.email}</p>
                <p>Username: {user.username}</p>
                <p>
                  {" "}
                  Name: {user.firstname} {user.lastname}
                </p>
                <p>
                  Member since: {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => navigate(`/update-user/${user.id}`)}
                >
                  Update User
                </button>
              </li>
            }
          </ul>
        ))}
      </div>
    </div>
  );
};
export default AdminAccount;
