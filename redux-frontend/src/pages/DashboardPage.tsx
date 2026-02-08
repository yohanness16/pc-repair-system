import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import apiClient from "../api/apiClient";
import AddDeviceForm from "../components/AddDeviceForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../redux/devicesSlice";

const DeviceList = () => {
  const dispatch = useDispatch();
  const { allDevices, status, error } = useSelector((state) => state.devices); // This will hold our list of devices

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDevices());
    }
  }, [status, dispatch]);

  const filteredDevices = useMemo(() => {
    return allDevices.filter((device) => {
      const searchMatch =
        searchTerm === "" ||
        device.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.tag_number
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === "all" || device.status === statusFilter;
      const branchMatch =
        branchFilter === "all" || device.branch_name === branchFilter;
      const typeMatch =
        typeFilter === "all" || device.item_category === typeFilter;

      return searchMatch && statusMatch && branchMatch && typeMatch;
    });
  }, [allDevices, searchTerm, statusFilter, branchFilter, typeFilter]);

  const uniqueStatuses = useMemo(
    () => ["all", ...new Set(allDevices.map((d) => d.status_display))],
    [allDevices]
  );
  const uniqueBranches = useMemo(
    () => ["all", ...new Set(allDevices.map((d) => d.branch_name))],
    [allDevices]
  );
  const uniqueDevices = useMemo(
    () => ["all", ...new Set(allDevices.map((d) => d.item_category))],
    [allDevices]
  );

  const handleDeviceAdded = () => {
    dispatch(fetchDevices());
  };

  if (status === "loading") {
    return <p>Loading devices...</p>;
  }

  if (status === "failed") {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <AddDeviceForm onDeviceAdded={handleDeviceAdded} />

      <h1>Current Device List</h1>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor="Status">Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="working">Working</option>
          <option value="need_repair">Need Repair</option>
          <option value="under_repair">Under Repair</option>
          <option value="repaired">Repaired</option>
          <option value="disposed">Disposed</option>
        </select>
        <label htmlFor="Branch">Branch</label>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="1">Addisu Gebeya</option>
          <option value="2">Piazza</option>
        </select>
        <label htmlFor="Device type">Device Type</label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Device Type</option>
          <option value="Computer">Computer</option>
          <option value="Scanner">Scanner</option>
          <option value="Printer">Printer</option>
          <option value="monitor">Monitor</option>
        </select>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1.5px solid black", textAlign: "left" }}>
            <th>Tag Number</th>
            <th>Item Category</th>
            <th>Branch Name</th>
            <th>Status</th>
            <th>Serial Number</th>
            <th>Added By</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device) => (
            <tr key={device.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{device.tag_number}</td>
              <td>{device.item_category}</td>
              <td>{device.branch_name}</td>
              <td>{device.status_display}</td>
              <td>{device.serial_number}</td>
              <td>{device.added_by_name}</td>
              <td>{device.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceList;
