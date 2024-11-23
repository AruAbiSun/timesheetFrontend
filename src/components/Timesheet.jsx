/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TimesheetStyle.css";

const Timesheet = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    hoursWorked: "",
    leaveType: "",
    remarks: "",
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTimesheets = async () => {
    try {
      const res = await axios.get(
        "https://timesheetbackend-geyq.onrender.com/api/timesheet/get",
        {
          headers: { Authorization: token },
        }
      );
      setTimesheets(res.data.data);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      toast.error("Failed to load timesheets. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `https://timesheetbackend-geyq.onrender.com/api/timesheet/update/${editId}`,
          formData,
          {
            headers: { Authorization: token },
          }
        );
        toast.success("Timesheet updated successfully.");
        setEditId(null);
      } else {
        await axios.post(
          "https://timesheetbackend-geyq.onrender.com/api/timesheet/create",
          formData,
          {
            headers: { Authorization: token },
          }
        );
        toast.success("Timesheet added successfully.");
      }

      setFormData({ date: "", hoursWorked: "", leaveType: "", remarks: "" });
      fetchTimesheets();
    } catch (error) {
      console.error("Error saving timesheet:", error);
      toast.error("Failed to save timesheet. Please try again.");
    }
  };

  const handleEdit = (entry) => {
    setEditId(entry._id);
    setFormData({
      date: entry.date.split("T")[0],
      hoursWorked: entry.hoursWorked,
      leaveType: entry.leaveType || "",
      remarks: entry.remarks || "",
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ date: "", hoursWorked: "", leaveType: "", remarks: "" });
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  return (
    <div className="container">
      <h2>Timesheet</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="hoursWorked" className="form-label">
              Hours Worked
            </label>
            <input
              type="number"
              id="hoursWorked"
              className="form-control"
              value={formData.hoursWorked}
              onChange={(e) =>
                setFormData({ ...formData, hoursWorked: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="leaveType" className="form-label">
              Leave Type
            </label>
            <select
              id="leaveType"
              className="form-control"
              value={formData.leaveType}
              onChange={(e) =>
                setFormData({ ...formData, leaveType: e.target.value })
              }
            >
              <option value="">None</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="remarks" className="form-label">
              Remarks
            </label>
            <input
              type="text"
              id="remarks"
              className="form-control"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
            />
          </div>
          <div className="col-md-12 text-center">
            <button type="submit" className="btn btn-primary">
              {editId ? "Update Timesheet" : "Add Timesheet"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn btn-secondary ms-3"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Timesheet Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>Date</th>
              <th>Hours Worked</th>
              <th>Leave Type</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.length > 0 ? (
              timesheets.map((entry) => (
                <tr key={entry._id}>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.hoursWorked}</td>
                  <td>{entry.leaveType || "None"}</td>
                  <td>{entry.remarks || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(entry)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No timesheets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Timesheet;
