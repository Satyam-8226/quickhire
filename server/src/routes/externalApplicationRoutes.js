import express from 'express';

import {
  createExternalApplication,
  deleteExternalApplication,
  getExternalApplicationById,
  getMyExternalApplications,
  updateExternalApplication,
} from '../controllers/externalApplicationController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { validateExternalApplication } from '../validators/externalApplicationValidator.js';

const router = express.Router();

const logExternalApplicationRequests = (req, res, next) => {
  console.info('===== EXTERNAL APPLICATION REQUEST =====');
  console.info('Method:', req.method);
  console.info('URL:', req.originalUrl);
  console.info('Params:', JSON.stringify(req.params));
  console.info('Body:', JSON.stringify(req.body));
  console.info('User:', req.user ? {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  } : null);
  console.info('===== END EXTERNAL APPLICATION REQUEST =====');
  next();
};

router.use(logExternalApplicationRequests);

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

router.delete(
  '/:id',
  protect,
  authorizeRoles('candidate'),
  deleteExternalApplication
);

export default router;
