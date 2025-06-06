import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetMeQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useUpdateMeMutation,
} from "../apiSlices/userSlice";
import { useSelector } from "react-redux";

// UpdateUser component for updating user profile information.
const UpdateUser = () => {
  const { userId } = useParams();
  const {  profile } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();
  
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isFetchError,
    error: fetchError,
  } = useGetSingleUserQuery(userId);

  const [updateMe, { isLoading: isUpdating, error: updateError }] =
    useUpdateMeMutation();

  const [updateUser] = useUpdateUserMutation(userId); 

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    // Populates form data when user data is fetched.
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  // Handles changes in form input fields.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const isSelfUpdate = profile?.id === userId;
  
  // Handles form submission to update user data.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSelfUpdate) {
        await updateMe(formData).unwrap();
      } else {
        await updateUser({ userId, ...formData }).unwrap();
      }

      alert("User updated successfully!");
      navigate(`/user/${user.id}`);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  if (isLoadingUser) return <p>Loading user data...</p>;
  if (isFetchError)
    return (
      <p>
        Error fetching user data:{" "}
        {fetchError?.data?.message || fetchError?.status || "Unknown error"}
      </p>
    );

  return (
    <div className="page-wrapper update-user-bg">
      <div className="signInContainer" style={{ margin: '60px auto' }}>
        <h2>Update User: {user?.username || userId}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstname"
              value={formData.firstname}signInContainer
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update User"}
          </button>
          {updateError && (
            <p className="text-danger mt-2">
              Error updating user: {updateError.data?.message || "Server error"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
export default UpdateUser;
