import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function Dashboard() {
  const [status, setStatus] = React.useState("Loading...");

  React.useEffect(() => {
    fetch("http://localhost:4000/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setStatus("Connected to Backend");
        else setStatus(" Backend not responding");
      })
      .catch(() => setStatus(" Cannot connect to backend"));
  }, []);

  return (
    <div>
      <h2>MS1: Dashboard</h2>
      <p>Backend Status: {status}</p>
    </div>
  );
}

function Records(){
  const [list, setList] = React.useState([]);
  React.useEffect(()=>{ fetch("http://localhost:4000/api/records").then(r=>r.json()).then(setList); },[]);
  return (
    <div>
      <h2>MS2: Medical Records</h2>
      <ul>{list.map(r => <li key={r.id}><b>{r.name}</b> – allergies: {r.allergies.join(", ")||"none"}</li>)}</ul>
    </div>
  );
}

function Appointments(){
  const [list, setList] = React.useState([]);
  const load = ()=> fetch("http://localhost:4000/api/appointments").then(r=>r.json()).then(setList);
  React.useEffect(load,[]);
  const cancel = (id)=> fetch(`http://localhost:4000/api/appointments/cancel/${id}`,{method:"POST"}).then(load);
  return (
    <div>
      <h2>CA2: Manage Appointments</h2>
      <ul>
        {list.map(a => (
          <li key={a.id}>
            {a.patient} – {a.time} – <i>{a.status}</i>
            {" "} <button onClick={()=>cancel(a.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Reschedule(){
  const [list, setList] = React.useState([]);
  const load = ()=> fetch("http://localhost:4000/api/appointments").then(r=>r.json()).then(setList);
  React.useEffect(load,[]);
  const reschedule = (id)=> fetch(`http://localhost:4000/api/appointments/reschedule/${id}`,{method:"POST"}).then(load);
  return (
    <div>
      <h2>P2: Cancel / Reschedule</h2>
      {list.map(a => (
        <div key={a.id} style={{marginBottom:8}}>
          {a.patient} – {a.time} – <i>{a.status}</i>
          {" "} <button onClick={()=>reschedule(a.id)}>Reschedule +30m</button>
        </div>
      ))}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "12px", padding: "10px", background: "#eee" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/records">Records</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/reschedule">Reschedule</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/records" element={<Records />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/reschedule" element={<Reschedule />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

export default App;
