/**
 * File: NewRecord.jsx
 * Description: Form for creating new patient medical records.
 */
/**
 * Algorithm: Create New Patient Medical Record
 *
 * 1. Initialize Form:
 *    - Use useState() to store record fields: id, name, gender, age,
 *      bloodType, allergies, lastVisit, and contact.
 *    - Track validation message in 'msg'.
 *    - Prepare useNavigate() for redirecting after creation.
 *
 * 2. Handle Input Changes:
 *    - For every input field, update the form state using handleChange().
 *    - Each change updates the corresponding key inside the form object.
 *
 * 3. Validate Required Fields:
 *    - On form submit, check if required fields (id, name, gender, age)
 *      are filled.
 *    - If any required field is missing:
 *        a. Show error message: “Please fill in all required fields.”
 *        b. Stop the submission process.
 *
 * 4. Build Payload:
 *    - Convert age to a number.
 *    - Convert allergies string into an array of trimmed values.
 *        Example: "peanut, dust" → ["peanut", "dust"]
 *    - Add a default empty history array to the payload.
 *
 * 5. Submit Data:
 *    - Send payload to backend via api.records.create().
 *    - If successful:
 *        a. Redirect the user to the records list page (/records).
 *    - If failed:
 *        a. Display error message: “Failed to save record!”
 *
 * 6. Render UI:
 *    - Provide a styled form with labeled inputs.
 *    - Mark required fields with "*".
 *    - Display validation message (msg) when needed.
 *    - Show Save Record button to submit the form.
 *
 * Summary:
 * This component creates a new patient medical record by validating form
 * inputs, transforming the data into a correct payload, submitting it to
 * the backend, and redirecting upon successful creation.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function NewRecord() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    id: '',
    name: '',
    gender: '',
    age: '',
    bloodType: '',
    allergies: '',
    lastVisit: '',
    contact: '',
  })

  const [msg, setMsg] = useState('')

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.id || !form.name || !form.gender || !form.age) {
      setMsg('Please fill in all required fields.')
      return
    }

    const payload = {
      ...form,
      age: Number(form.age),
      allergies: form.allergies
        ? form.allergies.split(',').map((x) => x.trim())
        : [],
      history: [],
    }

    try {
      await api.records.create(payload)
      navigate('/records')
    } catch {
      setMsg('Failed to save record!')
    }
  }

  return (
    <div className="w-full flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[600px] p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create New Record
        </h1>

        {msg && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{msg}</div>
        )}

        {}
        <label className="block font-semibold">ID *</label>
        <input
          type="text"
          name="id"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
          required
        />

        {}
        <label className="block font-semibold">Name *</label>
        <input
          type="text"
          name="name"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
          required
        />

        {}
        <label className="block font-semibold">Gender *</label>
        <select
          name="gender"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {}
        <label className="block font-semibold">Age *</label>
        <input
          type="number"
          name="age"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
          required
        />

        {}
        <label className="block font-semibold">Blood Type</label>
        <input
          type="text"
          name="bloodType"
          className="w-full border p-2 rounded mb-4"
          placeholder="A+, O-, B+, ..."
          onChange={handleChange}
        />

        {}
        <label className="block font-semibold">Allergies</label>
        <input
          type="text"
          name="allergies"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
        />

        {}
        <label className="block font-semibold">Last Visit</label>
        <input
          type="date"
          name="lastVisit"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
        />

        {}
        <label className="block font-semibold">Contact</label>
        <input
          type="text"
          name="contact"
          className="w-full border p-2 rounded mb-6"
          placeholder="Phone or Email"
          onChange={handleChange}
        />

        {}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold">
          Save Record
        </button>
      </form>
    </div>
  )
}
