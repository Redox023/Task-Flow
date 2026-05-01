# Team Flow: Complete Setup & Deployment Guide

This guide walks you through setting up the Team Flow application locally for development and deploying it live on Railway.

---

## Part 1: Local Development Setup

To run the application locally, you will need to run both the backend (Node.js/Express) and frontend (Vite/React) servers.

### Prerequisites
1. **Node.js**: Make sure you have Node.js installed (v18+ recommended).
2. **MongoDB**: You need a running MongoDB database. You can either:
   - Install MongoDB locally.
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 1. Setup the Backend
Open a terminal in the root of your project:
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment variables file
cp .env.example .env
```

**Edit your `backend/.env` file**:
Open the newly created `.env` file and set up your variables:
- `MONGODB_URI`: Set this to your MongoDB connection string (e.g., `mongodb://localhost:27017/teamflow` for local, or your Atlas URI).
- `JWT_ACCESS_SECRET`: Create a random string (e.g., `supersecret_access`).
- `JWT_REFRESH_SECRET`: Create a different random string (e.g., `supersecret_refresh`).
- `PORT`: Keep it at `5000`.
- `CLIENT_URL`: Keep it as `http://localhost:5173`.

**Start the Backend**:
```bash
npm run dev
```
*The backend should now be running on http://localhost:5000.*

### 2. Setup the Frontend
Open a **new** terminal tab in the root of your project:
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create your environment variables file
cp .env.example .env
```

**Edit your `frontend/.env` file**:
Ensure the `VITE_API_URL` points to your local backend server:
```
VITE_API_URL=http://localhost:5000/api/v1
```

**Start the Frontend**:
```bash
npm run dev
```
*The frontend should now be running on http://localhost:5173.*

---

## Part 2: Deployment (Online via Railway)

We will deploy the application on **Railway** because it natively supports monorepos (front/back ends in separate folders) and is very easy to configure. 

### Step 1: Push Code to GitHub
Ensure all your latest code is pushed to a GitHub repository.

### Step 2: Get a Production MongoDB Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free cluster.
3. Under **Database Access**, create a user with a strong password.
4. Under **Network Access**, add `0.0.0.0/0` to allow connections from anywhere (required for Railway).
5. Click **Connect** -> **Drivers** and copy your Connection String (`MONGODB_URI`).

### Step 3: Deploy the Backend
1. Go to [Railway.app](https://railway.app/) and create an account/login.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your `teamflow` repository.
4. When prompted, you need to set the **Root Directory** to `/backend`.
5. Once added to the canvas, click the Backend service block -> go to the **Variables** tab.
6. Add the following variables:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string (replace `<password>` with your DB user's password).*
   - `JWT_ACCESS_SECRET`: *A strong random string.*
   - `JWT_REFRESH_SECRET`: *Another strong random string.*
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
7. Go to the **Settings** tab -> **Networking** section, and click **Generate Domain**. 
   - *Copy this domain URL (e.g., `https://backend-production-xxxx.up.railway.app`).*

### Step 4: Deploy the Frontend
1. Back on your Railway Project canvas, click the **+ New** button -> **GitHub Repo**.
2. Select the *same* `teamflow` repository again.
3. Set the **Root Directory** to `/frontend`.
4. Click the newly created Frontend service block -> go to the **Variables** tab.
5. Add the following variable:
   - `VITE_API_URL`: `https://your-backend-domain.up.railway.app/api/v1` *(Replace with the domain you generated in Step 3! Make sure to include `/api/v1` at the end).*
6. Go to the **Settings** tab -> **Networking** section, and click **Generate Domain**.
   - *Copy this domain URL (e.g., `https://frontend-production-xxxx.up.railway.app`).*

### Step 5: Final Configuration (CORS)
1. Go back to your **Backend service** in Railway.
2. In the **Variables** tab, add or update the following variable:
   - `CLIENT_URL`: `https://your-frontend-domain.up.railway.app` *(Replace with the frontend domain generated in Step 4).*
3. Wait for the backend to automatically redeploy.

### 🎉 You're Live!
Navigate to your Frontend domain generated in Step 4. Your application should be fully functional online!
