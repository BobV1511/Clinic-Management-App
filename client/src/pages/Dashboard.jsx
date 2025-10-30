import React from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Dashboard() {
  const [status, setStatus] = React.useState("Checking...");
  const [summary, setSummary] = React.useState({ appointments: 0, patients: 0 });

  React.useEffect(() => {
    api
      .health()
      .then((d) => setStatus(d?.ok ? "✅ Backend OK" : "❌ Backend error"))
      .catch(() => setStatus("⚠️ Cannot connect"));
    (async () => {
      try {
        const [apps, recs] = await Promise.all([
          api.appointments.list(),
          api.records.list(),
        ]);
        setSummary({ appointments: apps.length || 0, patients: recs.length || 0 });
      } catch {
        /* ignore */
      }
    })();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-3"> Dashboard</h2>
      <p className="mb-4">Status: {status}</p>

      <div className="row g-3">
        <div className="col-md-4">
          <Card title="Today’s Appointments" value={summary.appointments} to="/appointments" />
        </div>
        <div className="col-md-4">
          <Card title="Patients" value={summary.patients} to="/records" />
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Quick Links</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              <Link className="btn btn-light btn-sm" to="/records">
                Records
              </Link>
              <Link className="btn btn-light btn-sm" to="/appointments">
                Appointments
              </Link>
              <Link className="btn btn-light btn-sm" to="/reschedule">
                Reschedule
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, to }) {
  return (
    <div className="card p-3 h-100">
      <h5>{title}</h5>
      <div className="display-6">{value}</div>
      <Link to={to} className="btn btn-sm btn-outline-primary mt-2">
        View
      </Link>
    </div>
  );
}
