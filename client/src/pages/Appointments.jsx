import React from "react";
import { api } from "../lib/api";

export default function Appointments() {
  const [list, setList] = React.useState([]);
  const [msg, setMsg] = React.useState("");

  
  const [confirmId, setConfirmId] = React.useState(null);

 
  const [rescheduleId, setRescheduleId] = React.useState(null);
  const [rescheduleTime, setRescheduleTime] = React.useState("");

  const load = React.useCallback(() => api.appointments.list().then(setList), []);
  React.useEffect(() => {
    load();
  }, [load]);

  function durationColor(mins) {
    switch (mins) {
      case 15:
        return "success";
      case 30:
        return "primary";
      case 45:
        return "warning";
      case 60:
        return "danger";
      default:
        return "secondary";
    }
  }

  async function onCancel(id) {
    try {
      await api.appointments.cancel(id);
      setMsg("Appointment cancelled.");
      load();
    } catch (e) {
      setMsg("Error: " + e.message);
    }
  }

 
  function toInputValue(timeStr) {
    if (!timeStr) return "";
    if (timeStr.includes("T")) return timeStr;
    const [date, time] = timeStr.split(" ");
    return `${date}T${time}`;
  }


  function formatDateTime(dt) {
    const d = new Date(dt);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }


  function openRescheduleModal(appointment) {
    setRescheduleId(appointment.id);
    setRescheduleTime(toInputValue(appointment.time));
    setMsg("");
  }

  async function submitReschedule(e) {
    e.preventDefault();
    if (!rescheduleId || !rescheduleTime) return;

    const formatted = formatDateTime(rescheduleTime);

    try {
      await api.appointments.reschedule(rescheduleId, formatted);
      setMsg("Appointment rescheduled.");
      setRescheduleId(null);
      setRescheduleTime("");
      load();
    } catch (e) {
      setMsg("Error: " + e.message);
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Appointments</h2>
      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Time</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Notes</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.patient}</td>
                <td>{a.doctor || "—"}</td>
                <td>{a.department || "—"}</td>
                <td>{a.time}</td>

                {/* STATUS */}
                <td>
                  <span className={`badge status-${a.status}`}>{a.status}</span>
                </td>

                {/* DURATION badge */}
                <td>
                  {a.duration ? (
                    <span
                      className={`badge bg-${durationColor(
                        parseInt(a.duration)
                      )}`}
                    >
                      {a.duration} minutes
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                <td>{a.notes || "—"}</td>

                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <div className="d-flex justify-content-end align-items-center gap-2">
                    {/* CANCEL BUTTON */}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => setConfirmId(a.id)}
                    >
                      Cancel
                    </button>

                    {/* RESCHEDULE BUTTON */}
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openRescheduleModal(a)}
                    >
                      Reschedule…
                    </button>
                    <button
  className="btn btn-outline-success btn-sm"
  onClick={async () => {
    try {
      await api.appointments.remind(a.id);
      setMsg("Reminder sent!");
      load();
    } catch (e) {
      setMsg("Error: " + e.message);
    }
  }}
>
  Send Reminder
</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  CONFIRM CANCEL MODAL  */}
      {confirmId && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Cancellation</h5>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to cancel this appointment?</p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmId(null)}
                >
                  No
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onCancel(confirmId);
                    setConfirmId(null);
                  }}
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  RESCHEDULE MODAL  */}
      {rescheduleId && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={submitReschedule}>
                <div className="modal-header">
                  <h5 className="modal-title">Reschedule Appointment</h5>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      New time (Date &amp; Time)
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setRescheduleId(null);
                      setRescheduleTime("");
                    }}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
