// src/lib/api.js
const BASE =
  import.meta.env.VITE_API_BASE ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:4000";

async function http(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text();
  if (!res.ok) {
    const msg = typeof data === "string" ? data : data?.error || res.statusText;
    throw new Error(`${res.status} ${msg}`);
  }
  return data;
}

export const api = {
  // /health endpoint
  health: () => http("/health"),

  // Records API (matches frontend code)
  records: {
    list: () => http("/api/records"),
    get: (id) => http(`/api/records/${encodeURIComponent(id)}`),
  },

  // Appointments API (matches frontend code)
  appointments: {
    list: () => http("/api/appointments"),
    cancel: (id) => http(`/api/appointments/cancel/${id}`, { method: "POST" }),
    reschedule: (id, newTime) =>
      http(`/api/appointments/reschedule/${id}`, {
        method: "POST",
        body: JSON.stringify({ newTime }),
      }),
  },
};
