/**
 * File: Layout.jsx
 * Description: Global layout component handling page structure and navigation UI.
 */
/**
 * Algorithm: Layout Rendering and Global Behaviors
 *
 * 1. Initialize Layout:
 *    - When the component loads, run useEffect().
 *    - Inside useEffect(), call runAutoReminder() to automatically send
 *      reminders for upcoming appointments (backend-triggered logic).
 *
 * 2. Navigation Rendering:
 *    - Display a top navigation bar with links:
 *        a. Dashboard
 *        b. Records
 *        c. Appointments
 *        d. Reschedule
 *        e. Notifications
 *        f. New Booking button
 *    - Clicking each NavLink switches the page using React Router.
 *
 * 3. Logout Process:
 *    - When user clicks “Logout”:
 *        a. Remove the stored JWT token from localStorage
 *        b. Redirect the user to the login page (/login)
 *
 * 4. Main Content Rendering:
 *    - Use <Outlet /> to display the child page (Dashboard, Records, etc.)
 *      inside the shared Layout UI.
 *    - Ensures consistent layout and container spacing across pages.
 *
 * Summary:
 * This component manages the global UI structure (navbar + page container),
 * handles automatic reminders, and controls user logout behavior.
 */

import { NavLink, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { runAutoReminder } from '../lib/api'

export default function Layout() {
  function handleLogout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  useEffect(() => {
    runAutoReminder()
  }, [])

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
        <div className="container">
          {}
          <span className="navbar-brand fw-bold text-primary">
            Clinic System
          </span>

          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav me-auto gap-2">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/records">
                  Records
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/appointments">
                  Appointments
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/reschedule">
                  Reschedule
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/notifications">
                  Notifications
                </NavLink>
              </li>

              <button onClick={handleLogout}>Logout</button>
            </ul>

            {}
            <NavLink to="/new" className="btn btn-primary btn-sm px-3 me-3">
              + New Booking
            </NavLink>
          </div>
        </div>
      </nav>

      {}
      <div className="container mb-5">
        <Outlet />
      </div>
    </>
  )
}
