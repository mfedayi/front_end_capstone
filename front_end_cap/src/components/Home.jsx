import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, isError, error } = useGetAllUsersQuery();

  const loggedInUserId = useSelector((state) => state.userAuth.profile?.id);
  const [deleteUser, { isLoading: isDeleting, error: deleteError }] =
    useDeleteUserMutation();

  if (isLoading) {
    return <h1>is loading...</h1>;
  }

  if (isError) {
    return (
      <h1>Error: {error?.data?.message || error?.status || "Unknown error"}</h1>
    );
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert(
          `Failed to delete user: ${
            err.data?.message || err.error || "Server error"
          }`
        );
      }
    }
  };

  const handleUpdate = (userId) => {};

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      {deleteError && (
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
                    onClick={() => handleSubmit(user.id)}
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
      </table>
    </div>
  );
};
export default Home;
