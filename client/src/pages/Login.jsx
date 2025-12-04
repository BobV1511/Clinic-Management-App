/**
 * File: Login.jsx
 * Description: User login page with authentication logic and form validation.
 */
/**
 * Algorithm: User Login Authentication
 *
 * 1. Initialize Form:
 *    - Track user inputs using useState() for email, password, and message feedback.
 *    - Prepare useNavigate() to redirect users after successful login.
 *
 * 2. Handle Login Submission:
 *    - When the form is submitted, prevent default browser behavior.
 *    - Retrieve saved account data from localStorage ('user').
 *    - If there is no saved account:
 *        a. Display message telling the user to register first.
 *        b. Stop login process.
 *
 * 3. Validate Credentials:
 *    - Compare input email and password with saved.username and saved.password.
 *    - If both match:
 *        a. Store a login token into localStorage ('token').
 *        b. Redirect user to the dashboard ('/').
 *    - If credentials do not match:
 *        a. Display an error message: “Email or password is incorrect!”
 *
 * 4. UI Rendering:
 *    - Render login form with fields for email and password.
 *    - Show feedback message when login fails.
 *    - Provide a link redirecting users to the registration page.
 *
 * Summary:
 * This component authenticates the user by validating input credentials
 * against data stored in localStorage, then redirects to the dashboard
 * upon successful login.
 */

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    const saved = JSON.parse(localStorage.getItem('user'))

    if (!saved) {
      setMsg("Don't have an account yet, please register first!")
      return
    }

    if (email === saved.username && password === saved.password) {
      localStorage.setItem('token', 'logged')
      navigate('/')
    } else {
      setMsg('Email or password is incorrect!')
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f3f4f6',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: '350px',
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

        {msg && (
          <p
            style={{
              color: 'red',
              textAlign: 'center',
              marginBottom: '10px',
            }}
          >
            {msg}
          </p>
        )}

        <label>Email</label>
        <input
          type="text"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />

        <button
          style={{
            width: '100%',
            padding: '10px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Login
        </button>

        <div className="text-center mt-3" style={{ marginTop: '12px' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  )
}
