# CodeStash

A full‑stack code snippet app built with React (frontend) and Node/Express + MongoDB (backend), with OTP-based email verification for signup and password reset.

## Monorepo Structure

- `frontend/` — React app (Create React App), routes, Auth context, responsive UI, favicon is set.
- `backend/` — Express API with JWT auth, OTP flows, Nodemailer (Gmail SMTP), Mongoose models.

## Requirements

- Node.js 18+ and npm
- MongoDB (Atlas or self-hosted)

## Environment Variables

Copy and edit the example files:

- `frontend/.env.example` → create `frontend/.env`
  - `REACT_APP_API_URL` — your backend URL with `/api` suffix, e.g. `https://api.example.com/api`
- `backend/.env.example` → create `backend/.env`
  - `PORT` — default `5000`
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — strong secret
  - Email (one of)
    - Gmail: `EMAIL_SERVICE=gmail`, `EMAIL_USER`, `EMAIL_PASS` (App Password), `EMAIL_FROM`
    - Custom SMTP: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`
  - `DEV_EMAIL_FALLBACK=true` to surface OTP in development if email fails

## Run Locally

1) Backend

```powershell
cd D:\CodeStash\backend
npm install
npm start
```

2) Frontend (in a second terminal)

```powershell
cd D:\CodeStash\frontend
npm install
npm run dev
```

## Build (Frontend)

```powershell
cd D:\CodeStash\frontend
npm run build
```
Output is in `frontend/build/`.

## Notes

- Favicon is set via `frontend/public/favicon.svg` and linked in `public/index.html`.
- The frontend uses `REACT_APP_API_URL` at runtime for API calls.
- OTP dev fallback prints OTP to API responses when emails can’t be sent (development only).
