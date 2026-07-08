import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import ExternalApplication from '../models/externalApplicationModel.js';
import InterviewRound from '../models/interviewRoundModel.js';

const getUserSummary = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
};

const normalizeScheduledAt = (value) => {
  if (!value) {
    throw new ErrorResponse('Interview date is required', 400);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ErrorResponse('Interview date is invalid', 400);
  }

  return date;
};

export const getInterviewRoundsForApplication = asyncHandler(async (req, res) => {
  console.info('getInterviewRoundsForApplication payload', {
    params: req.params,
    user: getUserSummary(req.user),
  });

  const externalApplication = await ExternalApplication.findOne({
    _id: req.params.externalApplicationId,
    candidate: req.user._id,
  });

  if (!externalApplication) {
    throw new ErrorResponse('External application not found', 404);
  }

  const interviewRounds = await InterviewRound.find({
    externalApplication: externalApplication._id,
  }).sort({ scheduledAt: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: interviewRounds.length,
    interviewRounds,
  });
});

export const createInterviewRound = asyncHandler(async (req, res) => {
  const externalApplication = await ExternalApplication.findOne({
    _id: req.params.externalApplicationId,
    candidate: req.user._id,
  });

  if (!externalApplication) {
    throw new ErrorResponse('External application not found', 404);
  }

  const interviewRound = await InterviewRound.create({
    externalApplication: externalApplication._id,
    roundName: req.body.roundName?.trim(),
    roundType: req.body.roundType?.trim(),
    scheduledAt: normalizeScheduledAt(req.body.scheduledAt),
    mode: req.body.mode || 'Online',
    meetingLink: req.body.meetingLink?.trim() || '',
    interviewer: req.body.interviewer?.trim() || '',
    status: req.body.status || 'Scheduled',
    notes: req.body.notes?.trim() || '',
    feedback: req.body.feedback?.trim() || '',
  });

  res.status(201).json({
    success: true,
    message: 'Interview round created successfully',
    interviewRound,
  });
});

export const updateInterviewRound = asyncHandler(async (req, res) => {
  const interviewRound = await InterviewRound.findOne({
    _id: req.params.id,
  }).populate('externalApplication');

  if (!interviewRound) {
    throw new ErrorResponse('Interview round not found', 404);
  }

  if (interviewRound.externalApplication.candidate.toString() !== req.user._id.toString()) {
    throw new ErrorResponse('Not authorized', 403);
  }

  const updateData = {};

  if (req.body.roundName !== undefined) {
    updateData.roundName = req.body.roundName?.trim();
  }

  if (req.body.roundType !== undefined) {
    updateData.roundType = req.body.roundType?.trim();
  }

  if (req.body.scheduledAt !== undefined) {
    updateData.scheduledAt = normalizeScheduledAt(req.body.scheduledAt);
  }

  if (req.body.mode !== undefined) {
    updateData.mode = req.body.mode;
  }

  if (req.body.meetingLink !== undefined) {
    updateData.meetingLink = req.body.meetingLink?.trim() || '';
  }

  if (req.body.interviewer !== undefined) {
    updateData.interviewer = req.body.interviewer?.trim() || '';
  }

  if (req.body.status !== undefined) {
    updateData.status = req.body.status;
  }

  if (req.body.notes !== undefined) {
    updateData.notes = req.body.notes?.trim() || '';
  }

  if (req.body.feedback !== undefined) {
    updateData.feedback = req.body.feedback?.trim() || '';
  }

  const updatedInterviewRound = await InterviewRound.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Interview round updated successfully',
    interviewRound: updatedInterviewRound,
  });
});

export const deleteInterviewRound = asyncHandler(async (req, res) => {
  const interviewRound = await InterviewRound.findById(req.params.id).populate('externalApplication');

  if (!interviewRound) {
    throw new ErrorResponse('Interview round not found', 404);
  }

  if (interviewRound.externalApplication.candidate.toString() !== req.user._id.toString()) {
    throw new ErrorResponse('Not authorized', 403);
  }

  await InterviewRound.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Interview round deleted successfully',
  });
});
