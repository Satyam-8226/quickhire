import mongoose from 'mongoose';

const interviewRoundSchema = new mongoose.Schema(
  {
    externalApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExternalApplication',
      required: true,
      index: true,
    },

    roundName: {
      type: String,
      required: true,
      trim: true,
    },

    roundType: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    mode: {
      type: String,
      enum: ['Online', 'Offline'],
      default: 'Online',
    },

    meetingLink: {
      type: String,
      default: '',
      trim: true,
    },

    interviewer: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
    },

    notes: {
      type: String,
      default: '',
      trim: true,
    },

    feedback: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewRound = mongoose.model('InterviewRound', interviewRoundSchema);

export default InterviewRound;
