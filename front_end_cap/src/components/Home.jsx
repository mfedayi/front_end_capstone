import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();
  const { data: usersData, isLoading, isError, error } = useGetAllUsersQuery();
  const users = usersData;

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
    // Added check to prevent deleting self, although button should be disabled
    if (userId === loggedInUserId) {
      alert("You cannot delete yourself!");
      return;
    }

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

  const handleUpdate = (userId) => {
    navigate(`/update-user/${userId}`);
  };

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
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => {
              const showUpdate = user.id === loggedInUserId;

              return (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>
                    {showUpdate && (
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleUpdate(user.id)}
                      >
                        Update
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                      disabled={isDeleting || user.id === loggedInUserId}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })
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
