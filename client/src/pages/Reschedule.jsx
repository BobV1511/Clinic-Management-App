/**
 * File: Reschedule.jsx
 * Description: Allow users to edit or reschedule existing appointments.
 */
/**
 * Algorithm: Reschedule Existing Appointments by +30 Minutes
 *
 * 1. Load Appointments:
 *    - Define load() to call api.appointments.list().
 *    - On component mount, execute load() inside useEffect().
 *    - Store the appointment list into 'list'.
 *
 * 2. Handle Reschedule (+30 Minutes):
 *    - When user clicks the “Reschedule +30m” button:
 *        a. Call addMinutes(time, 30) to generate the new time.
 *        b. Show a confirmation dialog displaying:
 *              original time → newTime
 *        c. If user cancels the confirmation → stop.
 *
 * 3. Validate New Time:
 *    - Convert newTime to Date object.
 *    - If newTime is in the past:
 *        a. Display toast: “ Cannot reschedule to a past time”
 *        b. Stop the process.
 *
 * 4. Submit Reschedule Request:
 *    - If time is valid:
 *        a. Call api.appointments.reschedule(id, newTime)
 *        b. If successful:
 *              - Show success toast message
 *              - Reload the list by calling load()
 *        c. If failed:
 *              - Show error toast with error message
 *        d. Automatically clear toast after 2.5 seconds.
 *
 * 5. Render UI:
 *    - Display a card for each appointment containing:
 *        a. ID and patient name
 *        b. Current time
 *        c. Status badge (green for booked, gray otherwise)
 *        d. “Reschedule +30m” button triggering the plus30() function
 *    - If list is empty → show “No appointments found.”
 *
 * Summary:
 * This component loads all appointments, allows users to increase the
 * appointment time by 30 minutes, validates time constraints, updates
 * the backend, refreshes the list, and provides feedback using toasts.
 */

import React from 'react'
import { api } from '../lib/api'
import { addMinutes } from '../utils/addMinutes'

export default function Reschedule() {
  const [list, setList] = React.useState([])
  const [toast, setToast] = React.useState('')

  const load = React.useCallback(
    () => api.appointments.list().then(setList),
    []
  )
  React.useEffect(() => {
    load()
  }, [load])

  async function plus30(id, time) {
    const newTime = addMinutes(time, 30)
    if (!confirm(`Reschedule +30m?\n${time} ➜ ${newTime}`)) return

    if (new Date(newTime) < new Date()) {
      setToast('❌ Cannot reschedule to a past time')
      return
    }

    try {
      await api.appointments.reschedule(id, newTime)
      setToast(`✅ Rescheduled to ${newTime}`)
      load()
    } catch (e) {
      setToast(`❌ ${e.message}`)
    } finally {
      setTimeout(() => setToast(''), 2500)
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
                  Status:{' '}
                  <span
                    className={`badge ${
                      a.status === 'booked' ? 'bg-success' : 'bg-secondary'
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
  )
}
