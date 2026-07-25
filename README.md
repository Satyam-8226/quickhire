# QuickHire AI

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-Deployed-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

QuickHire AI is a full-stack Applicant Tracking System (ATS), job portal, and personal Career CRM built for modern hiring workflows. The project combines recruiter-facing applicant management with candidate-facing job discovery, resume versioning, and external application tracking so candidates can manage opportunities from QuickHire, LinkedIn, Internshala, Wellfound, Naukri, referrals, and company career pages in one place.

The goal is to make job search and hiring workflows more organized, transparent, and production-ready through a clean purple SaaS interface backed by React, Express, MongoDB Atlas, Cloudinary, AWS EC2, PM2, and Nginx.

## Table of Contents

- [Live Demo](#live-demo)
- [Highlights](#highlights)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Security](#security)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [Author](#author)

## Live Demo

**Live Application:** [http://16.171.232.137/](http://16.171.232.137/)

Hosted on **AWS EC2** with **Nginx** serving the frontend and reverse proxying API traffic to a **PM2-managed Node.js/Express backend**.

### Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| Candidate | `candidate1@quickhire.com` | `123456` |
| Recruiter | `recruiter1@quickhire.com` | `123456` |

## Highlights

- Full-stack ATS and job portal
- Personal Career CRM for external job tracking
- Candidate and recruiter role-based workflows
- Resume upload and resume versioning system
- Recruiter applicant review and status management
- External application timeline, interviews, notes, attachments, favorites, and archive/restore
- Cloudinary-backed resume and Career CRM attachment storage
- Responsive purple SaaS-style UI
- JWT authentication with protected routes
- AWS EC2 deployment with PM2 and Nginx

## Features

### Candidate Features

- Secure authentication and role-based dashboard
- Browse and search jobs with filters for keyword, location, and job type
- View job details and apply with one click
- Track QuickHire applications with status badges
- Upload, view, download, and activate PDF resume versions
- Manage external applications from multiple platforms
- View dashboard cards for applications, active opportunities, interviews, offers, and rejections
- Review upcoming interviews, follow-ups, assessments, and offer reminders

### Recruiter Features

- Recruiter dashboard with hiring pipeline statistics
- Create, edit, and delete job postings
- View applicants per job with detailed candidate profiles
- View and download candidate resumes
- Update application status as pending, reviewed, accepted, or rejected
- Review applicant pipeline breakdown and latest job postings

### Career CRM

- Track external applications from LinkedIn, Internshala, Wellfound, Naukri, Indeed, referrals, company career pages, and other sources
- Store company name, role, platform, application URL, applied date, status, follow-up date, interview count, priority, salary expectation, and location
- Maintain notes, source notes, company notes, preparation notes, recruiter information, interview experience, questions asked, salary discussion, culture notes, and future tips
- View CRM-style application details with overview cards, status display, timeline, activity feed, interview history, notes, company information, and attachments
- Manage interview rounds with round name, round type, schedule, mode, meeting link, interviewer, notes, feedback, and status
- Upload application attachments such as offer letters, assignment PDFs, and interview notes through Cloudinary
- Favorite important applications and archive or restore completed opportunities
- Use smart search and advanced filters by status, platform, priority, favorite, archive state, applied date, and follow-up date
- Display loading skeletons, empty states, error states, hover states, and confirmation dialogs across CRM flows

### Resume Versioning

- Upload multiple PDF resume versions via Cloudinary
- Store resume history on the candidate profile
- Activate any previous version as the current resume
- Use the active resume automatically for new job applications and recruiter visibility

### ATS Workflow

1. Recruiter posts a job and it appears in the public browse list.
2. Candidate uploads a resume and applies to the job.
3. The application is created and visible to both candidate and recruiter workflows.
4. Recruiter reviews applicant details, opens the resume, and updates hiring status.
5. Candidate tracks QuickHire applications and external opportunities from the dashboard and Career CRM.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router, Axios, react-hot-toast, Lucide icons |
| **Backend** | Node.js, Express, Mongoose, JWT, Helmet, Express Rate Limit |
| **Database** | MongoDB Atlas |
| **Cloud Storage** | Cloudinary with Multer uploads |
| **Authentication** | JWT bearer token stored in `localStorage` |
| **Deployment** | AWS EC2, Nginx, PM2 |

## Architecture

QuickHire AI follows a classic **SPA + REST API** architecture:

- The **React client** handles routing, UI state, protected screens, and calls the API through a shared Axios instance configured with `VITE_API_URL`.
- The **Express server** exposes `/api/auth`, `/api/jobs`, `/api/applications`, `/api/external-applications`, and interview-related routes with JWT middleware and role checks.
- **MongoDB Atlas** stores users, jobs, applications, external applications, interviews, timeline entries, company notes, resume metadata, and attachment metadata.
- **Cloudinary** stores resume files and Career CRM attachments, while MongoDB stores the resulting file URLs and metadata.

Application flow:

```text
React UI -> Axios -> Express API -> MongoDB Atlas
                              |
                              -> Cloudinary
```

![ARCHITECTURE DIAGRAM](./screenshots/architecture.png)

## Security

- JWT authentication for protected API access
- Role-based authorization for candidate, recruiter, and admin routes
- Protected frontend routes for candidate and recruiter dashboards
- Password hashing with bcryptjs
- Helmet middleware for secure HTTP headers
- Express rate limiting for API abuse protection
- CORS allowlist support through `CLIENT_URL`
- PDF-only file upload validation with Multer
- File size limits for uploads

## Project Structure

```text
quickhire-ai/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── dashboard/
│       │   ├── jobs/
│       │   ├── layout/
│       │   ├── skeletons/
│       │   └── ui/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       │   ├── auth/
│       │   ├── candidate/
│       │   ├── public/
│       │   └── recruiter/
│       ├── routes/
│       └── utils/
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── validators/
└── screenshots/
```

## API Overview

| Route Group | Purpose |
| --- | --- |
| `/api/auth` | Register, login, and authenticated user access |
| `/api/jobs` | Public job browsing and recruiter job management |
| `/api/applications` | QuickHire job applications, applicant review, resume upload, resume history, and resume activation |
| `/api/external-applications` | Candidate Career CRM records, smart search, advanced filters, archive/restore, favorites, and attachment upload |
| Interview APIs | External application interview round creation, listing, updates, and deletion |

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

### Career CRM

TODO: Add screenshots for External Applications, Application Details, Timeline, Interview Tracker, Notes, and Attachments.

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
# Set VITE_API_URL=http://localhost:5000/api for local development
npm run dev
```

Open `http://localhost:5173` after both servers are running.

### Environment variables

**Server (`server/.env`)**

| Variable | Description |
| --- | --- |
| `PORT` | API port, default `5000` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `CLOUDINARY_*` | Cloudinary cloud name, API key, and API secret |
| `CLIENT_URL` | Comma-separated allowed CORS origins |
| `NODE_ENV` | `development` or `production` |

**Client (`client/.env`)**

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend API base URL, for example `https://api.example.com/api` |

## Deployment

| Component | Deployment Detail |
| --- | --- |
| Hosting | AWS EC2 |
| Frontend | Vite production build served by Nginx |
| Backend | Node.js / Express API managed by PM2 |
| Reverse Proxy | Nginx routes API traffic to the PM2 backend process |
| Process Manager | PM2 keeps the API running across restarts |
| Database | MongoDB Atlas |
| File Storage | Cloudinary for resumes and Career CRM attachments |
| Environment | Production `.env` values for MongoDB, JWT, Cloudinary, CORS, and API URLs |

## Future Roadmap

The following items are planned as future Phase 3+ work:

- AI resume matching
- Resume parsing and profile enrichment
- Calendar integration for interviews and follow-ups
- Email notifications and reminder workflows
- Recruiter analytics and funnel reporting
- AI interview preparation
- Assignment-specific workflow improvements
- Deeper job search insights dashboard

## Author

**Satyam Pandey**

- GitHub: [Satyam-8226](https://github.com/Satyam-8226)
- Project Repository: [quickhire-ai](https://github.com/Satyam-8226/quickhire)
