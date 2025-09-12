import React, { useState } from "react";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff"); // Default role is staff

  const handleSubmit = (e) => {
    e.preventDefault();
    // We will add the API call logic here in a future step
    alert(
      `Registration form submitted for:\nUsername: ${username}\nRole: ${role}`
    );
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h3>Register New User (Admin Only)</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reg-username">Username: </label>
          <input
            type="text"
            id="reg-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="reg-password">Password: </label>
          <input
            type="password"
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="reg-role">Role: </label>
          <select
            id="reg-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: "15px" }}>
          Register User
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
