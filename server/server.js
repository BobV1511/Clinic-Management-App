import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/health", (req, res) => res.json({ ok: true }));
// ===== MOCK DATA (trong bộ nhớ) =====
let appointments = [
  { id: 1, patient: "Alice", time: "2025-11-01 10:00", status: "booked" },
  { id: 2, patient: "Bob",   time: "2025-11-01 11:00", status: "booked" },
];

let records = [
  { id: "p001", name: "Alice", allergies: ["Penicillin"], history: ["Flu 2023"] },
  { id: "p002", name: "Bob",   allergies: [],             history: ["Annual check 2024"] },
];

// ===== ROUTES =====
// Appointments
app.get("/api/appointments", (req, res) => res.json(appointments));
app.post("/api/appointments/cancel/:id", (req, res) => {
  const id = Number(req.params.id);
  appointments = appointments.map(a => a.id === id ? { ...a, status: "cancelled" } : a);
  res.json({ ok: true });
});
app.post("/api/appointments/reschedule/:id", (req, res) => {
  const id = Number(req.params.id);
  // demo: dời 30 phút
  appointments = appointments.map(a => a.id === id ? { ...a, time: "2025-11-01 11:30" } : a);
  res.json({ ok: true });
});

// Records
app.get("/api/records", (req, res) => res.json(records));
app.get("/api/records/:id", (req, res) => {
  const r = records.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: "Not found" });
  res.json(r);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
