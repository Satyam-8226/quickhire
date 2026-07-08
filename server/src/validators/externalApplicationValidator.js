import { isEmpty } from './commonValidators.js';

const isValidUrl = (value) => {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const validPlatforms = [
  'LinkedIn',
  'Internshala',
  'Wellfound',
  'Naukri',
  'Indeed',
  'Company Careers',
  'Referral',
  'Other',
];

const validStatuses = [
  'Applied',
  'OA Scheduled',
  'OA Completed',
  'Interview Scheduled',
  'Interviewing',
  'HR Round',
  'Offer',
  'Rejected',
  'Withdrawn',
  'Ghosted',
];

export const validateExternalApplication = (req, res, next) => {
  const {
    companyName,
    role,
    platform,
    applicationUrl,
    appliedDate,
    status,
    notes,
    sourceNotes,
    priority,
    interviewCount,
  } = req.body;

  const errors = [];

  if (req.method === 'POST') {
    if (isEmpty(companyName)) errors.push('Company name is required');
    if (isEmpty(role)) errors.push('Role is required');
    if (isEmpty(platform)) errors.push('Platform is required');
    if (isEmpty(appliedDate)) errors.push('Applied date is required');
    if (isEmpty(status)) errors.push('Status is required');
  } else {
    if (companyName !== undefined && isEmpty(companyName)) {
      errors.push('Company name is required');
    }

    if (role !== undefined && isEmpty(role)) {
      errors.push('Role is required');
    }

    if (platform !== undefined && isEmpty(platform)) {
      errors.push('Platform is required');
    }

    if (appliedDate !== undefined && isEmpty(appliedDate)) {
      errors.push('Applied date is required');
    }

    if (status !== undefined && isEmpty(status)) {
      errors.push('Status is required');
    }
  }

  if (platform !== undefined && platform !== '' && !validPlatforms.includes(platform)) {
    errors.push('Platform is invalid');
  }

  if (status !== undefined && status !== '' && !validStatuses.includes(status)) {
    errors.push('Status is invalid');
  }

  if (priority !== undefined && priority !== '' && !['Low', 'Medium', 'High'].includes(priority)) {
    errors.push('Priority must be Low, Medium, or High');
  }

  if (interviewCount !== undefined && interviewCount !== '' && Number.isNaN(Number(interviewCount))) {
    errors.push('Interview count must be a number');
  }

  if (applicationUrl !== undefined && applicationUrl !== '' && !isValidUrl(applicationUrl)) {
    errors.push('Application URL must be a valid URL');
  }

  if (notes !== undefined && typeof notes !== 'string') {
    errors.push('Notes must be a string');
  }

  if (sourceNotes !== undefined && typeof sourceNotes !== 'string') {
    errors.push('Source notes must be a string');
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
