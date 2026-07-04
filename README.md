# Ayeshi I. Jayarathna — Portfolio

A full-stack personal portfolio website with a public-facing site and a
password-protected admin dashboard for managing content (profile, projects,
education, experience, certificates, and skills).

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM (client-side routing)
- Tailwind CSS
- Framer Motion (animations)
- react-icons

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- JWT-based authentication (admin login)
- Cloudinary + Multer (image uploads)
- Nodemailer (contact form emails)

**Hosting**
- Both frontend and backend are deployed separately on Vercel
- MongoDB Atlas (cloud database)

## Project Structure

```
portfolio-latest/
├── backend/
│   ├── models/          # Mongoose schemas (Profile, Project, Education, etc.)
│   ├── routes/          # Express route handlers
│   ├── middleware/       # Auth middleware
│   ├── public/           # Static assets (images, certificates)
│   ├── server.js         # Express app entry point
│   └── vercel.json       # Vercel serverless config
└── frontend/
    ├── src/
    │   ├── sections/      # Public page sections (Home, About, Projects, etc.)
    │   ├── admin/         # Admin login + dashboard
    │   ├── components/    # Shared UI components
    │   ├── context/       # Theme context
    │   └── config.js      # API base URL + fetch helper
    └── vercel.json        # SPA rewrite rules
```

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:5000
```

Create a `.env` file in `backend/` (see `.env.example`):

```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/portfolio
PORT=5000
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_super_secret_jwt_key_change_this
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend

```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

By default the frontend talks to the backend via Vite's dev proxy
(`/api` → `http://localhost:5000`), so no `VITE_API_URL` is needed locally.

## Deployment (Vercel)

The frontend and backend are deployed as **two separate Vercel projects**.

### Backend project

Set these Environment Variables in Vercel (Settings → Environment Variables),
scoped to **Production** (and Preview if you want preview deployments to work
too):

- `MONGO_URI`
- `CLIENT_URL` — your frontend's production URL (e.g. `https://portfolio-latest-3719.vercel.app`)
- `JWT_SECRET`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- `EMAIL_USER`, `EMAIL_PASS`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

**MongoDB Atlas Network Access:** since Vercel serverless functions use
dynamic IPs, Atlas → Network Access must allow `0.0.0.0/0` (Allow access from
anywhere), or every request will fail to connect.

### Frontend project

Set `VITE_API_URL` to the backend's deployed URL, e.g.
`https://portfolio-latest-pi-nine.vercel.app`.

## Admin Dashboard

- URL: `https://<your-frontend-domain>/admin`
- Log in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` set in the backend's
  environment variables (case-sensitive)
- After logging in you're redirected to `/admin/dashboard`, where you can
  manage all site content

## Gotchas Fixed During Setup

A few non-obvious issues came up getting this running on Vercel — noting
them here in case they resurface:

1. **CORS on preview deployments** — Vercel preview URLs include a random
   hash (`portfolio-latest-xxxxx-username.vercel.app`) that changes per
   deployment. The backend's CORS config uses a regex to allow any
   `portfolio-latest-*.vercel.app` origin, not just one fixed `CLIENT_URL`.

2. **DB connection must be established *before* routes are registered** —
   in `server.js`, the middleware that awaits `connectDB()` has to be
   `app.use()`'d **before** the route handlers. If it comes after, Express
   matches the route first and the connection-check middleware never runs,
   so queries silently buffer and time out after ~10s.

3. **SPA client-side routes need a rewrite rule** — visiting `/admin`
   directly (not via in-app navigation) returned a 404 from Vercel, because
   there's no physical `/admin` file to serve. `frontend/vercel.json`
   rewrites all paths to `/index.html` so React Router can handle routing
   client-side.

4. **Serverless cold starts can cause transient 500s** — multiple API calls
   firing at once (e.g. on page load) can each hit a fresh, "cold" function
   instance, all racing to open a MongoDB connection at once. The frontend's
   `fetchWithRetry()` helper (in `config.js`) retries failed GET requests a
   couple of times with backoff to smooth this over.
