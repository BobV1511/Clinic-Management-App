import { BASE } from "./config";

async function http(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  appointments: {
    list: () => http("/api/appointments"),

    create: (data) =>
      http("/api/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    cancel: (id) =>
      http(`/api/appointments/cancel/${id}`, { method: "POST" }),

    reschedule: (id, newTime) =>
      http(`/api/appointments/reschedule/${id}`, {
        method: "POST",
        body: JSON.stringify({ newTime }),
      }),

    remind: (id) =>
      http(`/api/appointments/${id}/remind`, {
        method: "POST",
      }),
  },

  notifications: {
    list: () => http("/api/notifications"),
  },

  
  records: {
    list: () => http("/api/records"),
    get: (id) => http(`/api/records/${id}`),
    create: (data) =>
      http("/api/records", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  


  auth: {
    login: (data) =>
      http("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  health: () => http("/health"),
};

export const runAutoReminder = async () => {
  const res = await fetch("http://localhost:5000/api/reminders/run", {
    method: "POST",
  });
  return res.json();
};
