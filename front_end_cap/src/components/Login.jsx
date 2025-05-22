import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetLoginMutation } from "../apiSlices/userSlice";

export default function Login() {
  const [loginUser] = useGetLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [error, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validateValues = (username, password) => {
    const errors = {};
    if (!username || username.length < 6) {
      errors.username = "Username should be at least 6 characters long";
    }
    if (!password || password.length < 5) {
      errors.password = "password should be at least 5 characters long";
    }
    return errors;
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateValues(username, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors || {}).length > 0) return;
    setSubmitting(true); 

    try {
      const result = await loginUser({
        username,
        password,
      }).unwrap();

      // Backend returns { token }, not a message. Auth state is handled by Redux.
      // setSuccessMessage("Sign in Successful!"); 
      navigate("/"); 
    } catch (err) {
      console.error("Failed to login", err);
      setErrors({ api: err.data?.error || "Login failed. Please try again." });
    }
  }
  return (
    <div className="page-wrapper update-user-bg">
      <div className="update-form-card">
        <div className="signInContainer">
          <h4 className="signIn">Please sign in</h4>
          {successMessage && (
            <p className="text-success">{successMessage} Welcome!</p>
          )}
          {error && error.api && <p className="text-danger">{error.api}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="fw-light">username</label>
              <input
                type="text"
                value={username}
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                className="form-control"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline-dark">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}