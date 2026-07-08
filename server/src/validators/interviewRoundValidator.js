import { isEmpty } from './commonValidators.js';

export const validateInterviewRound = (req, res, next) => {
  const {
    roundName,
    roundType,
    scheduledAt,
    mode,
    status,
    meetingLink,
    interviewer,
    notes,
    feedback,
  } = req.body;

  const errors = [];

  if (isEmpty(roundName)) errors.push('Round name is required');
  if (isEmpty(roundType)) errors.push('Round type is required');
  if (isEmpty(scheduledAt)) errors.push('Scheduled date is required');
  if (isEmpty(status)) errors.push('Status is required');

  if (meetingLink !== undefined && meetingLink !== '' && !/^https?:\/\//i.test(meetingLink)) {
    errors.push('Meeting link must be a valid URL');
  }

  if (mode !== undefined && !['Online', 'Offline'].includes(mode)) {
    errors.push('Mode must be Online or Offline');
  }

  if (notes !== undefined && typeof notes !== 'string') {
    errors.push('Notes must be a string');
  }

  if (feedback !== undefined && typeof feedback !== 'string') {
    errors.push('Feedback must be a string');
  }

  if (interviewer !== undefined && typeof interviewer !== 'string') {
    errors.push('Interviewer must be a string');
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
