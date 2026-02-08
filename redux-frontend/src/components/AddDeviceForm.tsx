import React, { useState } from "react";
import apiClient from "../api/apiClient";

// The onDeviceAdded prop is a function we'll call to tell the parent page to refresh
const AddDeviceForm = ({ onDeviceAdded }) => {
  // State for each form field
  const [tagNumber, setTagNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [itemCategory, setItemCategory] = useState("Computer");
  const [status, setStatus] = useState("working");
  const [remark, setRemark] = useState("");
  const [branchId, setBranchId] = useState(""); // We'll make this a dropdown later

  // State for handling submission feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Get the logged-in user's ID from localStorage
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);
    if (!user || !user.id) {
      setError("Could not identify the user. Please log in again.");
      return;
    }

    const newDevice = {
      tag_number: tagNumber,
      serial_number: serialNumber,
      item_category: itemCategory,
      status: status,
      remark: remark,
      branch: parseInt(branchId, 10), // Convert branchId to an integer
      added_by: user.id,
    };
    console.log(newDevice);

    try {
      await apiClient.post("/equipment/create/", newDevice);
      setSuccess("Device successfully added!");

      // Clear the form fields
      setTagNumber("");
      setSerialNumber("");
      setRemark("");
      setBranchId("");

      // Call the function passed from the parent to trigger a refresh
      if (onDeviceAdded) {
        onDeviceAdded();
      }
    } catch (err) {
      // Handle potential validation errors from the backend
      const errorMessage =
        err.response?.data?.detail ||
        "An error occurred while adding the device.";
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        marginBottom: "30px",
      }}
    >
      <h3>Register New Device</h3>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div>
          <label>Tag Number: </label>
          <input
            type="text"
            value={tagNumber}
            onChange={(e) => setTagNumber(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Serial Number: </label>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Item Category: </label>
          <select
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
          >
            <option value="Computer">Computer</option>
            <option value="Printer">Printer</option>
            <option value="Scanner">Scanner</option>
            <option value="monitor">Monitor</option>
          </select>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Status: </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="working">Working</option>
            <option value="need_repair">Need Repair</option>
          </select>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Branch ID: </label>
          {/* This should be a dropdown fetched from an API */}
          <input
            type="number"
            placeholder="Enter Branch ID"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Remark: </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows="3"
          />
        </div>

        {/* Feedback Messages */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" style={{ marginTop: "15px" }}>
          Add Device
        </button>
      </form>
    </div>
  );
};

export default AddDeviceForm;
