import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";

import CandidateLayout from "../layouts/CandidateLayout";
import Applications from "../pages/candidate/Applications";
import Resume from "../pages/candidate/Resume";

import RecruiterLayout from "../layouts/RecruiterLayout";
import RecruiterJobs from "../pages/recruiter/RecruiterJobs";
import CreateJob from "../pages/recruiter/CreateJob";

function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/candidate"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
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
              path="resume"
              element={<Resume />}
            />

          </Route>

          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
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
              path="create-job"
              element={<CreateJob />}
            />

          </Route>

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default AppRoutes;