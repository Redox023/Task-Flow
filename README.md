# Team Flow — Full-Stack Task Management App

A full-stack project/task management application built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend), deployable on **Railway**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Zustand, Axios, TailwindCSS |
| Backend | Node.js, Express |
| Database | **MongoDB** (Mongoose ODM) |
| Auth | JWT (access + refresh tokens) |
| Deployment | Railway |

---

## Features

- 🔐 **JWT Authentication** — signup, login, refresh token rotation, logout
- 📁 **Projects** — create projects, invite members (ADMIN / MEMBER roles)
- ✅ **Tasks** — create, assign, update status/priority, filter by status/priority/assignee
- 📊 **Dashboard** — task stats, completion rate, overdue tasks, breakdown by assignee & priority
- 🔍 **User Search** — find users by email to add to projects
- 🛡️ **Validation** — Joi schemas on all endpoints
- ⚡ **Rate Limiting** — 200 req / 15 min per IP

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection (db.js)
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose models (User, Project, Task, RefreshToken)
│   │   ├── routes/         # Express routers
│   │   └── utils/          # JWT, response helpers, Joi validators
│   ├── server.js
│   ├── .env.example
│   └── railway.toml
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client + service calls
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Login, Signup, Projects, Project, Dashboard
│   │   └── store/          # Zustand state (auth, projects)
│   ├── .env.example
│   └── railway.toml
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally **OR** a MongoDB Atlas connection string

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT secrets
npm install
npm run dev        # nodemon on port 5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env — VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev        # Vite on port 5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas or local URI |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `JWT_ACCESS_EXPIRES` | Access token TTL (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES` | Refresh token TTL (e.g. `7d`) |
| `PORT` | Server port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## Deployment (Railway)

See the [Railway Deployment Guide](./railway_deploy_guide.md) for step-by-step instructions.

**Quick summary:**
1. Create free MongoDB Atlas cluster → get connection string
2. Deploy `backend/` as a Railway service → add env vars
3. Deploy `frontend/` as a Railway service → set `VITE_API_URL`
4. Set `CLIENT_URL` in backend to the frontend's Railway URL

---

## API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/auth/signup` | — | Register |
| POST | `/api/v1/auth/login` | — | Login |
| POST | `/api/v1/auth/refresh` | — | Refresh tokens |
| POST | `/api/v1/auth/logout` | — | Logout |
| GET | `/api/v1/auth/me` | ✅ | Current user |
| GET | `/api/v1/projects` | ✅ | List projects |
| POST | `/api/v1/projects` | ✅ | Create project |
| GET | `/api/v1/projects/:id` | ✅ | Get project |
| DELETE | `/api/v1/projects/:id` | ✅ Admin | Delete project |
| PATCH | `/api/v1/projects/:id/members` | ✅ Admin | Add/remove member |
| GET | `/api/v1/projects/:id/tasks` | ✅ | List tasks |
| POST | `/api/v1/projects/:id/tasks` | ✅ Admin | Create task |
| PATCH | `/api/v1/tasks/:id` | ✅ | Update task |
| DELETE | `/api/v1/tasks/:id` | ✅ Admin | Delete task |
| GET | `/api/v1/dashboard` | ✅ | Dashboard stats |
| GET | `/api/v1/users/search` | ✅ | Search users by email |
| GET | `/health` | — | Health check |

---

## Data Models (MongoDB / Mongoose)

### User
```
_id, fullName, email, passwordHash, createdAt, updatedAt
```

### Project
```
_id, name, description,
members: [{ userId, role: ADMIN|MEMBER }],
createdAt, updatedAt
```

### Task
```
_id, title, description,
status: TODO|IN_PROGRESS|DONE,
priority: LOW|MEDIUM|HIGH,
dueDate, projectId, assigneeId,
createdAt, updatedAt
```

### RefreshToken
```
_id, token, userId, expiresAt  (TTL index — auto-deleted)
```
