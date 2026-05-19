import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';


// @desc    Apply to job
// @route   POST /api/applications/:jobId
// @access  Private
export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check already applied
  const alreadyApplied = await Application.findOne({
    applicant: req.user._id,
    job: req.params.jobId,
  });

  if (alreadyApplied) {
    res.status(400);
    throw new Error('Already applied to this job');
  }

  const application = await Application.create({
    applicant: req.user._id,
    job: req.params.jobId,
    coverLetter: req.body.coverLetter || '',
    resume: req.body.resume || '',
  });

  res.status(201).json({
    success: true,
    message: 'Applied successfully',
    application,
  });
});