import express from 'express';

import { applyToJob } from '../controllers/applicationController.js';

import {
  protect,
  authorizeRoles,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/:jobId',
  protect,
  authorizeRoles('student', 'user'),
  applyToJob
);

export default router;