# Team Flow

This is my submission for the full-stack technical assessment. Team Flow is a task management application designed to handle project creation, role-based member management, and task tracking. 

The goal was to build a clean, functional API and a responsive frontend while focusing on proper authentication and database architecture.

## Tech Stack

*   **Frontend:** React 18 (Vite), Zustand for state management, Axios, TailwindCSS
*   **Backend:** Node.js, Express
*   **Database:** MongoDB with Mongoose ODM
*   **Auth:** JWT (Access and Refresh token rotation)
*   **Deployment:** Railway

## Core Features

*   **Authentication Flow:** Secure signup, login, and logout utilizing JWT access and refresh tokens.
*   **Project Management:** Users can create projects and invite others via email search. Roles are split into Admin and Member.
*   **Task Tracking:** Full CRUD for tasks. Tasks can be assigned, updated (priority/status), and filtered.
*   **Analytics Dashboard:** A high-level view showing task completion rates, overdue tasks, and workload breakdown.
*   **Security & Validation:** All incoming requests are validated using Joi schemas. Implemented basic rate-limiting (200 req / 15 min per IP) to prevent abuse.

## Structure Overview

```text
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection config
│   │   ├── controllers/    # Route logic
│   │   ├── middleware/     # Auth checks, error handling
│   │   ├── models/         # Mongoose schemas (User, Project, Task, RefreshToken)
│   │   ├── routes/         # Express routing
│   │   └── utils/          # Helpers (JWT generation, Joi validation)
│   └── server.js
└── frontend/
    └── src/
        ├── api/            # Axios instance and API calls
        ├── components/     # Reusable UI elements
        ├── pages/          # Main views (Dashboard, Projects, Login, etc.)
        └── store/          # Zustand slices

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

All protected routes require a valid JWT access token in the `Authorization` header.

### Authentication
*   **POST** `/api/v1/auth/signup` - Register a new account
*   **POST** `/api/v1/auth/login` - Authenticate user
*   **POST** `/api/v1/auth/refresh` - Issue new access and refresh tokens
*   **POST** `/api/v1/auth/logout` - Invalidate refresh token
*   **GET** `/api/v1/auth/me` - Get current user profile (Protected)

### Projects
*   **GET** `/api/v1/projects` - List all projects (Protected)
*   **POST** `/api/v1/projects` - Create a new project (Protected)
*   **GET** `/api/v1/projects/:id` - Get specific project details (Protected)
*   **DELETE** `/api/v1/projects/:id` - Delete a project (Protected, Admin only)
*   **PATCH** `/api/v1/projects/:id/members` - Add or remove project members (Protected, Admin only)

### Tasks
*   **GET** `/api/v1/projects/:id/tasks` - List all tasks for a specific project (Protected)
*   **POST** `/api/v1/projects/:id/tasks` - Create a new task (Protected, Admin only)
*   **PATCH** `/api/v1/tasks/:id` - Update task status or priority (Protected)
*   **DELETE** `/api/v1/tasks/:id` - Delete a task (Protected, Admin only)

### Miscellaneous 
*   **GET** `/api/v1/dashboard` - Get dashboard statistics and completion rates (Protected)
*   **GET** `/api/v1/users/search` - Search for users by email (Protected)
*   **GET** `/health` - API health check (Public)

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
