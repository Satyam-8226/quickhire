import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';
import User from '../models/userModel.js';
import ErrorResponse from '../utils/errorResponse.js';
import mongoose from 'mongoose';

const getUserSummary = (user) => {
  if (!user) return null;
  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
};

const logDatabaseError = (operation, err, req) => {
  console.error(`===== DB ERROR: ${operation} =====`);
  console.error('Error:', err.message || err);
  console.error('Request URL:', req.originalUrl);
  console.error('Method:', req.method);
  console.error('Params:', JSON.stringify(req.params));
  console.error('Body:', JSON.stringify(req.body));
  console.error('User:', getUserSummary(req.user));
  console.error('===== END DB ERROR =====');
};

// @desc    Apply to job
// @route   POST /api/applications/:jobId
// @access  Private
export const applyToJob = asyncHandler(async (req, res) => {
  console.info('applyToJob payload', {
    params: req.params,
    body: req.body,
    user: getUserSummary(req.user),
  });

  let job;
  try {
    job = await Job.findById(req.params.jobId);
  } catch (err) {
    logDatabaseError('find job by id', err, req);
    throw new ErrorResponse('Error fetching job details', 500);
  }

  if (!job) {
    throw new ErrorResponse('Job not found', 404);
  }

  let alreadyApplied;
  try {
    alreadyApplied = await Application.findOne({
      applicant: req.user._id,
      job: req.params.jobId,
    });
  } catch (err) {
    logDatabaseError('check duplicate application', err, req);
    throw new ErrorResponse('Error checking existing application', 500);
  }

  if (alreadyApplied) {
    throw new ErrorResponse('Already applied to this job', 400);
  }

  let application;
  try {
    application = await Application.create({
      applicant: req.user._id,
      job: req.params.jobId,
      coverLetter: req.body?.coverLetter || '',
      resume: req.user.currentResume?.resumeUrl || req.user.resume || '',
    });
  } catch (err) {
    logDatabaseError('create application', err, req);
    throw new ErrorResponse('Failed to create application', 500);
  }

  res.status(201).json({
    success: true,
    message: 'Applied successfully',
    application,
  });
});

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter/Admin)
export const getApplicantsForJob = asyncHandler(async (req, res) => {
  console.info('getApplicantsForJob payload', {
    params: req.params,
    body: req.body,
    user: getUserSummary(req.user),
  });

  let job;
  try {
    job = await Job.findById(req.params.jobId);
  } catch (err) {
    logDatabaseError('find job by id', err, req);
    throw new ErrorResponse('Error fetching job details', 500);
  }

  if (!job) {
    throw new ErrorResponse('Job not found', 404);
  }

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ErrorResponse('Not authorized to view applicants', 403);
  }

  let applications;
  try {
    applications = await Application.find({
      job: req.params.jobId,
    })
      .populate('applicant', 'name email resume currentResume createdAt')
      .populate('job', 'title company')
      .sort({ createdAt: -1 });
  } catch (err) {
    logDatabaseError('find applications for job', err, req);
    throw new ErrorResponse('Error fetching applicants', 500);
  }

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

// @desc    Update application status
// @route   PUT /api/applications/:applicationId
// @access  Private (Recruiter/Admin)
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  console.info('updateApplicationStatus payload', {
    params: req.params,
    body: req.body,
    user: getUserSummary(req.user),
  });

  const { status } = req.body;

  let application;
  try {
    application = await Application.findById(req.params.applicationId).populate('job');
  } catch (err) {
    logDatabaseError('find application by id', err, req);
    throw new ErrorResponse('Error fetching application', 500);
  }

  if (!application) {
    throw new ErrorResponse('Application not found', 404);
  }

  if (application.job.createdBy.toString() !== req.user._id.toString()) {
    throw new ErrorResponse('Not authorized', 403);
  }

  application.status = status;

  try {
    await application.save();
  } catch (err) {
    logDatabaseError('save application status', err, req);
    throw new ErrorResponse('Failed to update application status', 500);
  }

  res.status(200).json({
    success: true,
    message: 'Application status updated',
    application,
  });
});

// @desc    Upload resume
// @route   PUT /api/applications/upload-resume
// @access  Private
export const uploadResume = asyncHandler(async (req, res) => {
  console.info('uploadResume payload', {
    params: req.params,
    body: req.body,
    user: getUserSummary(req.user),
  });

  if (!req.file) {
    throw new ErrorResponse('No file uploaded', 400);
  }

  let result;
  try {
    result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'quickhire/resumes',
    });
  } catch (err) {
    logDatabaseError('upload resume to cloudinary', err, req);
    throw new ErrorResponse('Failed to upload resume', 500);
  }

  // Save versioned resume history on user
  let user;
  try {
    user = await User.findById(req.user._id);
  } catch (err) {
    logDatabaseError('find user for resume save', err, req);
    throw new ErrorResponse('Error updating resume', 500);
  }

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  // Determine next version
  const lastVersion = (user.resumeHistory && user.resumeHistory.length > 0)
    ? Math.max(...user.resumeHistory.map(r => r.version))
    : 0;

  const nextVersion = lastVersion + 1;

  // Mark previous active versions inactive
  if (Array.isArray(user.resumeHistory)) {
    user.resumeHistory.forEach((v) => { v.active = false; });
  } else {
    user.resumeHistory = [];
  }

  const entry = {
    version: nextVersion,
    fileName: req.file.originalname || `resume_v${nextVersion}`,
    resumeUrl: result.secure_url,
    publicId: result.public_id || '',
    uploadedAt: new Date(),
    active: true,
  };

  user.resumeHistory.push(entry);

  // Update currentResume shortcut and legacy resume field
  user.currentResume = {
    version: entry.version,
    fileName: entry.fileName,
    resumeUrl: entry.resumeUrl,
    publicId: entry.publicId,
    uploadedAt: entry.uploadedAt,
    active: true,
  };

  user.resume = entry.resumeUrl;

  try {
    await user.save();
  } catch (err) {
    logDatabaseError('save user resume URL', err, req);
    throw new ErrorResponse('Failed to save resume', 500);
  }

  res.status(200).json({
    success: true,
    message: 'Resume uploaded successfully',
    resumeUrl: result.secure_url,
    version: nextVersion,
  });
});

// @desc    Get resume history for current user
// @route   GET /api/applications/resumes
// @access  Private (candidate)
export const getMyResumes = asyncHandler(async (req, res) => {
  let user;
  try {
    user = await User.findById(req.user._id);
  } catch (err) {
    logDatabaseError('find user for resume history', err, req);
    throw new ErrorResponse('Error fetching resume history', 500);
  }

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  const history = (user.resumeHistory || []).map((r) => ({
    version: r.version,
    fileName: r.fileName,
    resumeUrl: r.resumeUrl,
    uploadedAt: r.uploadedAt,
    active: r.active,
    id: r._id,
  })).sort((a,b) => b.version - a.version);

  res.status(200).json({ success: true, history });
});

// @desc    Activate a resume version
// @route   PATCH /api/applications/resumes/:versionId/activate
// @access  Private (candidate)
export const activateResumeVersion = asyncHandler(async (req, res) => {
  const { versionId } = req.params;

  let user;
  try {
    user = await User.findById(req.user._id);
  } catch (err) {
    logDatabaseError('find user for resume activate', err, req);
    throw new ErrorResponse('Error activating resume', 500);
  }

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  const target = user.resumeHistory.id(versionId);

  if (!target) {
    throw new ErrorResponse('Resume version not found', 404);
  }

  // deactivate all
  user.resumeHistory.forEach((r) => { r.active = false; });

  target.active = true;

  user.currentResume = {
    version: target.version,
    fileName: target.fileName,
    resumeUrl: target.resumeUrl,
    publicId: target.publicId,
    uploadedAt: target.uploadedAt,
    active: true,
  };

  user.resume = target.resumeUrl;

  try {
    await user.save();
  } catch (err) {
    logDatabaseError('save user resume activate', err, req);
    throw new ErrorResponse('Failed to activate resume', 500);
  }

  res.status(200).json({ success: true, message: 'Resume activated', current: user.currentResume });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  console.info('getMyApplications payload', {
    params: req.params,
    body: req.body,
    user: getUserSummary(req.user),
  });

  let applications;
  try {
    applications = await Application.find({
      applicant: req.user._id,
    }).populate('job');
  } catch (err) {
    logDatabaseError('find user applications', err, req);
    throw new ErrorResponse('Error fetching applications', 500);
  }

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});
