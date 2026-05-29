import express from "express";

import {
  applyToJob,
  getApplicantsForJob,
  getMyApplications,
  updateApplicationStatus,
  uploadResume,
} from "../controllers/applicationController.js";

import {
  protect,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

const logApplicationRequests = (req, res, next) => {
  console.info('===== APPLICATION REQUEST =====');
  console.info('Method:', req.method);
  console.info('URL:', req.originalUrl);
  console.info('Params:', JSON.stringify(req.params));
  console.info('Body:', JSON.stringify(req.body));
  console.info('User:', req.user ? {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  } : null);
  console.info('===== END APPLICATION REQUEST =====');
  next();
};

router.use(logApplicationRequests);

/*
  Candidate Routes
*/

router.get(
  "/me",
  protect,
  authorizeRoles("candidate"),
  getMyApplications
);

router.put(
  "/upload-resume",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  uploadResume
);

router.post(
  "/:jobId",
  protect,
  authorizeRoles("candidate"),
  applyToJob
);

/*
  Recruiter Routes
*/

router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter", "admin"),
  getApplicantsForJob
);

router.put(
  "/:applicationId",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateApplicationStatus
);

export default router;