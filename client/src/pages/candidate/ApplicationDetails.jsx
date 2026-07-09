import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, CalendarDays, ClipboardList, FilePlus, Flag, Link as LinkIcon, MapPin, Paperclip, Star, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

import { getExternalApplicationById, getInterviewRounds } from '../../api/applicationApi';
import { getErrorMessage } from '../../utils/errorMessage';
import PageHeader from '../../components/ui/PageHeader';
import AppCard from '../../components/ui/AppCard';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Timeline from '../../components/ui/Timeline';
import ActivityFeed from '../../components/ui/ActivityFeed';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [interviewRounds, setInterviewRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const [applicationResult, interviewResult] = await Promise.all([
        getExternalApplicationById(id),
        getInterviewRounds(id),
      ]);

      setApplication(applicationResult?.externalApplication || null);
      setInterviewRounds(interviewResult?.interviewRounds || []);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to load application details');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const timelineEvents = useMemo(() => {
    if (!application) return [];

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

    return events
      .filter((event) => event.date)
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
              <StatusBadge status={application.status} />
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
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Application notes</p>
                  <p className="mt-2 text-sm text-slate-500">{application.notes || 'No notes added yet.'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Source notes</p>
                  <p className="mt-2 text-sm text-slate-500">{application.sourceNotes || 'No source notes yet.'}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Company notes" subtitle="Structured notes for your follow-up and preparation." hover={false}>
              <div className="space-y-4 text-sm text-slate-600">
                {Object.entries(application.companyNotes || {}).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-sm font-semibold text-slate-900">{label.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</p>
                    <p className="mt-1 text-sm text-slate-500">{value || 'Not captured yet.'}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Attachments" subtitle="Placeholder support for future documents." hover={false}>
            {application.attachments && application.attachments.length > 0 ? (
              <div className="space-y-3">
                {application.attachments.map((attachment) => (
                  <div key={attachment.url || attachment.label} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{attachment.label || attachment.type}</p>
                      <p className="mt-1 text-sm text-slate-500">{attachment.notes || 'No details provided.'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-slate-500">{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
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
