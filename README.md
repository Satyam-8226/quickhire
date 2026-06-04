# QuickHire AI

QuickHire AI is a full-stack Applicant Tracking System (ATS) and job portal built for candidates and recruiters. Candidates can discover roles, manage resume versions, apply to jobs, and track applications. Recruiters can publish openings, review applicants, access resumes, and update hiring status — all in a modern purple SaaS interface.

## Features

### Candidate Features

- Secure authentication and role-based dashboard
- Browse and search jobs with filters (keyword, location, job type)
- Job details and one-click apply workflow
- Application tracking with status badges
- Resume upload (PDF), view, and download
- Resume versioning with active version selection

### Recruiter Features

- Recruiter dashboard with hiring pipeline stats
- Create, edit, and delete job postings
- View applicants per job with detailed profiles
- Resume view and download for each applicant
- Application status updates (pending, reviewed, accepted, rejected)

### Resume Versioning

- Upload multiple PDF resume versions via Cloudinary
- Activate any previous version as the current resume
- Active resume is used for new applications and recruiter visibility

### ATS Workflow

1. Recruiter posts a job → job appears in the public browse list
2. Candidate uploads resume and applies → application is created
3. Recruiter reviews applicants, opens resume, updates status
4. Candidate tracks progress from the applications dashboard

## Tech Stack


| Layer              | Technologies                                                                     |
| ------------------ | -------------------------------------------------------------------------------- |
| **Frontend**       | React 19, Vite, Tailwind CSS, React Router, Axios, react-hot-toast, Lucide icons |
| **Backend**        | Node.js, Express, Mongoose, JWT, Helmet, rate limiting                           |
| **Database**       | MongoDB Atlas                                                                    |
| **Cloud Storage**  | Cloudinary (resume files via Multer)                                             |
| **Authentication** | JWT (Bearer token in `localStorage`)                                             |


## Architecture

QuickHire AI follows a classic **SPA + REST API** architecture:

- The **React client** handles routing, UI state, and calls the API through a shared Axios instance (`VITE_API_URL`).
- The **Express server** exposes `/api/auth`, `/api/jobs`, and `/api/applications` routes with JWT middleware and role checks.
- **MongoDB** stores users, jobs, and applications; resumes are stored in **Cloudinary** with URLs persisted on the user record.

```
[Browser] → [Vite React App] → [Express API] → [MongoDB Atlas]
                                    ↓
                              [Cloudinary]
```

[ARCHITECTURE DIAGRAM HERE]

## Screenshots

### Candidate Dashboard

Candidate Dashboard

### Browse Jobs

[ADD SCREENSHOT]

### Applications

[ADD SCREENSHOT]

### Resume Management

[ADD SCREENSHOT]

### Recruiter Dashboard

[ADD SCREENSHOT]

### Applicant Management

[ADD SCREENSHOT]

### Create Job

[ADD SCREENSHOT]

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Cloudinary account

### Backend setup

```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, Cloudinary keys, CLIENT_URL
npm run dev
```

### Frontend setup

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api for local dev
npm run dev
```

Open `http://localhost:5173` after both servers are running.

### Environment variables

**Server (`server/.env`)**


| Variable       | Description                          |
| -------------- | ------------------------------------ |
| `PORT`         | API port (default `5000`)            |
| `MONGO_URI`    | MongoDB Atlas connection string      |
| `JWT_SECRET`   | Secret for signing tokens            |
| `CLOUDINARY_`* | Cloud name, API key, API secret      |
| `CLIENT_URL`   | Comma-separated allowed CORS origins |
| `NODE_ENV`     | `development` or `production`        |


**Client (`client/.env`)**


| Variable       | Description                                               |
| -------------- | --------------------------------------------------------- |
| `VITE_API_URL` | Backend API base URL (e.g. `https://api.example.com/api`) |


## Deployment

### Vercel (frontend)

1. Import the `client` folder as a Vite project.
2. Set `VITE_API_URL` to your production API URL.
3. Deploy; note the production URL for `CLIENT_URL` on the server.

### Render (backend)

1. Create a Web Service from the `server` folder.
2. Add all environment variables from `server/.env.example`.
3. Set `CLIENT_URL` to your Vercel URL(s).
4. Use `npm start` (or `node src/server.js`) as the start command.

### MongoDB Atlas

1. Create a free cluster and database user.
2. Whitelist `0.0.0.0/0` (or Render’s IP) for cloud hosting.
3. Copy the connection string into `MONGO_URI`.

## Future Roadmap

**Phase 2: Personal Career CRM** — extended candidate profiles, interview notes, offer tracking, and networking tools beyond core ATS workflows.

## Author

Built by **Satyam Pandey**.

- GitHub: [Satyam-8226](https://github.com/Satyam-8226)
- Project: [quickhire-ai](https://github.com/Satyam-8226/quickhire)