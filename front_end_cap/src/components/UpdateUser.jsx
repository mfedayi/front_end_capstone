import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "../slices/userSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isFetchError,
    error: fetchError,
  } = useGetSingleUserQuery(userId);
  const [updateUser, { isLoading: isUpdating, error: updateError }] =
    useUpdateUserMutation();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
  });
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, ...formData }).unwrap();
      alert("User updated successfully!");
      navigate("/");
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
    <div className="container mt-4">
      <h2>Update User: {user?.username || userId}</h2>
      <form onSubmit={handleSubmit}>
        {/* Empty comment removed */}
        <div className="mb-3">
          {/* Corrected tag and attribute */}
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          {/* Corrected tag and attribute */}
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
          {/* Corrected tag and attribute */}
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
        {/* Empty comment removed */}
        {/* Corrected typo in button text */}
        <button type="submit" className="btn btn-primary" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update User"}
        </button>
        {/* Corrected attribute */}
        {updateError && (
          <p className="text-danger mt-2">
            Error updating user: {updateError.data?.message || "Server error"}
          </p>
        )}
      </form>
    </div>
  );
};
export default UpdateUser;
