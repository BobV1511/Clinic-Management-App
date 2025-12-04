/**
 * File: Records.jsx
 * Description: Display and filter medical records for the clinic app.
 */
/**
 * Algorithm: Load and Filter Medical Records
 *
 * 1. Initialize State:
 *    - 'list' stores all medical records retrieved from the backend.
 *    - 'q' stores the user's search query.
 *
 * 2. Load All Records:
 *    - When the component loads:
 *        a. Call api.records.list() to fetch all patient records.
 *        b. If successful → store the result in 'list'.
 *        c. If failed → set 'list' to an empty array.
 *
 * 3. Filter Records:
 *    - For every change in the search box:
 *        a. Convert both record name/ID and query to lowercase.
 *        b. Check if the record matches the query string.
 *        c. Store the filtered results in 'filtered'.
 *
 * 4. Render UI:
 *    - Display “Add New Record” button linking to /records/new.
 *    - Render a search bar that updates 'q' as the user types.
 *    - If no results → show “No records found.”
 *
 * 5. Display Records Table:
 *    - If records exist:
 *        a. Render a responsive table with columns:
 *              ID, Name, Gender, Age, Blood Type,
 *              Allergies, Last Visit, Contact, Details
 *        b. Style gender badge (blue for Male, pink for Female, gray otherwise).
 *        c. Format allergies list by joining with commas.
 *        d. Link “View” button to the detailed page for each record:
 *              /records/{id}
 *
 * Summary:
 * This component loads all medical records on page load, allows
 * real-time filtering by name or ID, and displays the patient data
 * in a searchable, sortable table with a link to view full details.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Records() {
  const [list, setList] = React.useState([])
  const [q, setQ] = React.useState('')

  React.useEffect(() => {
    api.records
      .list()
      .then(setList)
      .catch(() => setList([]))
  }, [])

  const filtered = list.filter((r) => {
    const key = `${r.name || ''} ${r.id || ''}`.toLowerCase()
    return key.includes(q.toLowerCase())
  })

  return (
    <div className="container py-4">
      <h2 className="mb-3">Medical Records</h2>

      {}
      <div className="mb-3 text-end">
        <Link to="/records/new" className="btn btn-success">
          + Add New Record
        </Link>
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text">Search</span>
        <input
          className="form-control"
          placeholder="Name or ID..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="alert alert-info">No records found.</div>
      )}

      {filtered.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Blood Type</th>
                <th>Allergies</th>
                <th>Last Visit</th>
                <th>Contact</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          r.gender === 'Male'
                            ? '#cce5ff'
                            : r.gender === 'Female'
                            ? '#f7c6d0'
                            : '#e2e3e5',
                        color: 'black',
                      }}
                    >
                      {r.gender}
                    </span>
                  </td>
                  <td>{r.age}</td>
                  <td>{r.bloodType}</td>
                  <td>
                    {r.allergies?.length ? r.allergies.join(', ') : 'None'}
                  </td>
                  <td>{r.lastVisit || '—'}</td>
                  <td>{r.contact}</td>
                  <td>
                    <Link
                      to={`/records/${encodeURIComponent(r.id)}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
