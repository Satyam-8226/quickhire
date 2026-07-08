import express from 'express';

import {
  createInterviewRound,
  deleteInterviewRound,
  getInterviewRoundsForApplication,
  updateInterviewRound,
} from '../controllers/interviewRoundController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { validateInterviewRound } from '../validators/interviewRoundValidator.js';

const router = express.Router();

router.get(
  '/external-applications/:externalApplicationId/interviews',
  protect,
  authorizeRoles('candidate'),
  getInterviewRoundsForApplication
);

router.post(
  '/external-applications/:externalApplicationId/interviews',
  protect,
  authorizeRoles('candidate'),
  validateInterviewRound,
  createInterviewRound
);

router.put(
  '/interviews/:id',
  protect,
  authorizeRoles('candidate'),
  validateInterviewRound,
  updateInterviewRound
);

router.delete(
  '/interviews/:id',
  protect,
  authorizeRoles('candidate'),
  deleteInterviewRound
);

export default router;
