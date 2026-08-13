# College Complaint Portal 🎓

A full-stack, mobile-first College Complaint Management System built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).

## Features

- **Student Portal** — Submit complaints with images, track status in real-time
- **Admin Dashboard** — View all complaints, filter by status/category, update status with remarks
- **JWT Authentication** — Secure login with role-based access (student/admin)
- **Mobile-First Design** — Responsive dark UI with glassmorphism, bottom nav (student), hamburger drawer (admin)
- **Status Timeline** — Visual history of every status change with remarks

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), React Router, Vanilla CSS |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| File Upload | Multer |
| Validation | express-validator |

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)

### 1. Clone & Configure

```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 2. Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 3. Seed Admin Account

```bash
cd server && npm run seed
```

Default admin: `admin@college.com` / `admin123` (change in .env)

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

### 5. Open in browser
- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

## Folder Structure

```
complaint-portal/
├── client/                 React app (Vite)
│   └── src/
│       ├── api/            Axios instance + API functions
│       ├── components/     Navbar, StatusBadge, ComplaintCard, Toast, Loader
│       ├── context/        AuthContext
│       └── pages/          Landing, Login, Register, Dashboard, etc.
├── server/                 Node + Express
│   ├── config/             Database connection
│   ├── controllers/        Auth, Complaint, Admin logic
│   ├── middleware/          JWT auth, role-based access
│   ├── models/             User, Complaint schemas
│   ├── routes/             API route definitions
│   ├── seed/               Admin account seeder
│   └── uploads/            Uploaded images
├── .env.example
└── README.md
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /register | Public | Student signup |
| POST | /login | Public | Login (student/admin) |
| GET | /me | Protected | Get profile |

### Complaints (`/api/complaints`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | / | Student | Submit complaint |
| GET | /my | Student | List own complaints |
| GET | /:id | Student/Admin | Complaint detail |

### Admin (`/api/admin`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /complaints | Admin | All complaints (filterable) |
| PATCH | /complaints/:id/status | Admin | Update status + remark |
| GET | /stats | Admin | Dashboard statistics |

## Screenshots

> Add screenshots here for your project report

## Future Scope

- Search/filter complaints by date
- Complaint priority levels
- Analytics dashboard with charts
- Email notifications
- Cloudinary for image hosting
