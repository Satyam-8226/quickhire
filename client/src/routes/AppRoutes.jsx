import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


// ===============================
// LAYOUTS
// ===============================

import MainLayout from "../layouts/MainLayout";
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";


// ===============================
// PUBLIC PAGES
// ===============================

import Home from "../pages/public/Home";
import JobsPage from "../pages/public/JobsPage";
import JobDetailsPage from "../pages/public/JobDetailsPage";


// ===============================
// AUTH PAGES
// ===============================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


// ===============================
// CANDIDATE PAGES
// ===============================

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import Applications from "../pages/candidate/Applications";
import ExternalApplications from "../pages/candidate/ExternalApplications";
import Resume from "../pages/candidate/Resume";


// ===============================
// RECRUITER PAGES
// ===============================

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "../pages/recruiter/RecruiterJobs";
import CreateJob from "../pages/recruiter/CreateJob";
import EditJob from "../pages/recruiter/EditJob";
import ApplicantsPage from "../pages/recruiter/ApplicantsPage";


// ===============================
// PROTECTED ROUTES
// ===============================

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>

          {/* ===================== */}
          {/* PUBLIC ROUTES */}
          {/* ===================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/jobs"
            element={<JobsPage />}
          />

          <Route
            path="/jobs/:id"
            element={<JobDetailsPage />}
          />

          {/* ===================== */}
          {/* AUTH ROUTES */}
          {/* ===================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ===================== */}
          {/* CANDIDATE ROUTES */}
          {/* ===================== */}

          <Route
            path="/candidate"
            element={
              <ProtectedRoute
                allowedRoles={["candidate"]}
              >
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={<CandidateDashboard />}
            />

            <Route
              path="applications"
              element={<Applications />}
            />

            <Route
              path="external-applications"
              element={<ExternalApplications />}
            />

            <Route
              path="resume"
              element={<Resume />}
            />
          </Route>

          {/* ===================== */}
          {/* RECRUITER ROUTES */}
          {/* ===================== */}

          <Route
            path="/recruiter"
            element={
              <ProtectedRoute
                allowedRoles={["recruiter"]}
              >
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={<RecruiterDashboard />}
            />

            <Route
              path="jobs"
              element={<RecruiterJobs />}
            />

            <Route
              path="jobs/:id/applicants"
              element={<ApplicantsPage />}
            />

            <Route
              path="create-job"
              element={<CreateJob />}
            />

            <Route
              path="edit-job/:id"
              element={<EditJob />}
            />
          </Route>

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default AppRoutes;