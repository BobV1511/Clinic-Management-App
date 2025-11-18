import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import RecordDetail from "./pages/RecordDetail";
import Appointments from "./pages/Appointments";
import Reschedule from "./pages/Reschedule";
import NewAppointment from "./pages/NewAppointment";
import Notification from "./pages/Notification";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="records" element={<Records />} />
          <Route path="records/:id" element={<RecordDetail />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reschedule" element={<Reschedule />} />
          <Route path="new" element={<NewAppointment />} />
          <Route path="notifications" element={<Notification />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
