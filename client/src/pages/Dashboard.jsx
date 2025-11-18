
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

    
      setStatus(h?.ok ? "Backend is running" : "Backend error");

   
      setSummary({
        appointments: apps.length || 0,
        patients: recs.length || 0,
      });

      const alertsList = [];

      const countBooked = {};
      apps.forEach(a => {
        if (a.status === "booked") {
          if (!countBooked[a.patient]) countBooked[a.patient] = 0;
          countBooked[a.patient]++;
        }
      });
      Object.entries(countBooked).forEach(([name, count]) => {
        alertsList.push(`${name} booked ${count} time(s)`);
      });

 
      const canceledCount = apps.filter(a => a.status === "canceled").length;
      if (canceledCount > 0) {
        alertsList.push(`${canceledCount} appointment(s) were canceled.`);
      }

   
      const completedCount = apps.filter(a => a.status === "completed").length;
      if (completedCount > 0) {
        alertsList.push(`${completedCount} appointment(s) were completed.`);
      }

   
      const now = new Date();
      const overdue = apps.filter(a => {
        const t = new Date(a.time);
        return t < now && a.status === "booked";
      });
      if (overdue.length > 0) {
        alertsList.push(`${overdue.length} overdue appointment(s).`);
      }

   
      Object.entries(countBooked).forEach(([name, count]) => {
        if (count >= 3) {
          alertsList.push(`⚠️ ${name} booked too many times (${count})!`);
        }
      });

 
      const upcoming = apps.filter(a => {
        const t = new Date(a.time);
        const diff = t - now;
        return diff > 0 && diff <= 24 * 60 * 60 * 1000;
      });
      if (upcoming.length > 0) {
        alertsList.push(`${upcoming.length} appointment(s) are coming within 24 hours.`);
      }

   
      setAlerts(alertsList);

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
              <Link className="btn btn-light btn-sm" to="/new">New Booking</Link>
              <Link className="btn btn-light btn-sm" to="/notifications">Notifications</Link>
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
