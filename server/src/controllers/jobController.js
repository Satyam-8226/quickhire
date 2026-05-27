import Job from '../models/jobModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import Application from '../models/applicationModel.js';
import ErrorResponse from '../utils/errorResponse.js';


// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
export const createJob = asyncHandler(async (req, res) => {
  try {
    console.log('===== CREATE JOB DEBUG =====');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user ? { id: req.user._id, role: req.user.role } : 'No user');

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

    // Validation logging
    console.log('Destructured values:', {
      title,
      company,
      location,
      jobType,
      salary: { value: salary, type: typeof salary },
      description,
      requirements: { value: requirements, type: Array.isArray(requirements) ? 'array' : typeof requirements },
      skills,
    });

    // Validate required fields
    if (!title) throw new ErrorResponse('Title is required', 400);
    if (!company) throw new ErrorResponse('Company is required', 400);
    if (!location) throw new ErrorResponse('Location is required', 400);
    if (!jobType) throw new ErrorResponse('Job type is required', 400);
    if (salary === undefined || salary === null || salary === '') throw new ErrorResponse('Salary is required', 400);
    if (!description) throw new ErrorResponse('Description is required', 400);
    if (!requirements || requirements.length === 0) throw new ErrorResponse('Requirements are required', 400);

    // Ensure salary is a number
    const numSalary = Number(salary);
    if (isNaN(numSalary)) throw new ErrorResponse('Salary must be a valid number', 400);

    // Ensure requirements is an array
    const reqArray = Array.isArray(requirements) ? requirements : (requirements ? [requirements] : []);
    if (reqArray.length === 0) throw new ErrorResponse('At least one requirement is required', 400);

    console.log('Validation passed. Creating job with:', {
      title,
      company,
      location,
      jobType,
      salary: numSalary,
      description,
      requirements: reqArray,
      createdBy: req.user._id,
    });

    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      salary: numSalary,
      description,
      requirements: reqArray,
      skills: skills || [],
      createdBy: req.user._id,
    });

    console.log('Job created successfully:', job._id);
    console.log('===== END DEBUG =====');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    console.error('===== CREATE JOB ERROR =====');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    if (error.errors) {
      console.error('Validation Errors:', error.errors);
    }
    console.error('===== END ERROR =====');
    throw error;
  }
});


// @desc    Get recruiter jobs
// @route   GET /api/jobs/my-jobs
// @access  Private
export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({
    createdBy: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});


// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = asyncHandler(async (req, res) => {
  // ===============================
  // QUERY PARAMS
  // ===============================

  const keyword = req.query.keyword || "";
  const location = req.query.location || "";
  const jobType = req.query.jobType || "";

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  
  // ===============================
  // DYNAMIC FILTER QUERY
  // ===============================

  const query = {};

  // Keyword Search (title + company)
  if (keyword) {
    query.$or = [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        company: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  // Location Filter
  if (location) {
    query.location = {
      $regex: location,
      $options: "i",
    };
  }

  // Job Type Filter
  if (jobType) {
    query.jobType = {
      $regex: jobType,
      $options: "i",
    };
  }


  // ===============================
  // TOTAL JOB COUNT
  // ===============================

  const totalJobs = await Job.countDocuments(query);


  // ===============================
  // FETCH JOBS
  // ===============================

  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);


  // ===============================
  // RESPONSE
  // ===============================

  res.status(200).json({
    success: true,

    message:
      jobs.length > 0
        ? "Jobs fetched successfully"
        : "No jobs found",

    currentPage: page,

    totalPages: Math.ceil(totalJobs / limit),

    totalJobs,

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
    throw new ErrorResponse('Job not found', 404);
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
    throw new ErrorResponse('Job not found', 404);
  }

  // Check ownership
  if (job.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new ErrorResponse('Not authorized', 403);
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
  throw new ErrorResponse('Job not found', 404);
}

  // Check ownership
  if (job.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new ErrorResponse('Not authorized', 403);
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});


// @desc    Recruiter dashboard stats
// @route   GET /api/jobs/stats
// @access  Private
export const getRecruiterStats = asyncHandler(async (req, res) => {
  const totalJobs = await Job.countDocuments({
    createdBy: req.user._id,
  });

  const recruiterJobs = await Job.find({
    createdBy: req.user._id,
  });

  const jobIds = recruiterJobs.map(job => job._id);

  const totalApplications = await Application.countDocuments({
    job: { $in: jobIds },
  });

  res.status(200).json({
    success: true,
    totalJobs,
    totalApplications,
  });
});