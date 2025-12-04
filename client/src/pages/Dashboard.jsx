/**
 * File: Dashboard.jsx
 * Description: Main dashboard showing navigation and system overview for users.
 */
/**
 * Algorithm: Dashboard Summary and Alerts Generation
 *
 * 1. Load Data:
 *    - When the component loads, send three parallel API requests:
 *        a. api.health() → system health status
 *        b. api.appointments.list() → list of all appointments
 *        c. api.records.list() → list of all patient records
 *    - Store results into states: status, summary, and alerts.
 *
 * 2. Build Summary Cards:
 *    - Count total appointments → summary.appointments
 *    - Count total patients (from records) → summary.patients
 *    - Display these numbers inside the dashboard cards.
 *
 * 3. Generate Alerts:
 *    - For each appointment list:
 *        a. Count how many times each patient booked → “John booked 3 time(s)”
 *        b. Count canceled appointments → “X appointment(s) were canceled”
 *        c. Count completed appointments → “X appointment(s) were completed”
 *        d. Detect overdue (past time but still booked) appointments
 *        e. Detect over-booking (>= 3 bookings from same person)
 *        f. Detect upcoming appointments within 24 hours
 *    - Push all alert messages into the alerts state.
 *
 * 4. Error Handling:
 *    - If API fails:
 *        a. Set system status to “Cannot connect”
 *        b. Add alert: “Cannot reach backend”
 *
 * 5. Display UI:
 *    - Show status text (backend running or not)
 *    - Show summary cards (appointments, patients)
 *    - Show generated alert list or “No alerts”
 *    - Show quick links for easy navigation
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Dashboard() {
  const [status, setStatus] = React.useState('Checking...')
  const [summary, setSummary] = React.useState({ appointments: 0, patients: 0 })
  const [alerts, setAlerts] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    ;(async () => {
      try {
        const [h, apps, recs] = await Promise.all([
          api.health(),
          api.appointments.list(),
          api.records.list(),
        ])

        setStatus(h?.ok ? 'Backend is running' : 'Backend error')

        setSummary({
          appointments: apps.length || 0,
          patients: recs.length || 0,
        })

        const alertsList = []

        const countBooked = {}
        apps.forEach((a) => {
          if (a.status === 'booked') {
            if (!countBooked[a.patient]) countBooked[a.patient] = 0
            countBooked[a.patient]++
          }
        })
        Object.entries(countBooked).forEach(([name, count]) => {
          alertsList.push(`${name} booked ${count} time(s)`)
        })

        const canceledCount = apps.filter((a) => a.status === 'canceled').length
        if (canceledCount > 0) {
          alertsList.push(`${canceledCount} appointment(s) were canceled.`)
        }

        const completedCount = apps.filter(
          (a) => a.status === 'completed'
        ).length
        if (completedCount > 0) {
          alertsList.push(`${completedCount} appointment(s) were completed.`)
        }

        const now = new Date()
        const overdue = apps.filter((a) => {
          const t = new Date(a.time)
          return t < now && a.status === 'booked'
        })
        if (overdue.length > 0) {
          alertsList.push(`${overdue.length} overdue appointment(s).`)
        }

        Object.entries(countBooked).forEach(([name, count]) => {
          if (count >= 3) {
            alertsList.push(`⚠️ ${name} booked too many times (${count})!`)
          }
        })

        const upcoming = apps.filter((a) => {
          const t = new Date(a.time)
          const diff = t - now
          return diff > 0 && diff <= 24 * 60 * 60 * 1000
        })
        if (upcoming.length > 0) {
          alertsList.push(
            `${upcoming.length} appointment(s) are coming within 24 hours.`
          )
        }

        setAlerts(alertsList)
      } catch {
        setStatus('⚠️ Cannot connect')
        setAlerts(['Cannot reach backend'])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="container py-4">
      <h2 className="mb-3">Dashboard</h2>
      <p className="mb-4">Status: {status}</p>

      <div className="row g-3">
        <div className="col-md-3">
          <Card
            title="Today’s Appointments"
            value={summary.appointments}
            to="/appointments"
            loading={loading}
          />
        </div>
        <div className="col-md-3">
          <Card
            title="Patients"
            value={summary.patients}
            to="/records"
            loading={loading}
          />
        </div>
        <div className="col-md-3">
          <div className="card p-3 h-100">
            <h5 className="mb-2">Alerts</h5>
            {loading ? (
              <div className="text-muted">Loading…</div>
            ) : alerts.length ? (
              <ul className="mb-0">
                {alerts.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
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
              <Link className="btn btn-light btn-sm" to="/records">
                Records
              </Link>
              <Link className="btn btn-light btn-sm" to="/appointments">
                Appointments
              </Link>
              <Link className="btn btn-light btn-sm" to="/reschedule">
                Reschedule
              </Link>
              <Link className="btn btn-light btn-sm" to="/new">
                New Booking
              </Link>
              <Link className="btn btn-light btn-sm" to="/notifications">
                Notifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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
  )
}
