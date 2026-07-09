import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import ExternalApplication from '../models/externalApplicationModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

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
  } else if (query.archived === 'all' || query.archived === '') {
    // allow explicit all archive filter
  } else {
    filters.archived = false;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.platform) {
    filters.platform = query.platform;
  }

  if (query.priority && ['Low', 'Medium', 'High'].includes(query.priority)) {
    filters.priority = query.priority;
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

  if (query.appliedFrom || query.appliedTo) {
    filters.appliedDate = {
      ...(filters.appliedDate || {}),
    };

    if (query.appliedFrom) {
      const from = new Date(query.appliedFrom);
      if (!Number.isNaN(from.getTime())) {
        from.setHours(0, 0, 0, 0);
        filters.appliedDate.$gte = from;
      }
    }

    if (query.appliedTo) {
      const to = new Date(query.appliedTo);
      if (!Number.isNaN(to.getTime())) {
        to.setHours(23, 59, 59, 999);
        filters.appliedDate.$lte = to;
      }
    }
  }

  if (query.followUpFrom || query.followUpTo) {
    filters.followUpDate = {
      ...(filters.followUpDate || {}),
    };

    if (query.followUpFrom) {
      const from = new Date(query.followUpFrom);
      if (!Number.isNaN(from.getTime())) {
        from.setHours(0, 0, 0, 0);
        filters.followUpDate.$gte = from;
      }
    }

    if (query.followUpTo) {
      const to = new Date(query.followUpTo);
      if (!Number.isNaN(to.getTime())) {
        to.setHours(23, 59, 59, 999);
        filters.followUpDate.$lte = to;
      }
    }
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
      { expectedSalary: regex },
      { 'companyNotes.interviewExperience': regex },
      { 'companyNotes.questionsAsked': regex },
      { 'companyNotes.recruiterInformation': regex },
      { 'companyNotes.preparationNotes': regex },
      { 'companyNotes.salaryDiscussion': regex },
      { 'companyNotes.cultureNotes': regex },
      { 'companyNotes.futureTips': regex },
      { 'attachments.label': regex },
      { 'attachments.notes': regex },
    ],
  };
};

const normalizeAttachments = (attachments) =>
  Array.isArray(attachments)
    ? attachments.map((attachment) => ({
        type: attachment.type || 'Other',
        label: attachment.label?.trim() || '',
        url: attachment.url?.trim() || '',
        notes: attachment.notes?.trim() || '',
        uploadedAt: attachment.uploadedAt ? new Date(attachment.uploadedAt) : new Date(),
      }))
    : [];

const buildCompanyNotesPayload = (companyNotes = {}) => ({
  interviewExperience: companyNotes.interviewExperience?.trim() || '',
  questionsAsked: companyNotes.questionsAsked?.trim() || '',
  recruiterInformation: companyNotes.recruiterInformation?.trim() || '',
  preparationNotes: companyNotes.preparationNotes?.trim() || '',
  salaryDiscussion: companyNotes.salaryDiscussion?.trim() || '',
  cultureNotes: companyNotes.cultureNotes?.trim() || '',
  futureTips: companyNotes.futureTips?.trim() || '',
});

const buildTimelineEvent = ({ type, title, description, occurredAt = new Date() }) => ({
  type,
  title,
  description,
  occurredAt,
});

export const getMyExternalApplications = asyncHandler(async (req, res) => {
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
    attachments: normalizeAttachments(req.body.attachments),
    companyNotes: buildCompanyNotesPayload(req.body.companyNotes),
    timeline: [
      buildTimelineEvent({
        type: 'Application',
        title: 'Application created',
        description: `Applied to ${req.body.companyName?.trim()} for ${req.body.role?.trim()}`,
      }),
    ],
  };

  const externalApplication = await ExternalApplication.create(payload);

  res.status(201).json({
    success: true,
    message: 'External application created successfully',
    externalApplication,
  });
});

export const uploadExternalApplicationAttachment = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ErrorResponse('No attachment uploaded', 400);
  }

  const externalApplication = await ExternalApplication.findOne({
    _id: req.params.id,
    candidate: req.user._id,
  });

  if (!externalApplication) {
    throw new ErrorResponse('External application not found', 404);
  }

  let result;

  try {
    result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      type: 'upload',
      access_mode: 'public',
      folder: 'quickhire/application-attachments',
      use_filename: true,
      unique_filename: true,
    });
  } finally {
    if (req.file.path) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
  }

  const attachment = {
    type: req.body.type || 'Other',
    label: req.body.label?.trim() || req.file.originalname || 'Attachment',
    url: result.secure_url || result.url || '',
    notes: req.body.notes?.trim() || '',
    uploadedAt: new Date(),
  };

  externalApplication.attachments.push(attachment);
  externalApplication.timeline.push(
    buildTimelineEvent({
      type: 'Attachment',
      title: 'Attachment uploaded',
      description: attachment.label || attachment.type,
    })
  );
  await externalApplication.save();

  res.status(201).json({
    success: true,
    message: 'Attachment uploaded successfully',
    attachment: externalApplication.attachments[externalApplication.attachments.length - 1],
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

  if (req.body.archived !== undefined) {
    updateData.archived = req.body.archived === true;
  }

  if (req.body.favorite !== undefined) {
    updateData.favorite = req.body.favorite === true;
  }

  if (req.body.companyNotes !== undefined) {
    updateData.companyNotes = buildCompanyNotesPayload(req.body.companyNotes);
  }

  if (req.body.attachments !== undefined) {
    updateData.attachments = normalizeAttachments(req.body.attachments);
  }

  const currentApplication = await ExternalApplication.findOne({
    _id: req.params.id,
    candidate: req.user._id,
  });

  if (!currentApplication) {
    throw new ErrorResponse('External application not found', 404);
  }

  const timelineEvents = [];

  if (updateData.status && updateData.status !== currentApplication.status) {
    timelineEvents.push(
      buildTimelineEvent({
        type: updateData.status === 'Offer'
          ? 'Offer'
          : updateData.status === 'Rejected'
            ? 'Rejection'
            : 'Status Change',
        title: `Status changed to ${updateData.status}`,
        description: `Previous status was ${currentApplication.status}`,
      })
    );
  }

  if (
    updateData.followUpDate !== undefined &&
    String(updateData.followUpDate || '') !== String(currentApplication.followUpDate || '')
  ) {
    timelineEvents.push(
      buildTimelineEvent({
        type: 'Follow-up',
        title: 'Follow-up updated',
        description: updateData.followUpDate
          ? `Follow-up scheduled for ${updateData.followUpDate.toDateString()}`
          : 'Follow-up removed',
      })
    );
  }

  if (
    updateData.archived !== undefined &&
    updateData.archived !== currentApplication.archived
  ) {
    timelineEvents.push(
      buildTimelineEvent({
        type: 'Archive',
        title: updateData.archived ? 'Application archived' : 'Application restored',
      })
    );
  }

  if (
    updateData.favorite !== undefined &&
    updateData.favorite !== currentApplication.favorite
  ) {
    timelineEvents.push(
      buildTimelineEvent({
        type: 'Favorite',
        title: updateData.favorite ? 'Added to favorites' : 'Removed from favorites',
      })
    );
  }

  if (updateData.notes !== undefined || updateData.sourceNotes !== undefined || updateData.companyNotes !== undefined) {
    timelineEvents.push(
      buildTimelineEvent({
        type: 'Note',
        title: 'Notes updated',
      })
    );
  }

  const update = {
    $set: updateData,
  };

  if (timelineEvents.length > 0) {
    update.$push = {
      timeline: {
        $each: timelineEvents,
      },
    };
  }

  const externalApplication = await ExternalApplication.findOneAndUpdate(
    {
      _id: req.params.id,
      candidate: req.user._id,
    },
    update,
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
