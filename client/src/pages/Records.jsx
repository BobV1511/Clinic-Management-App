import React from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Records() {
  const [list, setList] = React.useState([]);
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    api.records.list().then(setList).catch(() => setList([]));
  }, []);

  const filtered = list.filter((r) => {
    const key = `${r.name || ""} ${r.id || ""}`.toLowerCase();
    return key.includes(q.toLowerCase());
  });

  return (
    <div className="container py-4">
      <h2 className="mb-3"> Medical Records</h2>

      <div className="input-group mb-3">
        <span className="input-group-text">Search</span>
        <input
          className="form-control"
          placeholder="Name/ID"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="alert alert-info">No data available</div>
      )}

      <div className="list-group">
        {filtered.map((r) => (
          <Link
            key={r.id}
            to={`/records/${encodeURIComponent(r.id)}`}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex justify-content-between align-items-center">
              <strong>{r.name || r.id}</strong>
              <small className="text-muted">
                {r.allergies?.length ? r.allergies.join(", ") : "none"}
              </small>
            </div>
            {r.summary && <div className="text-muted small">{r.summary}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
