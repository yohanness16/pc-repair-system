import React, { useState } from "react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

// The setToken prop will be a function passed from App.jsx to update the login state
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission which reloads the page
    setError(""); // Clear previous errors

    try {
      // The API call remains the same
      const response = await apiClient.post("/Staff/login/", {
        // Assuming endpoint is /token/
        username: username,
        password: password,
      });

      // --- NEW LOGIC HERE ---
      const { access, role, ...userData } = response.data;

      if (access && role) {
        dispatch(loginSuccess({ token: access, user: { role, ...userData } }));
        navigate("/");
      } else {
        setError("Login failed: Invalid data received from server.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Login failed: Invalid username or password.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: "15px" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
