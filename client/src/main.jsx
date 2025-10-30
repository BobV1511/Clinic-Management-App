// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Dashboard from "./pages/Dashboard.jsx";
import Records from "./pages/Records.jsx";
import Appointments from "./pages/Appointments.jsx";
import Reschedule from "./pages/Reschedule.jsx";
import RecordDetail from "./pages/RecordDetail.jsx";

function Layout({ children }) {
  return (
    <>
      <nav className="navbar navbar-expand bg-light mb-3">
        <div className="container">
          <div className="navbar-nav gap-3">
            <Link className="nav-link" to="/">Dashboard</Link>
            <Link className="nav-link" to="/records">Records</Link>
            <Link className="nav-link" to="/appointments">Appointments</Link>
            <Link className="nav-link" to="/reschedule">Reschedule</Link>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/:id" element={<RecordDetail />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/reschedule" element={<Reschedule />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
export default App;
