# QuickHire AI

QuickHire AI is a full-stack Applicant Tracking System (ATS) and job portal built for candidates and recruiters. Candidates can discover roles, manage resume versions, apply to jobs, and track applications. Recruiters can publish openings, review applicants, access resumes, and update hiring status — all in a modern purple SaaS interface.


## Live Demo

🌐 Live Application: http://16.171.232.137/

> Hosted on AWS EC2 using Nginx and PM2.

## Highlights

- Full-Stack ATS & Job Portal
- Resume Versioning System
- Personal Career CRM for external job tracking
- Role-Based Authentication (Candidate & Recruiter)
- Applicant Tracking Workflow
- Cloudinary Resume and Attachment Storage
- Responsive SaaS-Style UI
- JWT Secure Authentication

## Features

### Candidate Features

- Secure authentication and role-based dashboard
- Browse and search jobs with filters (keyword, location, job type)
- Job details and one-click apply workflow
- Application tracking with status badges
- Resume upload (PDF), view, and download
- Resume versioning with active version selection
- External application tracker for roles applied outside QuickHire
- CRM-style application details with timeline, activity feed, interviews, notes, attachments, favorites, and archive/restore
- Smart search and advanced filters for external applications

### Recruiter Features

- Recruiter dashboard with hiring pipeline stats
- Create, edit, and delete job postings
- View applicants per job with detailed profiles
- Resume view and download for each applicant
- Application status updates (pending, reviewed, accepted, rejected)

### Career CRM Capabilities

- Track external applications from LinkedIn, Internshala, Wellfound, Naukri, Indeed, referrals, company career pages, and other sources
- Maintain company notes, preparation notes, recruiter information, interview experience, questions asked, salary discussion, culture notes, and future tips
- Manage interview rounds with schedule, mode, interviewer, meeting link, notes, feedback, and status
- View chronological timeline events for application creation, status changes, interviews, follow-ups, offers, rejections, notes, favorites, archive/restore, and attachments
- Upload application attachments such as offer letters, assignment PDFs, and interview notes through the existing Cloudinary storage flow
- Favorite important opportunities and archive or restore completed applications
- Use smart search and filters by status, platform, priority, favorite, archive state, applied date, and follow-up date

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
| **Deployment**     | AWS EC2, Nginx, PM2                                                              |


## Architecture

QuickHire AI follows a classic **SPA + REST API** architecture:

- The **React client** handles routing, UI state, and calls the API through a shared Axios instance (`VITE_API_URL`).
- The **Express server** exposes `/api/auth`, `/api/jobs`, `/api/applications`, `/api/external-applications`, and interview routes with JWT middleware and role checks.
- **MongoDB** stores users, jobs, applications, external applications, interviews, timeline entries, company notes, and attachment metadata.
- **Cloudinary** stores resume files and Career CRM attachments with URLs persisted in MongoDB.


![ARCHITECTURE DIAGRAM](./screenshots/architecture.png)

## Screenshots

### Candidate Dashboard

![Candidate Dashboard](./screenshots/candidate-dashboard.png)

### Browse Jobs

![Browse Jobs](./screenshots/browse-jobs.png)

### Applications

![Applications](./screenshots/applications.png)

### Resume Management

![Resume Section](./screenshots/resume-management.png)

### Recruiter Dashboard

![Recruiter Dashboard](./screenshots/recruiter-dashboard.png)

### Applicant Management

![Applicant Management](./screenshots/applicant-management.png)

### Create Job

![Create Job](./screenshots/create-job.png)

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

- Hosting         :     AWS EC2
- Frontend        :     Vite production build served by Nginx
- Backend         :     Node.js / Express API managed by PM2
- Reverse Proxy   :     Nginx routes API traffic to the PM2 backend process
- Process Manager :     PM2 keeps the API running across restarts
- Database        :     MongoDB Atlas
- File Storage    :     Cloudinary for resumes and Career CRM attachments
- Environment     :     Production `.env` values for MongoDB, JWT, Cloudinary, CORS, and API URLs

## Future Roadmap

### Phase 2: Personal Career CRM

- Completed: external application tracking, CRM-style details, timeline, activity feed, interview history, notes, company notes, attachments, favorites, archive/restore, smart search, advanced filters, improved dashboard cards, loading states, empty states, error states, confirmation dialogs, and responsive UI polish
- Planned: assignment-specific workflow, reminder notifications, resume-to-application mapping, resume performance analytics, and deeper job search insights dashboard

## Author

Built by **Satyam Pandey**.

- GitHub: [Satyam-8226](https://github.com/Satyam-8226)
- Project: [quickhire-ai](https://github.com/Satyam-8226/quickhire)
