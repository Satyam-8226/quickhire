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

const buildExternalApplicationQuery = (query) => {
  const filters = { candidate: query.userId };

  if (query.favorite === 'true') filters.favorite = true;
  if (query.favorite === 'false') filters.favorite = false;
  if (query.archived === 'true') {
    filters.archived = true;
  } else if (query.archived === 'false') {
    filters.archived = false;
  } else {
    filters.archived = false;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.platform) {
    filters.platform = query.platform;
  }

  if (query.priority === 'High') {
    filters.priority = 'High';
  }

  if (query.today === 'true') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filters.appliedDate = { $gte: start, $lt: end };
  }

  if (query.tomorrow === 'true') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filters.appliedDate = { $gte: start, $lt: end };
  }

  if (query.thisWeek === 'true') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    filters.appliedDate = { $gte: start, $lt: end };
  }

  if (query.overdue === 'true') {
    const now = new Date();
    filters.followUpDate = { $lt: now };
  }

  return filters;
};

const buildExternalApplicationSearch = (search) => {
  if (!search) return null;

  const regex = new RegExp(search.trim(), 'i');

  return {
    $or: [
      { companyName: regex },
      { role: regex },
      { platform: regex },
      { location: regex },
      { notes: regex },
      { sourceNotes: regex },
    ],
  };
};

export const getMyExternalApplications = asyncHandler(async (req, res) => {
  console.info('getMyExternalApplications payload', {
    params: req.query,
    user: getUserSummary(req.user),
  });

  const baseQuery = buildExternalApplicationQuery({
    ...req.query,
    userId: req.user._id,
  });

  const searchQuery = buildExternalApplicationSearch(req.query.search);

  const query = searchQuery ? { $and: [baseQuery, searchQuery] } : baseQuery;

  const externalApplications = await ExternalApplication.find(query).sort({
    favorite: -1,
    archived: 1,
    appliedDate: -1,
    createdAt: -1,
  });

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
    archived: req.body.archived === true,
    favorite: req.body.favorite === true,
    attachments: Array.isArray(req.body.attachments) ? req.body.attachments.map((attachment) => ({
      type: attachment.type || 'Other',
      label: attachment.label?.trim() || '',
      url: attachment.url?.trim() || '',
      notes: attachment.notes?.trim() || '',
      uploadedAt: attachment.uploadedAt ? new Date(attachment.uploadedAt) : new Date(),
    })) : [],
    companyNotes: {
      interviewExperience: req.body.companyNotes?.interviewExperience?.trim() || '',
      questionsAsked: req.body.companyNotes?.questionsAsked?.trim() || '',
      recruiterInformation: req.body.companyNotes?.recruiterInformation?.trim() || '',
      preparationNotes: req.body.companyNotes?.preparationNotes?.trim() || '',
      salaryDiscussion: req.body.companyNotes?.salaryDiscussion?.trim() || '',
      cultureNotes: req.body.companyNotes?.cultureNotes?.trim() || '',
      futureTips: req.body.companyNotes?.futureTips?.trim() || '',
    },
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
