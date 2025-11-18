import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function NewAppointment() {
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    department: "",
    time: "",
    duration: "30",
    notes: "",
  });

  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.records.list().then(setPatients);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const formatDateTime = (dt) => {
    const d = new Date(dt);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedTime = formatDateTime(form.time);

      const result = await api.appointments.create({
  ...form,
  duration: Number(form.duration),
  time: formattedTime,
  status: "booked",
});


      setMessage(`✓ Appointment booked! (ID: ${result.id})`);
      setTimeout(() => navigate("/appointments"), 800);

      setForm({
        patient: "",
        doctor: "",
        department: "",
        time: "",
        duration: "30",
        notes: "",
      });

    } catch (err) {
      console.error("❌ Booking Error:", err);
      setMessage("⚠ Error booking appointment");
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <h2 className="mb-4">Book Appointment</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>

       {/* PATIENT */}
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

        {/* DOCTOR */}
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

        {/* DEPARTMENT */}
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

        {/* TIME */}
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

        {/* DURATION */}
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

        {/* NOTES */}
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
  );
}
