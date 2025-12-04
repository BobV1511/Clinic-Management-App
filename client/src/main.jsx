/**
 * File: main.jsx
 * Description: Entry point of the React application. Renders App component to the DOM.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import Dashboard from './pages/Dashboard.jsx'
import Records from './pages/Records.jsx'
import Appointments from './pages/Appointments.jsx'
import Reschedule from './pages/Reschedule.jsx'
import RecordDetail from './pages/RecordDetail.jsx'
import NewAppointment from './pages/NewAppointment.jsx'
import Notification from './pages/Notification.jsx'

import Login from './pages/Login.jsx'
import Layout from './pages/Layout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Register from './pages/Register.jsx'
import NewRecord from './pages/NewRecord.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {}
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
          {}
          <Route path="records/new" element={<NewRecord />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
