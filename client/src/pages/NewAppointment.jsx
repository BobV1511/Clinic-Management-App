/**
 * File: NewAppointment.jsx
 * Description: Form for creating new clinic appointments and submitting data.
 */
/**
 * Algorithm: Create New Appointment
 *
 * 1. Initialize Form:
 *    - Use useState() to store form fields: patient, doctor, department,
 *      time, duration, and notes.
 *    - Prepare navigate() for redirecting after booking.
 *
 * 2. Load Patient List:
 *    - When the component loads, call api.records.list().
 *    - Store the returned patient names in 'patients' for datalist suggestions.
 *
 * 3. Handle Form Input:
 *    - For every field change:
 *        a. Update the form state using handleChange().
 *        b. Sync the modified field with its corresponding key in the form object.
 *
 * 4. Format Appointment Time:
 *    - Convert datetime-local input into formatted string (YYYY-MM-DD HH:MM).
 *    - Ensure backend receives consistent timestamp format.
 *
 * 5. Submit Appointment:
 *    - On form submission:
 *        a. Prevent default browser behavior.
 *        b. Format the selected date/time.
 *        c. Send POST request to api.appointments.create() with:
 *              - patient, doctor, department
 *              - formatted time
 *              - numeric duration
 *              - notes
 *              - default status: "booked"
 *        d. If successful:
 *              - Display success message with created appointment ID.
 *              - Redirect to appointment list after short delay.
 *              - Reset the form to default values.
 *        e. If failed:
 *              - Show error message: “⚠ Error booking appointment”.
 *
 * 6. Render UI:
 *    - Show dropdowns for doctor and department selection.
 *    - Show datalist auto-suggestions for patient name.
 *    - Provide fields for time, duration, and notes.
 *    - Display confirmation or error message above the form.
 *
 * Summary:
 * This component allows the user to create a clinic appointment by filling
 * out a form, validating inputs, formatting the schedule time, submitting
 * data to the backend, and redirecting on success.
 */

import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function NewAppointment() {
  const [form, setForm] = useState({
    patient: '',
    doctor: '',
    department: '',
    time: '',
    duration: '30',
    notes: '',
  })

  const [patients, setPatients] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.records.list().then(setPatients)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const formatDateTime = (dt) => {
    const d = new Date(dt)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formattedTime = formatDateTime(form.time)

      const result = await api.appointments.create({
        ...form,
        duration: Number(form.duration),
        time: formattedTime,
        status: 'booked',
      })

      setMessage(`✓ Appointment booked! (ID: ${result.id})`)
      setTimeout(() => navigate('/appointments'), 800)

      setForm({
        patient: '',
        doctor: '',
        department: '',
        time: '',
        duration: '30',
        notes: '',
      })
    } catch (err) {
      console.error('❌ Booking Error:', err)
      setMessage('⚠ Error booking appointment')
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <h2 className="mb-4">Book Appointment</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        {}
        <div className="mb-3">
          <label className="form-label fw-bold">Patient</label>

          <input
            list="patient-options"
            name="patient"
            className="form-control"
            placeholder="Select or type patient name..."
            value={form.patient}
            onChange={handleChange}
            required
          />

          <datalist id="patient-options">
            {patients.map((p) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
        </div>

        {}
        <div className="mb-3">
          <label className="form-label fw-bold">Doctor</label>
          <select
            name="doctor"
            className="form-select"
            value={form.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select doctor...</option>
            <option>Dr. Smith</option>
            <option>Dr. Taylor</option>
            <option>Dr. Carter</option>
            <option>Dr. Adams</option>
            <option>Dr. Wilson</option>
            <option>Dr. Evans</option>
            <option>Dr. Patel</option>
            <option>Dr. Brown</option>
          </select>
        </div>

        {}
        <div className="mb-3">
          <label className="form-label fw-bold">Department</label>
          <select
            name="department"
            className="form-select"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department...</option>
            <option>Cardiology</option>
            <option>Dentistry</option>
            <option>Dermatology</option>
            <option>Neurology</option>
            <option>Radiology</option>
            <option>Pediatrics</option>
          </select>
        </div>

        {}
        <div className="mb-3">
          <label className="form-label fw-bold">Time</label>
          <input
            type="datetime-local"
            name="time"
            className="form-control"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>

        {}
        <div className="mb-3">
          <label className="form-label fw-bold">Duration</label>
          <select
            name="duration"
            className="form-select"
            value={form.duration}
            onChange={handleChange}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        {}
        <div className="mb-3">
          <label className="form-label fw-bold">Notes</label>
          <textarea
            name="notes"
            className="form-control"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional notes (optional)"
          />
        </div>

        <button className="btn btn-primary px-4">Book Appointment</button>
      </form>
    </div>
  )
}
