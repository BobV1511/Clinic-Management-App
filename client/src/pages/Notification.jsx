import React, { useState, useEffect } from "react";
import { api } from "../lib/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const list = await api.notifications.list();
        setNotifications(list);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotifications();
    const id = setInterval(fetchNotifications, 5000);
    return () => clearInterval(id);
  }, []);

  const reminderNotifications = notifications.filter(
    (n) => n.type === "reminder"
  );
  const systemNotifications = notifications.filter(
    (n) => n.type !== "reminder"
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Notifications</h2>

      {/* ================================
          REMINDER NOTIFICATIONS
      ================================= */}
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

      {/* ================================
          SYSTEM NOTIFICATIONS
      ================================= */}
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
  );
}
