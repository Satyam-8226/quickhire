import express from 'express';

import {
  createJob,
  getMyJobs,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterStats
} from '../controllers/jobController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes - general list
router.get('/', getAllJobs);

// Protected Routes with specific paths (MUST come before /:id)
router.get(
  '/my-jobs',
  protect,
  authorizeRoles('recruiter', 'admin'),
  getMyJobs
);

router.get(
  '/stats',
  protect,
  authorizeRoles('recruiter', 'admin'),
  getRecruiterStats
);

// Public Route - single job (MUST come after specific paths)
router.get('/:id', getJobById);

// Protected Routes - create, update, delete
router.post(
  '/',
  protect,
  authorizeRoles('recruiter', 'admin'),
  createJob
);

router.put(
  '/:id',
  protect,
  authorizeRoles('recruiter', 'admin'),
  updateJob
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('recruiter', 'admin'),
  deleteJob
);

export default router;