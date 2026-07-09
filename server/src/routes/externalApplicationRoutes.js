import express from 'express';

import {
  createExternalApplication,
  deleteExternalApplication,
  getExternalApplicationById,
  getMyExternalApplications,
  updateExternalApplication,
  uploadExternalApplicationAttachment,
} from '../controllers/externalApplicationController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { validateExternalApplication } from '../validators/externalApplicationValidator.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get(
  '/',
  protect,
  authorizeRoles('candidate'),
  getMyExternalApplications
);

router.post(
  '/',
  protect,
  authorizeRoles('candidate'),
  validateExternalApplication,
  createExternalApplication
);

router.get(
  '/:id',
  protect,
  authorizeRoles('candidate'),
  getExternalApplicationById
);

router.put(
  '/:id',
  protect,
  authorizeRoles('candidate'),
  validateExternalApplication,
  updateExternalApplication
);

router.post(
  '/:id/attachments',
  protect,
  authorizeRoles('candidate'),
  upload.single('attachment'),
  uploadExternalApplicationAttachment
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('candidate'),
  deleteExternalApplication
);

export default router;
