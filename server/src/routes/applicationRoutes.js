import express from 'express';
import {
    applyToJob,
    getApplicantsForJob,
    updateApplicationStatus,
    uploadResume
} from '../controllers/applicationController.js';
import {
  protect,
  authorizeRoles,
} from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post(
  '/:jobId',
  protect,
  authorizeRoles('student', 'user'),
  applyToJob
);

router.get(
  '/job/:jobId',
  protect,
  authorizeRoles('recruiter', 'admin'),
  getApplicantsForJob
);

router.put(
  '/:applicationId',
  protect,
  authorizeRoles('recruiter', 'admin'),
  updateApplicationStatus
);

router.put(
  '/upload-resume',
  protect,
  upload.single('resume'),
  uploadResume
);

export default router;