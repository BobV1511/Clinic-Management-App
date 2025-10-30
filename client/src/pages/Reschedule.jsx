import React from "react";
import { api } from "../lib/api";
import { addMinutes } from "../utils/addMinutes";

export default function Reschedule() {
  const [list, setList] = React.useState([]);
  const [toast, setToast] = React.useState("");

  const load = React.useCallback(() => api.appointments.list().then(setList), []);
  React.useEffect(() => {
    load();
  }, [load]);

  async function plus30(id, time) {
    const newTime = addMinutes(time, 30);
    if (!confirm(`Reschedule +30m?\n${time} ➜ ${newTime}`)) return;

    // prevent rescheduling to the past (client-side)
    if (new Date(newTime) < new Date()) {
      setToast("❌ Cannot reschedule to a past time");
      return;
    }

    try {
      await api.appointments.reschedule(id, newTime);
      setToast(`✅ Rescheduled to ${newTime}`);
      load();
    } catch (e) {
      setToast(`❌ ${e.message}`);
    } finally {
      setTimeout(() => setToast(""), 2500);
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3"> Reschedule</h2>
      {toast && <div className="alert alert-info">{toast}</div>}

      <div className="row g-3">
        {list.map((a) => (
          <div key={a.id} className="col-md-6">
            <div className="card p-3 d-flex justify-content-between">
              <div>
                <h5 className="mb-1">
                  #{a.id} • {a.patient}
                </h5>
                <div>
                  Time: <strong>{a.time}</strong>
                </div>
                <div>
                  Status:{" "}
                  <span
                    className={`badge ${
                      a.status === "booked" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-end">
                <button
                  className="btn btn-primary"
                  onClick={() => plus30(a.id, a.time)}
                >
                  Reschedule +30m
                </button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="alert alert-info">No appointments found.</div>
        )}
      </div>
    </div>
  );
}
