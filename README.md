# QuickHire AI

QuickHire AI is a full-stack recruitment platform for candidates and recruiters. Candidates can browse jobs, upload resumes, apply, and track their applications, while recruiters can post jobs, review applicants, and update application status.

## What this project includes

- React 19 + Vite frontend with Tailwind CSS
- Express + MongoDB backend with JWT authentication
- Resume upload and version management using Cloudinary + Multer
- Role-based routes for candidates and recruiters
- Toast-based feedback and reusable dashboard UI components

## Tech stack

- Frontend: React, Vite, React Router, Axios, react-hot-toast, Tailwind CSS
- Backend: Node.js, Express, Mongoose, JWT, Cloudinary, Multer
- Database: MongoDB Atlas

## Prerequisites

Before you run the app locally, make sure you have:

- Node.js 18+ and npm
- A MongoDB Atlas connection string
- A Cloudinary account for resume uploads

## Getting started

1. Clone the repository and enter the project folder:
   ```bash
   git clone https://github.com/Satyam-8226/quickhire.git
   cd quickhire-ai
   ```

2. Install dependencies in both apps:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Create a `.env` file in `server/` with the variables below:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

   The backend validates `MONGO_URI` and `JWT_SECRET` at startup. Cloudinary credentials are required for resume upload and resume viewing.

4. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

5. Start the frontend in another terminal:
   ```bash
   cd client
   npm run dev
   ```

6. Open the app at:
   ```text
   http://localhost:5173
   ```

## Main API routes

### Auth
- `POST /api/auth/register` — register a user
- `POST /api/auth/login` — sign in and receive a JWT
- `GET /api/auth/me` — fetch the current authenticated user

### Jobs
- `GET /api/jobs` — list all jobs
- `GET /api/jobs/:id` — get a job by ID
- `GET /api/jobs/my-jobs` — recruiter-owned jobs
- `GET /api/jobs/stats` — recruiter dashboard stats
- `POST /api/jobs` — create a job (recruiter only)
- `PUT /api/jobs/:id` — update a job (recruiter only)
- `DELETE /api/jobs/:id` — delete a job (recruiter only)

### Applications and resumes
- `GET /api/applications/me` — candidate applications
- `POST /api/applications/:jobId` — apply to a job
- `PUT /api/applications/upload-resume` — upload a resume
- `GET /api/applications/resumes` — list uploaded resume versions
- `PATCH /api/applications/resumes/:versionId/activate` — activate a resume version
- `GET /api/applications/job/:jobId` — recruiter view of applicants for a job
- `PUT /api/applications/:applicationId` — update application status

## Project structure

```text
quickhire-ai/
├── client/               # Vite + React frontend
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── routes/
└── server/               # Express + MongoDB backend
    └── src/
        ├── config/
        ├── controllers/
        ├── middlewares/
        ├── models/
        ├── routes/
        └── validators/
```

## Notes

- The backend uses JWTs stored in browser local storage and validates them on protected routes.
- Resume uploads are stored via Cloudinary, so the app needs valid Cloudinary credentials to work end to end.
- For frontend API calls, the client defaults to `http://localhost:5000/api` unless `VITE_API_URL` is set in `client/.env`.

## Author

Built by Satyam Pandey.
