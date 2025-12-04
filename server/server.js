/**
 * File: server.js
 * Description: Main backend server configuration. Initializes Express app,
 *              sets up middleware, connects routes, and starts the server.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

let notifications = [];

let idCount = 1;
let notiId = 1;

function addNotification(msg, type = "system") {
  notifications.unshift({
    id: Date.now(),
    type,  
    message: msg,
    time: new Date().toISOString(),
  });

  console.log("🔔 NOTIFICATION:", msg);
}

app.get("/health", (req, res) => res.json({ ok: true }));


let users = [
  { id: 1, username: "admin", password: "admin123", name: "Administrator", role: "admin" },
  { id: 2, username: "staff", password: "staff123", name: "Clinic Staff", role: "staff" }
];

let appointments = [
  {
    id: 1,
    patient: "Alice",
    doctor: "Dr. Brown",
    department: "Cardiology",
    time: "2025-11-01 10:00",
    status: "booked",
    duration: 30,
    notes: "Routine heart check-up",
  },
  {
    id: 2,
    patient: "Bob",
    doctor: "Dr. Smith",
    department: "Dentistry",
    time: "2025-11-01 11:00",
    status: "booked",
    duration: 45,
    notes: "Tooth cleaning appointment",
  },
  {
    id: 3,
    patient: "Mike",
    doctor: "Dr. Taylor",
    department: "Dermatology",
    time: "2025-11-02 15:00",
    status: "booked",
    duration: 30,
    notes: "Skin rash follow-up",
  },
  {
    id: 4,
    patient: "Lisa",
    doctor: "Dr. Carter",
    department: "Pediatrics",
    time: "2025-11-03 11:00",
    status: "booked",
    duration: 15,
    notes: "Child health check",
  },
  {
    id: 5,
    patient: "John",
    doctor: "Dr. Adams",
    department: "Orthopedics",
    time: "2025-11-03 14:00",
    status: "booked",
    duration: 60,
    notes: "Knee pain evaluation",
  },
  {
    id: 6,
    patient: "Emma",
    doctor: "Dr. Wilson",
    department: "Allergy & Immunology",
    time: "2025-11-04 09:30",
    status: "booked",
    duration: 30,
    notes: "Allergy shot appointment",
  },
  {
    id: 7,
    patient: "Chris",
    doctor: "Dr. Evans",
    department: "General Medicine",
    time: "2025-11-04 10:30",
    status: "booked",
    duration: 45,
    notes: "Annual check-up",
  },
  {
    id: 8,
    patient: "Sophia",
    doctor: "Dr. Patel",
    department: "Ophthalmology",
    time: "2025-11-04 15:00",
    status: "booked",
    duration: 30,
    notes: "Eye test and lens fitting",
  },
  {
    id: 9,
    patient: "Daniel",
    doctor: "Dr. Brown",
    department: "Cardiology",
    time: "2025-10-28 09:00",
    status: "completed",
    duration: 60,
    notes: "Post-surgery review",
  },
  {
    id: 10,patient: "Olivia",doctor: "Dr. Smith",department: "Dentistry",time: "2025-10-28 10:30",status: "completed",
    duration: 30,notes: "Dental filling completed",
  },
];


let records = [
 { id: "p001", name: "Alice", age: 28, gender: "Female", bloodType: "A+", contact: "alice@gmail.com", address: "Toronto, ON", allergies: ["Penicillin"], history: ["Flu 2023", "Heart check 2024"], lastVisit: "2025-11-01" }, { id: "p002", name: "Bob", age: 35, gender: "Male", bloodType: "O+", contact: "bob@gmail.com", address: "Mississauga, ON", allergies: [], history: ["Annual dental check 2024"], lastVisit: "2025-11-01" }, { id: "p003", name: "Mike", age: 40, gender: "Male", bloodType: "B+", contact: "mike@gmail.com", address: "Markham, ON", allergies: ["Beef"], history: ["Flu 2024", "Skin rash treatment 2025"], lastVisit: "2025-11-02" }, { id: "p004", name: "Lisa", age: 7, gender: "Female", bloodType: "O-", contact: "lisa_parent@gmail.com", address: "Brampton, ON", allergies: ["Fish"], history: ["Flu 2023", "Child health check 2025"], lastVisit: "2025-11-03" }, { id: "p005", name: "John", age: 50, gender: "Male", bloodType: "A-", contact: "john@gmail.com", address: "Toronto, ON", allergies: ["Peanuts"], history: ["Knee pain 2023", "Orthopedic exam 2025"], lastVisit: "2025-11-03" }, { id: "p006", name: "Emma", age: 25, gender: "Female", bloodType: "B+", contact: "emma@gmail.com", address: "Vaughan, ON", allergies: ["Dust"], history: ["Asthma 2021", "Allergy shots 2023"], lastVisit: "2025-11-04" }, { id: "p007", name: "Chris", age: 32, gender: "Male", bloodType: "AB+", contact: "chris@gmail.com", address: "Richmond Hill, ON", allergies: [], history: ["Covid-19 2022", "Annual check 2025"], lastVisit: "2025-11-04" }, { id: "p008", name: "Sophia", age: 29, gender: "Female", bloodType: "A+", contact: "sophia@gmail.com", address: "Toronto, ON", allergies: ["Shellfish", "Latex"], history: ["Allergy treatment 2020", "Eye check 2025"], lastVisit: "2025-11-04" }, { id: "p009", name: "Daniel", age: 45, gender: "Male", bloodType: "O+", contact: "daniel@gmail.com", address: "Scarborough, ON", allergies: ["Bee stings"], history: ["Heart surgery 2024", "Post-surgery follow-up 2025"], lastVisit: "2025-10-28" }, { id: "p010", name: "Olivia", age: 30, gender: "Female", bloodType: "AB-", contact: "olivia@gmail.com", address: "Toronto, ON", allergies: ["Pollen"], history: ["Seasonal allergy 2023", "Dental filling 2025"], lastVisit: "2025-10-28" } ];



app.get("/api/appointments", (req, res) => res.json(appointments));

app.post("/api/appointments", (req, res) => {
  const { patient, doctor, department, time, duration, notes, status } = req.body;

  if (!patient || !doctor || !department || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newAppointment = {
    id: appointments.length ? appointments[appointments.length - 1].id + 1 : 1,
    patient,
    doctor,
    department,
    time,
    duration,
    notes,
    status: status || "booked",
  };

  appointments.push(newAppointment);
  addNotification(`New appointment created for ${patient}`);

  res.json(newAppointment);
});


function generateId() {
  const num = records.length + 1;
  return "p" + String(num).padStart(3, "0");
}



app.get("/api/records", (req, res) => {
  res.json(records);
});

app.post("/api/records", (req, res) => {
  const data = req.body;

  const newRecord = {
    id: generateId(),
    name: data.name,
    gender: data.gender,
    age: data.age,
    bloodType: data.bloodType,
    allergies: data.allergies || [],
    lastVisit: data.lastVisit,
    contact: data.contact,
    address: data.address || "",
    history: [],
  };

  records.push(newRecord);
  res.json(newRecord);
});


app.post("/api/appointments/cancel/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = appointments.findIndex((a) => a.id === id);

  if (idx < 0) return res.status(404).json({ error: "Not found" });

  appointments[idx].status = "canceled";

  addNotification(`Appointment #${id} was canceled`);

  return res.json({ ok: true });
});


app.post("/api/appointments/reschedule/:id", (req, res) => {
  const id = Number(req.params.id);
  const { newTime } = req.body || {};

  if (!newTime) return res.status(400).json({ error: "newTime required" });

  const idx = appointments.findIndex((a) => a.id === id);
  if (idx < 0) return res.status(404).json({ error: "Not found" });

  const hasConflict = appointments.some(
    (a) => a.id !== id && a.time === newTime && a.status !== "canceled"
  );

  if (hasConflict)
    return res.status(409).json({ error: "time conflict" });

  appointments[idx].time = newTime;
  appointments[idx].status = "booked";

  addNotification(`Appointment #${id} rescheduled`);

  return res.json({ ok: true });
});


app.post("/api/appointments/:id/remind", (req, res) => {
  const appt = appointments.find((a) => a.id == req.params.id);
  if (!appt) return res.status(404).json({ error: "Not found" });

  notifications.push({
    id: notiId++,
    type: "reminder",
    message: `Reminder sent for appointment for ${appt.patient}`,
    time: new Date().toISOString(),
  });

  res.json({ success: true });
});


app.get("/api/records", (req, res) => res.json(records));

app.get("/api/records/:id", (req, res) => {
  const r = records.find((x) => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: "Not found" });
  res.json(r);
});


app.get("/api/alerts", (req, res) => {
  const alerts = [];
  const now = new Date();

  const overdueAppointments = appointments.filter((a) => {
    const t = new Date(a.time);
    return t < now && a.status === "booked";
  });
  if (overdueAppointments.length > 0) {
    alerts.push(`${overdueAppointments.length} overdue appointment(s)`);
  }

  const oldPatients = records.filter((r) => {
    const lastVisit = new Date(r.lastVisit);
    const days = (now - lastVisit) / (1000 * 60 * 60 * 24);
    return days > 365;
  });
  if (oldPatients.length > 0) {
    alerts.push(`${oldPatients.length} patient(s) need follow-up`);
  }

  if (alerts.length === 0) alerts.push("No current alerts.");
  res.json(alerts);
});



app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

setInterval(() => {
  console.log("Checking auto reminders...");

  const now = new Date();

  appointments.forEach((appt) => {
    if (appt.reminderSent) return;

    const createdAt = new Date(appt.createdAt || appt.time);
    const diff = now - createdAt;

    if (diff >= 60000) {
      notifications.unshift({
        id: Date.now(),
        type: "reminder",
        message: `Auto reminder: ${appt.patient}'s appointment`,
        time: new Date().toISOString(),
      });

      appt.reminderSent = true;
      console.log("AUTO REMINDER SENT (interval) FOR:", appt.patient);
    }
  });
}, 10000);


app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});


function getUpcomingAppointments() {
  const now = new Date();
  const upcoming = [];

  for (const a of appointments) {
    if (a.status === "canceled") continue;

    const time = new Date(a.time);

    const hoursDiff = (time - now) / (1000 * 60 * 60);

    if (hoursDiff > 0 && hoursDiff <= 24) {
      upcoming.push(a);
    }
  }

  return upcoming;
}

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password)
    return res.status(400).json({ error: "Missing username/password" });

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ error: "Invalid username or password" });

  const safeUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  };

  return res.json({ user: safeUser });
});

app.get("/api/auth/me", (req, res) => {
  res.json({ ok: true });
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔥 Backend running on http://localhost:${PORT}`);
});
