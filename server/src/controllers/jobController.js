import Job from '../models/jobModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';


// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    location,
    jobType,
    salary,
    description,
    requirements,
    skills,
  } = req.body;

  const job = await Job.create({
    title,
    company,
    location,
    jobType,
    salary,
    description,
    requirements,
    skills,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    job,
  });
});


// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword || '';
  const location = req.query.location || '';
  const jobType = req.query.jobType || '';

  const query = {
    title: {
      $regex: keyword,
      $options: 'i',
    },

    location: {
      $regex: location,
      $options: 'i',
    },

    jobType: {
      $regex: jobType,
      $options: 'i',
    },
  };

  const jobs = await Job.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});


// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.status(200).json({
    success: true,
    job,
  });
});


// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check ownership
  if (job.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    job: updatedJob,
  });
});


// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check ownership
  if (job.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});