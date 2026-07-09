import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Archive, ArchiveRestore, ArrowLeft, Bookmark, ExternalLink, Flag, Paperclip, Save, Star, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  getExternalApplicationById,
  getInterviewRounds,
  updateExternalApplication,
  uploadExternalApplicationAttachment,
} from '../../api/applicationApi';
import { getErrorMessage } from '../../utils/errorMessage';
import PageHeader from '../../components/ui/PageHeader';
import AppCard from '../../components/ui/AppCard';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Timeline from '../../components/ui/Timeline';
import ActivityFeed from '../../components/ui/ActivityFeed';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import AppSelect from '../../components/ui/AppSelect';
import AppTextarea from '../../components/ui/AppTextarea';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

const statusOptions = [
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
];

const attachmentTypes = [
  'Offer Letter',
  'Assignment PDF',
  'Interview Notes',
  'Other',
];

const companyNoteLabels = {
  interviewExperience: 'Interview experience',
  questionsAsked: 'Questions asked',
  recruiterInformation: 'Recruiter information',
  preparationNotes: 'Preparation notes',
  salaryDiscussion: 'Salary discussion',
  cultureNotes: 'Culture notes',
  futureTips: 'Future tips',
};

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [interviewRounds, setInterviewRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notesForm, setNotesForm] = useState({ notes: '', sourceNotes: '' });
  const [companyNotesForm, setCompanyNotesForm] = useState({});
  const [attachmentForm, setAttachmentForm] = useState({
    type: 'Other',
    label: '',
    notes: '',
    file: null,
  });

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [applicationResult, interviewResult] = await Promise.all([
        getExternalApplicationById(id),
        getInterviewRounds(id),
      ]);

      setApplication(applicationResult?.externalApplication || null);
      setNotesForm({
        notes: applicationResult?.externalApplication?.notes || '',
        sourceNotes: applicationResult?.externalApplication?.sourceNotes || '',
      });
      setCompanyNotesForm(applicationResult?.externalApplication?.companyNotes || {});
      setInterviewRounds(interviewResult?.interviewRounds || []);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to load application details');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const patchApplication = async (payload, successMessage = 'Application updated') => {
    try {
      setSaving(true);
      const data = await updateExternalApplication(id, payload);
      setApplication(data.externalApplication);
      setNotesForm({
        notes: data.externalApplication.notes || '',
        sourceNotes: data.externalApplication.sourceNotes || '',
      });
      setCompanyNotesForm(data.externalApplication.companyNotes || {});
      toast.success(successMessage);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update application'));
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveToggle = () => {
    const nextArchived = !application.archived;
    const confirmed = window.confirm(
      nextArchived ? 'Archive this application?' : 'Restore this application?'
    );
    if (!confirmed) return;

    patchApplication(
      { archived: nextArchived },
      nextArchived ? 'Application archived' : 'Application restored'
    );
  };

  const handleAttachmentSubmit = async (event) => {
    event.preventDefault();

    if (!attachmentForm.file) {
      toast.error('Choose a PDF attachment first');
      return;
    }

    const formData = new FormData();
    formData.append('attachment', attachmentForm.file);
    formData.append('type', attachmentForm.type);
    formData.append('label', attachmentForm.label);
    formData.append('notes', attachmentForm.notes);

    try {
      setUploading(true);
      const data = await uploadExternalApplicationAttachment(id, formData);
      setApplication(data.externalApplication);
      setAttachmentForm({
        type: 'Other',
        label: '',
        notes: '',
        file: null,
      });
      event.target.reset();
      toast.success('Attachment uploaded');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to upload attachment'));
    } finally {
      setUploading(false);
    }
  };

  const timelineEvents = useMemo(() => {
    if (!application) return [];

    const persistedEvents = (application.timeline || []).map((event) => ({
      id: event._id || `${event.type}-${event.occurredAt}`,
      title: event.title || event.type,
      description: event.description,
      date: event.occurredAt,
    }));

    const events = [
      {
        id: 'created',
        title: 'Application created',
        description: `Applied to ${application.companyName} for ${application.role}`,
        date: application.createdAt,
      },
      {
        id: 'status-changed',
        title: 'Current status',
        description: `Status changed to ${application.status}`,
        date: application.updatedAt || application.createdAt,
      },
    ];

    if (application.followUpDate) {
      events.push({
        id: 'follow-up',
        title: 'Follow-up scheduled',
        description: `Next follow-up on ${new Date(application.followUpDate).toLocaleDateString()}`,
        date: application.followUpDate,
      });
    }

    interviewRounds.forEach((interview) => {
      events.push({
        id: interview._id,
        title: interview.status === 'Completed' ? 'Interview completed' : 'Interview scheduled',
        description: `${interview.roundName} • ${interview.roundType}`,
        date: interview.scheduledAt,
        extra: interview.notes || interview.feedback,
      });
    });

    if (application.status === 'Offer') {
      events.push({
        id: 'offer',
        title: 'Offer received',
        description: application.expectedSalary ? `Offer noted at ${application.expectedSalary}` : 'Offer received',
        date: application.updatedAt || new Date(),
      });
    }

    if (application.status === 'Rejected') {
      events.push({
        id: 'rejected',
        title: 'Application rejected',
        description: 'The role has been marked rejected',
        date: application.updatedAt || new Date(),
      });
    }

    return [...persistedEvents, ...events]
      .filter((event) => event.date && !Number.isNaN(new Date(event.date).getTime()))
      .filter((event, index, allEvents) => {
        const key = `${event.title}-${new Date(event.date).toISOString()}`;
        return allEvents.findIndex((item) => `${item.title}-${new Date(item.date).toISOString()}` === key) === index;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [application, interviewRounds]);

  const activityItems = useMemo(() => {
    if (!application) return [];

    const items = [
      {
        id: 'applied',
        title: `Added ${application.companyName} application`,
        description: `${application.role} • ${application.platform}`,
        timestamp: new Date(application.createdAt).toLocaleDateString(),
        badge: application.status,
      },
      {
        id: 'status',
        title: `Status is ${application.status}`,
        description: `Priority ${application.priority}`,
        timestamp: new Date(application.updatedAt || application.createdAt).toLocaleDateString(),
      },
    ];

    if (application.followUpDate) {
      items.push({
        id: 'follow-up-activity',
        title: 'Follow-up date set',
        description: new Date(application.followUpDate).toLocaleDateString(),
        timestamp: new Date(application.followUpDate).toLocaleDateString(),
        badge: 'Follow-up',
      });
    }

    interviewRounds.forEach((interview) => {
      items.push({
        id: interview._id,
        title: `${interview.status} for ${application.companyName}`,
        description: `${interview.roundName} • ${interview.roundType}`,
        timestamp: new Date(interview.scheduledAt).toLocaleDateString(),
        badge: interview.status,
      });
    });

    return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [application, interviewRounds]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-8 w-72 rounded-lg bg-slate-100 animate-pulse" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-4">
            <div className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
              <div className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-28 rounded-3xl bg-slate-100 animate-pulse" />
            <div className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Application details unavailable"
        message={error}
        onRetry={fetchDetails}
      />
    );
  }

  if (!application) {
    return (
      <EmptyState
        title="Application not found"
        message="We couldn’t locate that application. Try going back to your applications list."
        buttonText="Back to applications"
        buttonLink="/candidate/external-applications"
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <PageHeader
            title={`${application.companyName} · ${application.role}`}
            description="A dedicated CRM-style profile for the role you’re tracking."
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
            <Bookmark className="h-4 w-4 text-brand" />
            {application.favorite ? 'Favorited' : 'Not favorited'}
          </span>
          {application.archived && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
              <Archive className="h-4 w-4 text-brand" />
              Archived
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
            <Flag className="h-4 w-4 text-brand" />
            Priority {application.priority}
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <AppCard hover={false} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Application overview</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Company, platform, status, and resume context in one place.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={application.status} />
                <button
                  type="button"
                  onClick={() =>
                    patchApplication(
                      { favorite: !application.favorite },
                      application.favorite ? 'Removed from favorites' : 'Added to favorites'
                    )
                  }
                  disabled={saving}
                  className={`inline-flex items-center rounded-full border p-2 transition ${
                    application.favorite
                      ? 'border-amber-200 bg-amber-50 text-amber-600'
                      : 'border-slate-200 text-slate-500 hover:border-brand hover:text-brand'
                  }`}
                  aria-label={application.favorite ? 'Remove favorite' : 'Favorite application'}
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleArchiveToggle}
                  disabled={saving}
                  className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-brand hover:text-brand"
                  aria-label={application.archived ? 'Restore application' : 'Archive application'}
                >
                  {application.archived ? (
                    <ArchiveRestore className="h-4 w-4" />
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <AppSelect
                label="Update status"
                value={application.status}
                onChange={(event) =>
                  patchApplication({ status: event.target.value }, 'Status updated')
                }
                disabled={saving}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </AppSelect>
              {application.applicationUrl && (
                <div className="flex items-end">
                  <a
                    href={application.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-brand hover:text-brand"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open posting
                  </a>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Applied</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{new Date(application.appliedDate).toLocaleDateString()}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Platform</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{application.platform}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Location</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{application.location || 'Remote'}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Salary</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{application.expectedSalary || 'Not set'}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Follow-up</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {application.followUpDate ? new Date(application.followUpDate).toLocaleDateString() : 'No follow-up scheduled'}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Interview count</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{application.interviewCount || 0}</p>
              </div>
            </div>
          </AppCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Notes" subtitle="Capture conversation context and source details." hover={false}>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  patchApplication(notesForm, 'Notes saved');
                }}
              >
                <AppTextarea
                  label="Application notes"
                  value={notesForm.notes}
                  onChange={(event) =>
                    setNotesForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Add conversation context, follow-up notes, and decisions."
                />
                <AppTextarea
                  label="Source notes"
                  value={notesForm.sourceNotes}
                  onChange={(event) =>
                    setNotesForm((current) => ({ ...current, sourceNotes: event.target.value }))
                  }
                  placeholder="Capture source platform details, referral context, or job post notes."
                />
                <AppButton type="submit" size="md" disabled={saving}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save notes'}
                </AppButton>
              </form>
            </SectionCard>

            <SectionCard title="Company notes" subtitle="Structured notes for your follow-up and preparation." hover={false}>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  patchApplication({ companyNotes: companyNotesForm }, 'Company notes saved');
                }}
              >
                {Object.entries(companyNoteLabels).map(([key, label]) => (
                  <AppTextarea
                    key={key}
                    label={label}
                    value={companyNotesForm?.[key] || ''}
                    className="min-h-24"
                    onChange={(event) =>
                      setCompanyNotesForm((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                  />
                ))}
                <AppButton type="submit" size="md" disabled={saving}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save company notes'}
                </AppButton>
              </form>
            </SectionCard>
          </div>

          <SectionCard title="Attachments" subtitle="Upload offer letters, assignments, and interview PDFs." hover={false}>
            <form onSubmit={handleAttachmentSubmit} className="mb-5 grid gap-4 md:grid-cols-2">
              <AppSelect
                label="Attachment type"
                value={attachmentForm.type}
                onChange={(event) =>
                  setAttachmentForm((current) => ({ ...current, type: event.target.value }))
                }
              >
                {attachmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </AppSelect>
              <AppInput
                label="Label"
                value={attachmentForm.label}
                onChange={(event) =>
                  setAttachmentForm((current) => ({ ...current, label: event.target.value }))
                }
                placeholder="Offer letter, take-home assignment..."
              />
              <AppInput
                label="PDF file"
                type="file"
                accept="application/pdf"
                onChange={(event) =>
                  setAttachmentForm((current) => ({
                    ...current,
                    file: event.target.files?.[0] || null,
                  }))
                }
                required
              />
              <AppInput
                label="Attachment notes"
                value={attachmentForm.notes}
                onChange={(event) =>
                  setAttachmentForm((current) => ({ ...current, notes: event.target.value }))
                }
                placeholder="Optional context"
              />
              <div className="md:col-span-2">
                <AppButton type="submit" size="md" disabled={uploading}>
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload attachment'}
                </AppButton>
              </div>
            </form>
            {application.attachments && application.attachments.length > 0 ? (
              <div className="space-y-3">
                {application.attachments.map((attachment) => (
                  <div key={attachment.url || attachment.label} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{attachment.label || attachment.type}</p>
                      <p className="mt-1 text-sm text-slate-500">{attachment.notes || attachment.type || 'No details provided.'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-slate-500">{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                      {attachment.url && (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-brand"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                embedded
                title="No attachments yet"
                message="Use attachments later to store offer letters, interview notes, and documents."
                hideAction
              />
            )}
          </SectionCard>

          <SectionCard title="Timeline" subtitle="Important application milestones in order." hover={false}>
            <Timeline events={timelineEvents} />
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="Activity feed" subtitle="Recent updates for this role." hover={false}>
            <ActivityFeed items={activityItems} />
          </SectionCard>

          <SectionCard title="Interview history" subtitle="Past and upcoming interview rounds." hover={false}>
            {interviewRounds.length === 0 ? (
              <EmptyState
                embedded
                title="No interview history"
                message="Add interviews from your application list to track progress here."
                hideAction
              />
            ) : (
              <div className="space-y-3">
                {interviewRounds.map((interview) => (
                  <div key={interview._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{interview.roundName}</p>
                        <p className="mt-1 text-sm text-slate-500">{interview.roundType}</p>
                      </div>
                      <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">{interview.status}</span>
                    </div>
                    <div className="mt-3 text-sm text-slate-500">
                      <p>{new Date(interview.scheduledAt).toLocaleString()}</p>
                      {interview.interviewer && <p>Interviewer: {interview.interviewer}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </aside>
      </div>
    </div>
  );
};

export default ApplicationDetails;
