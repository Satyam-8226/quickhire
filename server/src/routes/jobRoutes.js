import express from 'express';

import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();


// Public Routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);


// Protected Route
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