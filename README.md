# QuickHire AI

An AI-powered recruitment platform connecting recruiters and candidates through a modern MERN stack application.

## Project Overview

QuickHire AI is a modern hiring platform built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, and JWT authentication. The application enables candidates to discover jobs, apply with resume support, and track applications while recruiters post jobs, review applicants, and manage application statuses.

## Features

- Candidate registration, login, and dashboard
- Recruiter registration, login, and job management
- Job search, detail view, and application submission
- Resume upload and profile-backed application creation
- Duplicate application prevention
- Recruiter applicant listing and status updates
- JWT-based authentication with role authorization
- Centralized error handling and enhanced request logging

## Architecture

The project follows a client-server architecture:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Authentication: JWT stored in browser local storage
- API client: Axios with automatic token injection

## Folder Structure

```
quickhire-ai/
├── client/                    # Frontend application
│   ├── public/
│   └── src/
│       ├── api/               # Axios clients and API helpers
│       ├── components/        # Reusable UI components
│       ├── context/           # Auth and app state context
│       ├── layouts/           # Route layout wrappers
│       ├── pages/             # Page-level views
│       ├── routes/            # Route configuration and protections
│       └── utils/             # Utility functions
├── server/                    # Backend API server
│   ├── src/
│       ├── config/            # Database and Cloudinary config
│       ├── controllers/       # Route handlers
│       ├── middlewares/       # Auth, error handling, logging
 │     ├── models/             # Mongoose schemas
 │     ├── routes/             # API route definitions
 │     ├── utils/              # Helpers and token generation
 │     └── app.js              # Express app setup
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quickhire-ai
   ```
2. Install dependencies for both backend and frontend.

## Environment Variables

Create `.env` files in the `server` folder with the following variables:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

## Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```

## Running Locally

1. Start the backend server in `server/`.
2. Start the frontend app in `client/`.
3. Open the browser at the URL provided by Vite (typically `http://localhost:5173`).

## API Overview

### Auth
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive JWT
- `GET /api/auth/me` — retrieve authenticated user profile

### Jobs
- `GET /api/jobs` — list jobs
- `GET /api/jobs/:id` — get job details
- `POST /api/jobs` — create a new job (recruiter only)
- `PUT /api/jobs/:id` — edit a job (recruiter only)

### Applications
- `POST /api/applications/:jobId` — apply to a job (candidate only)
- `GET /api/applications/me` — candidate application history
- `PUT /api/applications/upload-resume` — upload candidate resume
- `GET /api/applications/job/:jobId` — recruiter view applicants for a job
- `PUT /api/applications/:applicationId` — recruiter update application status

## Authentication Flow

- Candidates and recruiters sign up with email and password.
- The backend returns a JWT token after login/register.
- The frontend stores the token in local storage and attaches it to API requests.
- Protected API routes validate the JWT and authorize the user role.

## Candidate Workflow

1. Register as a candidate.
2. Login and view jobs.
3. Visit job details and click `Apply Now`.
4. Upload resume on the candidate resume page.
5. Track submitted applications via the candidate dashboard.

## Recruiter Workflow

1. Register or login as a recruiter.
2. Create and manage jobs.
3. View applicants for a job.
4. Update candidate application statuses.

## Future Enhancements

- Add AI-powered resume matching and candidate recommendations.
- Support candidate profiles with multiple resumes, portfolios, and skills.
- Add notifications, email alerts, and chat.
- Improve reporting and analytics for recruiter dashboards.
- Add Socket.IO real-time updates for applications and chat.


## Author Information

Built by Satyam Pandey.

For questions or contributions, please open an issue or submit a pull request.
