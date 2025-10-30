// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Dashboard() {
  const [status, setStatus] = React.useState("Checking...");
  const [summary, setSummary] = React.useState({ appointments: 0, patients: 0 });
  const [alerts, setAlerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [h, apps, recs] = await Promise.all([
          api.health(),
          api.appointments.list(),
          api.records.list(),
        ]);
        setStatus(h?.ok ? "✅ Backend OK" : "❌ Backend error");

        setSummary({
          appointments: apps.length || 0,
          patients: recs.length || 0,
        });

        const a = [];
        if (!h?.ok) a.push("Backend service issue");
        const overdue = apps.filter((x) => x.status === "overdue").length;
        if (overdue) a.push(`${overdue} overdue item(s)`);
        setAlerts(a);
      } catch {
        setStatus("⚠️ Cannot connect");
        setAlerts(["Cannot reach backend"]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Dashboard</h2>
      <p className="mb-4">Status: {status}</p>

      <div className="row g-3">
        <div className="col-md-3">
          <Card title="Today’s Appointments" value={summary.appointments} to="/appointments" loading={loading} />
        </div>
        <div className="col-md-3">
          <Card title="Patients" value={summary.patients} to="/records" loading={loading} />
        </div>
        <div className="col-md-3">
          <div className="card p-3 h-100">
            <h5 className="mb-2">Alerts</h5>
            {loading ? (
              <div className="text-muted">Loading…</div>
            ) : alerts.length ? (
              <ul className="mb-0">
                {alerts.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            ) : (
              <div className="text-muted">No alerts.</div>
            )}
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 h-100">
            <h5 className="mb-2">Quick Links</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              <Link className="btn btn-light btn-sm" to="/records">Records</Link>
              <Link className="btn btn-light btn-sm" to="/appointments">Appointments</Link>
              <Link className="btn btn-light btn-sm" to="/reschedule">Reschedule</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, to, loading }) {
  return (
    <div className="card p-3 h-100">
      <h5>{title}</h5>
      <div className="display-6">
        {loading ? <span className="text-muted">…</span> : value}
      </div>
      <Link to={to} className="btn btn-sm btn-outline-primary mt-2">
        View
      </Link>
    </div>
  );
}
