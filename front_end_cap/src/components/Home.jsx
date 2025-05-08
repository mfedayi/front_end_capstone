import {
  useRegisterMutation,
  useGetLoginMutation,
} from "../apiSlices/userSlice";
import { useGetAllTeamsQuery, useGetTeamDetailsQuery } from "../api/nbaAPI";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();
  const { data: teams, isLoading, isError, error } = useGetAllTeamsQuery();

  // const loggedInUserId = useSelector((state) => state.userAuth.profile?.id);
  // const [deleteUser, { isLoading: isDeleting, error: deleteError }] =
  //   useDeleteUserMutation();

  if (isLoading) {
    return <h1>is loading...</h1>;
  }

  if (isError) {
    return (
      <h1>Error: {error?.data?.message || error?.status || "Unknown error"}</h1>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Welcome Home</h2>
      {teams?.map((team) => (
        <div
          key={team.teamId}
          className="book-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/teams/${team.teamId}`)}
        >
          <img
            src={team.teamLogo}
            alt={team.teamName}
            className="book-cover"
            onError={(e) => {
              e.target.onerror = null; // prevents looping
            }}
          />
          <h3 className="book-title">{team.teamLogo}</h3>
          <p className="book-author">{team.teamName}</p>
        </div>
      ))}
      {/* {deleteError && (
        <p className="text-danger">
          Error deleting user: {deleteError.data?.message || deleteError.error}
        </p>
      )}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {}
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleUpdate(user.id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table> */}
    </div>
  );
};
export default Home;
