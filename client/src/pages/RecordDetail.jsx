import React from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function RecordDetail() {
  const { id } = useParams();
  const [data, setData] = React.useState(null);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    api.records.get(id).then(setData).catch((e) => setErr(e.message));
  }, [id]);

  if (err) return <div className="container py-4 text-danger">Error: {err}</div>;
  if (!data) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-3">{data.name || id}</h3>
      <div className="row g-3">
        <div className="col-md-6">
          <Card title="Allergies" items={data.allergies?.length ? data.allergies : ["none"]} />
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
  );
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
  );
}
