import mongoose from 'mongoose';

const externalApplicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: [
        'LinkedIn',
        'Internshala',
        'Wellfound',
        'Naukri',
        'Indeed',
        'Company Careers',
        'Referral',
        'Other',
      ],
      required: true,
      trim: true,
    },

    applicationUrl: {
      type: String,
      default: '',
      trim: true,
    },

    appliedDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
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
      ],
      default: 'Applied',
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    interviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },

    expectedSalary: {
      type: String,
      default: '',
      trim: true,
    },

    location: {
      type: String,
      default: '',
      trim: true,
    },

    sourceNotes: {
      type: String,
      default: '',
      trim: true,
    },

    notes: {
      type: String,
      default: '',
      trim: true,
    },

    archived: {
      type: Boolean,
      default: false,
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    attachments: [
      {
        type: {
          type: String,
          enum: ['Offer Letter', 'Assignment PDF', 'Interview Notes', 'Other'],
          default: 'Other',
        },
        label: {
          type: String,
          trim: true,
          default: '',
        },
        url: {
          type: String,
          trim: true,
          default: '',
        },
        notes: {
          type: String,
          trim: true,
          default: '',
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    companyNotes: {
      interviewExperience: {
        type: String,
        default: '',
        trim: true,
      },
      questionsAsked: {
        type: String,
        default: '',
        trim: true,
      },
      recruiterInformation: {
        type: String,
        default: '',
        trim: true,
      },
      preparationNotes: {
        type: String,
        default: '',
        trim: true,
      },
      salaryDiscussion: {
        type: String,
        default: '',
        trim: true,
      },
      cultureNotes: {
        type: String,
        default: '',
        trim: true,
      },
      futureTips: {
        type: String,
        default: '',
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const ExternalApplication = mongoose.model(
  'ExternalApplication',
  externalApplicationSchema
);

export default ExternalApplication;
