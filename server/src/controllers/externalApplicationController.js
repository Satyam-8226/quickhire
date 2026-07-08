import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import ExternalApplication from '../models/externalApplicationModel.js';

const getUserSummary = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
};

const normalizeAppliedDate = (value) => {
  if (!value) {
    throw new ErrorResponse('Applied date is required', 400);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ErrorResponse('Applied date is invalid', 400);
  }

  return date;
};

const normalizeOptionalDate = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ErrorResponse('Date is invalid', 400);
  }

  return date;
};

const normalizeOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ErrorResponse('Interview count must be a non-negative number', 400);
  }

  return parsed;
};

export const getMyExternalApplications = asyncHandler(async (req, res) => {
  console.info('getMyExternalApplications payload', {
    user: getUserSummary(req.user),
  });

  const externalApplications = await ExternalApplication.find({
    candidate: req.user._id,
  }).sort({ appliedDate: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: externalApplications.length,
    externalApplications,
  });
});

export const createExternalApplication = asyncHandler(async (req, res) => {
  console.info('createExternalApplication payload', {
    body: req.body,
    user: getUserSummary(req.user),
  });

  const payload = {
    candidate: req.user._id,
    companyName: req.body.companyName?.trim(),
    role: req.body.role?.trim(),
    platform: req.body.platform?.trim(),
    applicationUrl: req.body.applicationUrl?.trim() || '',
    appliedDate: normalizeAppliedDate(req.body.appliedDate),
    status: req.body.status || 'Applied',
    followUpDate: normalizeOptionalDate(req.body.followUpDate),
    interviewCount: normalizeOptionalNumber(req.body.interviewCount) ?? 0,
    priority: req.body.priority || 'Medium',
    expectedSalary: req.body.expectedSalary?.trim() || '',
    location: req.body.location?.trim() || '',
    sourceNotes: req.body.sourceNotes?.trim() || '',
    notes: req.body.notes?.trim() || '',
  };

  const externalApplication = await ExternalApplication.create(payload);

  res.status(201).json({
    success: true,
    message: 'External application created successfully',
    externalApplication,
  });
});

export const getExternalApplicationById = asyncHandler(async (req, res) => {
  const externalApplication = await ExternalApplication.findOne({
    _id: req.params.id,
    candidate: req.user._id,
  });

  if (!externalApplication) {
    throw new ErrorResponse('External application not found', 404);
  }

  res.status(200).json({
    success: true,
    externalApplication,
  });
});

export const updateExternalApplication = asyncHandler(async (req, res) => {
  const updateData = {};

  if (req.body.companyName !== undefined) {
    updateData.companyName = req.body.companyName?.trim();
  }

  if (req.body.role !== undefined) {
    updateData.role = req.body.role?.trim();
  }

  if (req.body.platform !== undefined) {
    updateData.platform = req.body.platform?.trim();
  }

  if (req.body.applicationUrl !== undefined) {
    updateData.applicationUrl = req.body.applicationUrl?.trim() || '';
  }

  if (req.body.appliedDate !== undefined) {
    updateData.appliedDate = normalizeAppliedDate(req.body.appliedDate);
  }

  if (req.body.status !== undefined) {
    updateData.status = req.body.status;
  }

  if (req.body.followUpDate !== undefined) {
    updateData.followUpDate = normalizeOptionalDate(req.body.followUpDate);
  }

  if (req.body.interviewCount !== undefined) {
    updateData.interviewCount = normalizeOptionalNumber(req.body.interviewCount) ?? 0;
  }

  if (req.body.priority !== undefined) {
    updateData.priority = req.body.priority;
  }

  if (req.body.expectedSalary !== undefined) {
    updateData.expectedSalary = req.body.expectedSalary?.trim() || '';
  }

  if (req.body.location !== undefined) {
    updateData.location = req.body.location?.trim() || '';
  }

  if (req.body.sourceNotes !== undefined) {
    updateData.sourceNotes = req.body.sourceNotes?.trim() || '';
  }

  if (req.body.notes !== undefined) {
    updateData.notes = req.body.notes?.trim() || '';
  }

  const externalApplication = await ExternalApplication.findOneAndUpdate(
    {
      _id: req.params.id,
      candidate: req.user._id,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!externalApplication) {
    throw new ErrorResponse('External application not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'External application updated successfully',
    externalApplication,
  });
});

export const deleteExternalApplication = asyncHandler(async (req, res) => {
  const externalApplication = await ExternalApplication.findOneAndDelete({
    _id: req.params.id,
    candidate: req.user._id,
  });

  if (!externalApplication) {
    throw new ErrorResponse('External application not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'External application deleted successfully',
  });
});
