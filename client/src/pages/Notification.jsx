/**
 * File: Notification.jsx
 * Description: Display system notifications such as booked or changed appointments.
 */
/**
 * Algorithm: Display and Update System Notifications
 *
 * 1. Initialize State:
 *    - Use useState() to store the list of all notifications.
 *
 * 2. Fetch Notifications on Load:
 *    - When the component loads:
 *        a. Call api.notifications.list() to retrieve all notifications.
 *        b. Save the result into the notifications state.
 *
 * 3. Auto-Refresh Notifications:
 *    - After initial load:
 *        a. Set up a 5-second interval using setInterval().
 *        b. On each interval, re-fetch notifications from the API.
 *        c. Ensure the interval is cleared when the component unmounts
 *           to avoid memory leaks.
 *
 * 4. Categorize Notifications:
 *    - Separate notifications into:
 *        a. reminderNotifications → notifications with type === "reminder"
 *        b. systemNotifications → all other notification types
 *
 * 5. Render UI:
 *    - Display the page header “Notifications”.
 *    - Render two sections:
 *        a. Reminder Notifications
 *            - If empty → show “No reminder notifications”
 *            - If not empty → display notifications in a list with:
 *                  • message
 *                  • timestamp formatted using toLocaleString()
 *
 *        b. System Notifications
 *            - If empty → show “No system notifications”
 *            - If not empty → display messages in a list with timestamps
 *
 * Summary:
 * This component retrieves notifications from the backend, updates them every
 * 5 seconds, separates them by type, and renders them into two categorized
 * lists for user viewing.
 */

import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const list = await api.notifications.list()
        setNotifications(list)
      } catch (e) {
        console.error(e)
      }
    }

    fetchNotifications()
    const id = setInterval(fetchNotifications, 5000)
    return () => clearInterval(id)
  }, [])

  const reminderNotifications = notifications.filter(
    (n) => n.type === 'reminder'
  )
  const systemNotifications = notifications.filter((n) => n.type !== 'reminder')

  return (
    <div className="container py-4">
      <h2 className="mb-4">Notifications</h2>

      {}
      <h5 className="mt-3">Reminder Notifications</h5>

      {reminderNotifications.length === 0 ? (
        <div className="alert alert-secondary">No reminder notifications</div>
      ) : (
        <ul className="list-group mb-4">
          {reminderNotifications.map((n) => (
            <li key={n.id} className="list-group-item">
              <strong>{n.message}</strong>
              <br />
              <small className="text-muted">
                {new Date(n.time).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}

      {}
      <h5>System Notifications</h5>

      {systemNotifications.length === 0 ? (
        <div className="alert alert-secondary">No system notifications</div>
      ) : (
        <ul className="list-group">
          {systemNotifications.map((n) => (
            <li key={n.id} className="list-group-item">
              <strong>{n.message}</strong>
              <br />
              <small className="text-muted">
                {new Date(n.time).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
