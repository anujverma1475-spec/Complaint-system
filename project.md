## Full Prompt — College Complaint Portal (MERN Stack, Btech Mini Project) 

Paste this whole thing to your AI coding agent as the task brief.

---

### 0. Instructions for the AI Agent

You are building this project end-to-end. Work in this order, and confirm each layer runs/tests correctly before moving to the next:

1. Scaffold the folder structure (see section 4) for both client and server; init package.json in each; install dependencies.
2. Backend: connect MongoDB, build the Mongoose schemas (section 5), then build auth routes + JWT middleware. Test with a REST client before continuing.
3. Backend: build complaint routes (student) and admin routes, including the status-history update logic. Test each endpoint.
4. Seed script: create one default admin account (email/password from `.env`).
5. Frontend: set up React Router, AuthContext, ProtectedRoute, and the shared layout/navigation shells (mobile-first, per section 9).
6. Frontend: build pages in this order — Login/Register → Student Dashboard → New Complaint form → Complaint Detail → Admin Dashboard → Admin Complaint List/Detail.
7. Wire loading states, error handling, and status-change toasts.
8. Write `.env.example` and README with setup steps.

Do not skip ahead to frontend polish before the backend endpoints are verified working — the whole app depends on that contract being correct first.

---

### 1. Project Overview

Build a full-stack, mobile-first College Complaint Portal using the MERN stack (MongoDB, Express.js, React, Node.js). This is a BCA mini-project deliverable, so prioritize clean structure, working core features, and a presentable UI over extra scope.

- **Difficulty:** Medium
- **Core Modules:** Submit Complaint · Status Tracking · Admin Response
- **Design Priority:** Mobile-first (375px baseline, scales up with breakpoints)

---

### 2. Core Features

- **Auth** — Student registration/login and Admin login (JWT-based, role field: `student` / `admin`). Passwords hashed with bcrypt.
- **Complaint Submission** — title, category (Hostel, Academic, Infrastructure, Ragging, Other), description, optional image upload, auto-timestamp, auto-linked student ID.
- **Status Tracking** — Pending → In Review → Resolved / Rejected, with a visible timeline/history of status changes on the student dashboard.
- **Admin Response** — dashboard listing all complaints (filterable by status/category), detail view, status change control, text response/remark visible to student.
- **Basic Notifications** — on-screen toast/banner when a complaint's status changes.

---

### 3. Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS — mobile-first breakpoints (`sm` / `md` / `lg`)
- **Backend:** Node.js + Express, REST API, JWT auth middleware, role-based access control
- **Database:** MongoDB + Mongoose — User and Complaint schemas (Complaint references User, includes `statusHistory` array)
- **File uploads:** Multer, stored locally in `/uploads` (Cloudinary noted as optional upgrade)
- **Validation:** express-validator on backend; client-side validation on forms

---

### 4. Folder Structure

```
complaint-portal/
  client/                 React app (Vite)
    src/
      components/       shared UI: Navbar, StatusBadge, ComplaintCard, ProtectedRoute
      pages/             route-level pages (see section 7)
      context/           AuthContext (user, token, role)
      api/               axios instance + endpoint functions
      App.jsx, main.jsx
  server/                 Node + Express
    models/              User.js, Complaint.js
    routes/              auth.routes.js, complaint.routes.js, admin.routes.js
    controllers/         auth.controller.js, complaint.controller.js, admin.controller.js
    middleware/          auth.middleware.js (JWT verify), role.middleware.js
    uploads/             multer file storage
    config/              db.js
    seed/                createAdmin.js
    server.js
  .env.example
  README.md
```

---

### 5. Mongoose Schemas

**User**
```
{
  name: String,
  email: { type: String, unique: true },
  password: String,        // bcrypt hash
  role: { type: String, enum: ['student','admin'], default: 'student' },
  rollNo: String,
  department: String,
  createdAt: Date
}
```

**Complaint**
```
{
  student: { type: ObjectId, ref: 'User' },
  title: String,
  category: { type: String, enum: ['Hostel','Academic','Infrastructure','Ragging','Other'] },
  description: String,
  imageUrl: String,
  status: { type: String, enum: ['Pending','In Review','Resolved','Rejected'], default: 'Pending' },
  statusHistory: [{
    status: String,
    remark: String,
    updatedBy: { type: ObjectId, ref: 'User' },
    updatedAt: Date
  }],
  createdAt: Date
}
```

---

### 6. Backend API Routes

**`/api/auth`** (public)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /register | Public | Student signup (name, email, password, roll no/dept) |
| POST | /login | Public | Login for both student & admin, returns JWT + role |
| GET | /me | Protected | Get logged-in user's profile from token |

**`/api/complaints`** (student-facing)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | / | Student | Submit new complaint (with optional image) |
| GET | /my | Student | Get all complaints submitted by logged-in student |
| GET | /:id | Student (own) / Admin | Get single complaint detail + status history |

**`/api/admin`** (admin-only, role middleware)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | /complaints | Admin | Get all complaints (query filters: ?status=&category=) |
| PATCH | /complaints/:id/status | Admin | Update status + add remark (pushes to statusHistory) |
| GET | /stats | Admin | Counts by status/category for dashboard cards |
| GET | /students | Admin | (optional) list of registered students |

---

### 7. Frontend Pages & Role Access

**Public (unauthenticated)**
- `/` — Landing page (brief intro + Login/Register CTA)
- `/login` — Single login form, role auto-detected from backend response
- `/register` — Student registration only (admin seeded manually)

**Student role**
- `/dashboard` — List of own complaints as cards, status badges, "+ New Complaint" button (mobile: floating action button)
- `/complaints/new` — Complaint submission form (title, category dropdown, description, image upload)
- `/complaints/:id` — Complaint detail view: description, image, status timeline, admin remarks

**Admin role**
- `/admin/dashboard` — Stats cards (Pending/In Review/Resolved counts) + recent complaints list
- `/admin/complaints` — Full complaint list with filters (status, category, search) — table on desktop, stacked cards on mobile
- `/admin/complaints/:id` — Detail view + status update dropdown + remark textarea + "Update" button

**Shared**
- `/profile` — View basic account info, logout
- 404 page for undefined routes

---

### 8. Route Protection Logic (React Router)

```
<Route path="/dashboard" element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>} />
<Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>} />
```

- `ProtectedRoute` checks JWT in localStorage/context, decodes role, redirects to `/login` if missing, or to a "not authorized" page if role mismatch.
- On login, redirect based on role: student → `/dashboard`, admin → `/admin/dashboard`.

---

### 9. Mobile-First Navigation Pattern

- **Student:** bottom tab bar (Home, New Complaint, Profile) on mobile → top navbar on `md:` breakpoint.
- **Admin:** hamburger drawer on mobile (Dashboard, Complaints, Logout) → fixed sidebar on `md:` breakpoint.

---

### 10. Deliverable Expectations

- Clean folder structure (`/client`, `/server`, separated by models, routes, controllers, middleware)
- `.env.example` for config (Mongo URI, JWT secret, port)
- Seed script to create one default admin account
- README with setup steps, tech stack, and a screenshots section for the project report
- Basic error handling and loading states (skeletons/spinners)
- Polished but simple UI: card-based complaint list, color-coded status badges, clean forms

---

### 11. Future Scope (optional, mention in report if skipped)

- Search/filter complaints by category or date
- Complaint priority levels
- Analytics dashboard for admin (complaints by category/status, simple chart)