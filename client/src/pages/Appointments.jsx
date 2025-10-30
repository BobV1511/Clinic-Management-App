import React from "react";
import { api } from "../lib/api";

export default function Appointments() {
  const [list, setList] = React.useState([]);
  const [msg, setMsg] = React.useState("");

  const load = React.useCallback(() => api.appointments.list().then(setList), []);
  React.useEffect(() => {
    load();
  }, [load]);

  async function onCancel(id) {
    if (!confirm("Confirm cancel appointment?")) return;
    try {
      await api.appointments.cancel(id);
      setMsg("Appointment cancelled.");
      load();
    } catch (e) {
      setMsg("Error: " + e.message);
    }
  }

  async function onReschedule(id) {
    const newTime = prompt("Enter new time (YYYY-MM-DD HH:mm):", "");
    if (!newTime) return;
    try {
      await api.appointments.reschedule(id, newTime);
      setMsg("Appointment rescheduled.");
      load();
    } catch (e) {
      setMsg("Error: " + e.message);
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3"> Appointments</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Time</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.patient}</td>
                <td>{a.time}</td>
                <td>
                  <span
                    className={`badge ${
                      a.status === "booked" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => onCancel(a.id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onReschedule(a.id)}
                  >
                    Reschedule…
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
