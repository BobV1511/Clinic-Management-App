import { NavLink, Outlet } from "react-router-dom";
import { useEffect } from "react";          
import { runAutoReminder } from "../lib/api";

export default function Layout() {

 
  useEffect(() => {
    runAutoReminder();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
        <div className="container">

          {/* BRAND */}
          <span className="navbar-brand fw-bold text-primary">Clinic System</span>

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

            </ul>

            {/* NEW BOOKING BUTTON */}
            <NavLink
              to="/new"
              className="btn btn-primary btn-sm px-3 me-3"
            >
              + New Booking
            </NavLink>

          </div>

        </div>
      </nav>

      {/* CONTENT HERE */}
      <div className="container mb-5">
        <Outlet />
      </div>
    </>
  );
}
