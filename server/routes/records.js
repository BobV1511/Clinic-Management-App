/**
 * File: records.js
 * Description: Backend routes for retrieving medical records list and providing
 *              data to the frontend Records page.
 */

import React from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Records() {
  const [list, setList] = React.useState([]);
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    api.records
      .list()
      .then(setList)
      .catch(() => setList([]));
  }, []);

  const filtered = list.filter((r) => {
    const key = `${r.name || ""} ${r.id || ""}`.toLowerCase();
    return key.includes(q.toLowerCase());
  });

  return (
    <div className="container py-4">
      <h2 className="mb-3">Medical Records</h2>

      {}
      <div className="d-flex justify-content-end mb-3">
        <Link to="/records/new" className="btn btn-success">
          + Add New Record
        </Link>
      </div>

      {}
      <div className="input-group mb-3">
        <span className="input-group-text">Search</span>
        <input
          className="form-control"
          placeholder="Name or ID..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {}
      {filtered.length === 0 && (
        <div className="alert alert-info">No records found.</div>
      )}

      {}
      {filtered.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Blood Type</th>
                <th>Allergies</th>
                <th>Last Visit</th>
                <th>Contact</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>

                  {}
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          r.gender === "Male"
                            ? "#cce5ff"
                            : r.gender === "Female"
                            ? "#f7c6d0"
                            : "#e2e3e5",
                        color: "black",
                      }}
                    >
                      {r.gender}
                    </span>
                  </td>

                  <td>{r.age}</td>
                  <td>{r.bloodType}</td>

                  <td>{Array.isArray(r.allergies) ? r.allergies.join(", ") : r.allergies}</td>

                  <td>{r.lastVisit || "—"}</td>
                  <td>{r.contact}</td>

                  {}
                  <td>
                    <Link
                      to={`/records/${encodeURIComponent(r.id)}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
