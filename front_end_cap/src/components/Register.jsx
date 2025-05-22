import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRegisterMutation } from "../apiSlices/userSlice";

import { useNavigate } from "react-router-dom";

export default function Register() {
  const [registerUser] = useRegisterMutation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");

  const [error, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate(); 

  const validateValues = (email, username, password, firstname, lastname) => {
    const errors = {};
    if (!email || email.length < 6) {
      errors.email = "email should be at least 6 characters long";
    }
    if (!username || username.length < 5) {
      errors.username = "Username should be at least 6 characters long";
    }
    if (!password || password.length < 5) {
      errors.password = "password should be at least 5 characters long";
    }
    if (!firstname) {
      errors.firstname = "field cannot be empty";
    }
    if (!lastname) {
      errors.lastname = "field cannot be empty";
    }
    return errors;
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateValues(
      email,
      username,
      password,
      firstname,
      lastname
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors || {}).length > 0) return;
    setSubmitting(true); 

    try {
      const result = await registerUser({
        firstname,
        lastname,
        email,
        username,
        password,
      }).unwrap();

      // Backend returns { token }, not a message. Auth state is handled by Redux.
      // setSuccessMessage(`Registration Successful! Welcome ${username}.`);
      navigate("/"); 
    } catch (err) {
      console.error("Failed to register", err);
      setErrors({ api: err.data?.errors?.join(", ") || err.data?.error || "Registration failed. Please try again." });
    }
  }

  return (
    <div className="page-wrapper update-user-bg">
      <div className="update-form-card"></div>
      <div className="registerBackground">
        <h2>Register</h2>
        {successMessage && (
          <p className="text-success">
            {successMessage} Welcome {email}!
          </p>
        )}
        {error && error.api && <p className="text-danger">{error.api}</p>}

        <div className="registerContainer">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label"></label>
              Email:{" "}
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
              {error && error.email && (
                <div className="text-danger">{error.email}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label"></label>
              Username:{" "}
              <input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
              />
              {error && error.username && (
                <div className="text-danger">{error.username}</div>
              )}
            </div>
            <div className="mb-3">
              <label>
                Password:{" "}
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {error && error.password && (
                  <div className="text-danger">{error.password}</div>
                )}
              </label>
            </div>
            <div className="mb-3">
              <label>
                First Name:{" "}
                <input
                  type="text"
                  className="form-control"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                {error && error.firstname && (
                  <div className="text-danger">{error.firstname}</div>
                )}
              </label>
            </div>
            <div className="mb-3">
              <label>
                Last Name:{" "}
                <input
                  type="text"
                  className="form-control"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
                {error && error.lastname && (
                  <div className="text-danger">{error.lastname}</div>
                )}
              </label>
            </div>
            <button type="submit" className="btn btn-outline-dark">
              submit
            </button>
          </form>
        </div>
        {!error?.api && successMessage && submitting && (
          <span className="text-success">Successfully submitted ✓</span>
        )}
      </div>
    </div>
  );
}
