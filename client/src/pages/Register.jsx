/**
 * File: Register.jsx
 * Description: User registration form with input validation and API submission.
 */
/**
 * Algorithm: User Registration and Input Validation
 *
 * 1. Initialize Form:
 *    - Use useState() to store form fields: username, password, confirm.
 *    - Track error/validation messages in 'msg'.
 *    - Prepare navigate() for redirecting after successful registration.
 *
 * 2. Handle Input Changes:
 *    - On every keystroke in any input field:
 *        a. Update the corresponding value inside the form object.
 *        b. Keep the form state in sync with the UI.
 *
 * 3. Validate Passwords:
 *    - On form submission:
 *        a. Prevent default browser behavior.
 *        b. Check if form.password matches form.confirm.
 *        c. If not matched:
 *              - Display error: “Passwords do not match”.
 *              - Stop the submission process.
 *
 * 4. Save User Account:
 *    - If passwords match:
 *        a. Save user credentials to localStorage under key 'user':
 *              { username, password }
 *        b. No backend API is used in this simplified version.
 *
 * 5. Redirect to Login:
 *    - After saving the user data, navigate the user to /login.
 *
 * 6. Render UI:
 *    - Display a styled registration form with:
 *        a. Username input
 *        b. Password input
 *        c. Confirm password input
 *    - Show validation message (msg) if needed.
 *    - Provide a link for users who already have an account.
 *
 * Summary:
 * This component registers a new user by validating password fields,
 * saving the account to localStorage, and redirecting the user to
 * the login page upon successful registration.
 */

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm: '',
  })

  const [msg, setMsg] = useState('')

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.password !== form.confirm) {
      setMsg('Passwords do not match')
      return
    }

    localStorage.setItem(
      'user',
      JSON.stringify({
        username: form.username,
        password: form.password,
      })
    )

    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white w-[420px] shadow-2xl rounded-3xl p-10 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Join us to access the full dashboard!
        </p>

        {msg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-center mb-5 font-medium">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 font-semibold">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-5"
            onChange={handleChange}
            required
          />

          <label className="block mb-2 text-gray-700 font-semibold">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-5"
            onChange={handleChange}
            required
          />

          <label className="block mb-2 text-gray-700 font-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-8"
            onChange={handleChange}
            required
          />

          {}
          <button
            type="submit"
            className="btn btn-primary w-full py-3 rounded-xl"
          >
            Create Account
          </button>

          <div className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
