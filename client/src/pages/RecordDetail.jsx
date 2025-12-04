/**
 * File: RecordDetail.jsx
 * Description: Display detailed information of a single medical record.
 */
/**
 * Algorithm: Load and Display Detailed Medical Record
 *
 * 1. Extract Route Parameter:
 *    - Use useParams() to retrieve the record ID from the URL.
 *
 * 2. Fetch Record Data:
 *    - When the component loads or when the ID changes:
 *        a. Call api.records.get(id) to fetch the detailed record.
 *        b. If successful → store the result in 'data'.
 *        c. If failed → store the error message in 'err'.
 *
 * 3. Handle Loading and Error States:
 *    - If an error occurs:
 *        a. Display an error message on the screen.
 *    - If no data has been retrieved yet:
 *        a. Display “Loading...” while waiting for API response.
 *
 * 4. Render Record Information:
 *    - Display the record title using the patient's name or ID.
 *    - Render two detail cards:
 *        a. Allergies list (or “none” if empty)
 *        b. Medical History list (or empty list if no history)
 *    - Show full raw JSON data at the bottom for transparency/debugging.
 *
 * 5. Provide Navigation:
 *    - Include a “Back” button to return to the Records page.
 *
 * Summary:
 * This component retrieves a single medical record using its ID from the URL,
 * handles errors and loading, and displays structured details including
 * allergies, history, and full metadata in JSON format.
 */

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function RecordDetail() {
  const { id } = useParams()
  const [data, setData] = React.useState(null)
  const [err, setErr] = React.useState('')

  React.useEffect(() => {
    api.records
      .get(id)
      .then(setData)
      .catch((e) => setErr(e.message))
  }, [id])

  if (err) return <div className="container py-4 text-danger">Error: {err}</div>
  if (!data) return <div className="container py-4">Loading...</div>

  return (
    <div className="container py-4">
      <h3 className="mb-3">{data.name || id}</h3>
      <div className="row g-3">
        <div className="col-md-6">
          <Card
            title="Allergies"
            items={data.allergies?.length ? data.allergies : ['none']}
          />
        </div>
        <div className="col-md-6">
          <Card title="Medical History" items={data.history || []} />
        </div>
      </div>
      <pre className="bg-light p-3 rounded border mt-3">
        {JSON.stringify(data, null, 2)}
      </pre>
      <Link to="/records" className="btn btn-secondary mt-3">
        ← Back
      </Link>
    </div>
  )
}

function Card({ title, items }) {
  return (
    <div className="card p-3">
      <h5 className="mb-2">{title}</h5>
      <ul className="mb-0">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  )
}
