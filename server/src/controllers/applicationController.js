import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';
import User from '../models/userModel.js';
import ErrorResponse from '../utils/errorResponse.js';


// @desc    Apply to job
// @route   POST /api/applications/:jobId
// @access  Private
export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
  throw new ErrorResponse('Job not found', 404);
}

  // Check already applied
  const alreadyApplied = await Application.findOne({
    applicant: req.user._id,
    job: req.params.jobId,
  });

  throw new ErrorResponse(
    'Already applied to this job',
    400
  );

  const application = await Application.create({
    applicant: req.user._id,
    job: req.params.jobId,
    coverLetter: req.body.coverLetter || '',
    resume: req.user.resume || '',
  });

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
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    throw new ErrorResponse('Job not found', 404);
  }

  // Only creator can view applicants
  if (job.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new ErrorResponse('Not authorized', 403);
  }

  const applications = await Application.find({
    job: req.params.jobId,
  })
    .populate('applicant', 'name email role')
    .sort({ createdAt: -1 });

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
  const { status } = req.body;

  const application = await Application.findById(
    req.params.applicationId
  ).populate('job');

  if (!application) {
    res.status(404);
    throw new ErrorResponse('Application not found', 404);
  }

  // Only job creator can update status
  if (
    application.job.createdBy.toString() !==
    req.user._id.toString()
  ) {
    res.status(403);
    throw new ErrorResponse('Not authorized', 403);
  }

  application.status = status;

  await application.save();

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
  if (!req.file) {
    res.status(400);
    throw new ErrorResponse('No file uploaded', 400);
  }

  const result = await cloudinary.uploader.upload(
    req.file.path,
    {
      resource_type: 'auto',
      folder: 'quickhire/resumes',
    }
  );

  // Save resume URL in user profile
  const user = await User.findById(req.user._id);

  user.resume = result.secure_url;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Resume uploaded successfully',
    resumeUrl: result.secure_url,
  });
});