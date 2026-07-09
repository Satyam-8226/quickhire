import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Archive, ArchiveRestore, CalendarDays, ChevronRight, ExternalLink, Pencil, Plus, Star, Trash2 } from "lucide-react";

import {
  createExternalApplication,
  createInterviewRound,
  deleteExternalApplication,
  deleteInterviewRound,
  getInterviewRounds,
  getMyExternalApplications,
  updateExternalApplication,
  updateInterviewRound,
} from "../../api/applicationApi";
import { getErrorMessage } from "../../utils/errorMessage";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import TableSkeleton from "../../components/skeletons/TableSkeleton";
import AppButton from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";
import AppInput from "../../components/ui/AppInput";
import AppSelect from "../../components/ui/AppSelect";
import AppTextarea from "../../components/ui/AppTextarea";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  AppTable,
  AppTableBody,
  AppTableCell,
  AppTableElement,
  AppTableHead,
  AppTableHeaderCell,
  AppTableRow,
} from "../../components/ui/AppTable";

const initialFormState = {
  companyName: "",
  role: "",
  platform: "",
  applicationUrl: "",
  appliedDate: "",
  status: "Applied",
  notes: "",
  sourceNotes: "",
  followUpDate: "",
  interviewCount: 0,
  priority: "Medium",
  expectedSalary: "",
  location: "",
  favorite: false,
  archived: false,
  companyNotes: {
    interviewExperience: "",
    questionsAsked: "",
    recruiterInformation: "",
    preparationNotes: "",
    salaryDiscussion: "",
    cultureNotes: "",
    futureTips: "",
  },
};

const statusOptions = [
  { label: "Applied", value: "Applied" },
  { label: "OA Scheduled", value: "OA Scheduled" },
  { label: "OA Completed", value: "OA Completed" },
  { label: "Interview Scheduled", value: "Interview Scheduled" },
  { label: "Interviewing", value: "Interviewing" },
  { label: "HR Round", value: "HR Round" },
  { label: "Offer", value: "Offer" },
  { label: "Rejected", value: "Rejected" },
  { label: "Withdrawn", value: "Withdrawn" },
  { label: "Ghosted", value: "Ghosted" },
];

const platformOptions = [
  { label: "LinkedIn", value: "LinkedIn" },
  { label: "Internshala", value: "Internshala" },
  { label: "Wellfound", value: "Wellfound" },
  { label: "Naukri", value: "Naukri" },
  { label: "Indeed", value: "Indeed" },
  { label: "Company Careers", value: "Company Careers" },
  { label: "Referral", value: "Referral" },
  { label: "Other", value: "Other" },
];

const ExternalApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterFavorite, setFilterFavorite] = useState("");
  const [filterArchived, setFilterArchived] = useState("false");
  const [filterPriority, setFilterPriority] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [followUpFrom, setFollowUpFrom] = useState("");
  const [followUpTo, setFollowUpTo] = useState("");
  const [quickFilter, setQuickFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [interviewsByApplication, setInterviewsByApplication] = useState({});
  const [interviewForm, setInterviewForm] = useState({
    roundName: "",
    roundType: "",
    scheduledAt: "",
    mode: "Online",
    meetingLink: "",
    interviewer: "",
    status: "Scheduled",
    notes: "",
    feedback: "",
  });
  const [activeInterviewApplicationId, setActiveInterviewApplicationId] = useState(null);
  const [editingInterviewId, setEditingInterviewId] = useState(null);
  const [interviewSubmitting, setInterviewSubmitting] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const query = {
        search: searchText || undefined,
        status: filterStatus || undefined,
        platform: filterPlatform || undefined,
        favorite: filterFavorite || undefined,
        archived: filterArchived || undefined,
        priority: filterPriority || undefined,
        appliedFrom: appliedFrom || undefined,
        appliedTo: appliedTo || undefined,
        followUpFrom: followUpFrom || undefined,
        followUpTo: followUpTo || undefined,
        overdue: quickFilter === "overdue" ? "true" : undefined,
        today: quickFilter === "today" ? "true" : undefined,
        tomorrow: quickFilter === "tomorrow" ? "true" : undefined,
        thisWeek: quickFilter === "thisWeek" ? "true" : undefined,
      };
      const data = await getMyExternalApplications(query);
      setApplications(data?.externalApplications || []);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to fetch external applications");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [
    searchText,
    filterStatus,
    filterPlatform,
    filterFavorite,
    filterArchived,
    filterPriority,
    appliedFrom,
    appliedTo,
    followUpFrom,
    followUpTo,
    quickFilter,
  ]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const resetInterviewForm = () => {
    setInterviewForm({
      roundName: "",
      roundType: "",
      scheduledAt: "",
      mode: "Online",
      meetingLink: "",
      interviewer: "",
      status: "Scheduled",
      notes: "",
      feedback: "",
    });
    setEditingInterviewId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        companyName: formData.companyName.trim(),
        role: formData.role.trim(),
        platform: formData.platform.trim(),
        notes: formData.notes.trim(),
        sourceNotes: formData.sourceNotes.trim(),
        applicationUrl: formData.applicationUrl.trim(),
        appliedDate: formData.appliedDate,
        followUpDate: formData.followUpDate || null,
        interviewCount: Number(formData.interviewCount || 0),
        expectedSalary: formData.expectedSalary.trim(),
        location: formData.location.trim(),
        favorite: Boolean(formData.favorite),
        archived: Boolean(formData.archived),
        companyNotes: formData.companyNotes,
      };

      if (editingId) {
        await updateExternalApplication(editingId, payload);
        toast.success("External application updated");
      } else {
        await createExternalApplication(payload);
        toast.success("External application added");
      }

      await fetchApplications();
      resetForm();
    } catch (err) {
      const message = getErrorMessage(err, "Unable to save external application");
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (application) => {
    setEditingId(application._id);
    setFormData({
      companyName: application.companyName || "",
      role: application.role || "",
      platform: application.platform || "",
      applicationUrl: application.applicationUrl || "",
      appliedDate: application.appliedDate
        ? new Date(application.appliedDate).toISOString().slice(0, 10)
        : "",
      status: application.status || "Applied",
      notes: application.notes || "",
      sourceNotes: application.sourceNotes || "",
      followUpDate: application.followUpDate
        ? new Date(application.followUpDate).toISOString().slice(0, 10)
        : "",
      interviewCount: application.interviewCount || 0,
      priority: application.priority || "Medium",
      expectedSalary: application.expectedSalary || "",
      location: application.location || "",
      favorite: application.favorite || false,
      archived: application.archived || false,
      companyNotes: {
        interviewExperience: application.companyNotes?.interviewExperience || "",
        questionsAsked: application.companyNotes?.questionsAsked || "",
        recruiterInformation: application.companyNotes?.recruiterInformation || "",
        preparationNotes: application.companyNotes?.preparationNotes || "",
        salaryDiscussion: application.companyNotes?.salaryDiscussion || "",
        cultureNotes: application.companyNotes?.cultureNotes || "",
        futureTips: application.companyNotes?.futureTips || "",
      },
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (applicationId) => {
    const confirmed = window.confirm("Delete this external application? This cannot be undone.");
    if (!confirmed) return;

    try {
      setDeletingId(applicationId);
      await deleteExternalApplication(applicationId);
      setApplications((current) =>
        current.filter((application) => application._id !== applicationId)
      );
      toast.success("External application deleted");
    } catch (err) {
      const message = getErrorMessage(err, "Unable to delete external application");
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFavorite = async (application) => {
    try {
      const nextFavorite = !application.favorite;
      const data = await updateExternalApplication(application._id, {
        favorite: nextFavorite,
      });
      setApplications((current) =>
        current.map((item) =>
          item._id === application._id ? data.externalApplication : item
        )
      );
      toast.success(nextFavorite ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to update favorite"));
    }
  };

  const handleToggleArchive = async (application) => {
    const nextArchived = !application.archived;
    const confirmed = window.confirm(
      nextArchived ? "Archive this application?" : "Restore this application?"
    );
    if (!confirmed) return;

    try {
      const data = await updateExternalApplication(application._id, {
        archived: nextArchived,
      });

      if (filterArchived === "false" && nextArchived) {
        setApplications((current) =>
          current.filter((item) => item._id !== application._id)
        );
      } else if (filterArchived === "true" && !nextArchived) {
        setApplications((current) =>
          current.filter((item) => item._id !== application._id)
        );
      } else {
        setApplications((current) =>
          current.map((item) =>
            item._id === application._id ? data.externalApplication : item
          )
        );
      }

      toast.success(nextArchived ? "Application archived" : "Application restored");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to update archive status"));
    }
  };

  const resetFilters = () => {
    setSearchText("");
    setFilterStatus("");
    setFilterPlatform("");
    setFilterFavorite("");
    setFilterArchived("false");
    setFilterPriority("");
    setAppliedFrom("");
    setAppliedTo("");
    setFollowUpFrom("");
    setFollowUpTo("");
    setQuickFilter("");
  };

  const dashboardStats = {
    total: applications.length,
    favorites: applications.filter((application) => application.favorite).length,
    interviews: applications.filter((application) =>
      ["Interview Scheduled", "Interviewing", "HR Round"].includes(application.status)
    ).length,
    archived: applications.filter((application) => application.archived).length,
  };

  const fetchInterviews = async (applicationId) => {
    try {
      const data = await getInterviewRounds(applicationId);
      setInterviewsByApplication((current) => ({
        ...current,
        [applicationId]: data?.interviewRounds || [],
      }));
    } catch (err) {
      const message = getErrorMessage(err, "Unable to load interview rounds");
      toast.error(message);
    }
  };

  const handleOpenInterviews = (application) => {
    setActiveInterviewApplicationId(application._id);
    resetInterviewForm();
    if (!interviewsByApplication[application._id]) {
      fetchInterviews(application._id);
    }
  };

  const handleInterviewSubmit = async (event) => {
    event.preventDefault();

    if (!activeInterviewApplicationId) return;

    try {
      setInterviewSubmitting(true);
      if (editingInterviewId) {
        await updateInterviewRound(editingInterviewId, {
          ...interviewForm,
          roundName: interviewForm.roundName.trim(),
          roundType: interviewForm.roundType.trim(),
          notes: interviewForm.notes.trim(),
          feedback: interviewForm.feedback.trim(),
          meetingLink: interviewForm.meetingLink.trim(),
          interviewer: interviewForm.interviewer.trim(),
        });
        toast.success("Interview round updated");
      } else {
        await createInterviewRound(activeInterviewApplicationId, {
          ...interviewForm,
          roundName: interviewForm.roundName.trim(),
          roundType: interviewForm.roundType.trim(),
          notes: interviewForm.notes.trim(),
          feedback: interviewForm.feedback.trim(),
          meetingLink: interviewForm.meetingLink.trim(),
          interviewer: interviewForm.interviewer.trim(),
        });
        toast.success("Interview round added");
      }

      await fetchInterviews(activeInterviewApplicationId);
      resetInterviewForm();
    } catch (err) {
      const message = getErrorMessage(err, editingInterviewId ? "Unable to update interview round" : "Unable to add interview round");
      toast.error(message);
    } finally {
      setInterviewSubmitting(false);
    }
  };

  const handleEditInterview = (interview) => {
    setEditingInterviewId(interview._id);
    setInterviewForm({
      roundName: interview.roundName || "",
      roundType: interview.roundType || "",
      scheduledAt: interview.scheduledAt
        ? new Date(interview.scheduledAt).toISOString().slice(0, 16)
        : "",
      mode: interview.mode || "Online",
      meetingLink: interview.meetingLink || "",
      interviewer: interview.interviewer || "",
      status: interview.status || "Scheduled",
      notes: interview.notes || "",
      feedback: interview.feedback || "",
    });
  };

  const handleDeleteInterview = async (interviewId, applicationId) => {
    const confirmed = window.confirm("Delete this interview round?");
    if (!confirmed) return;

    try {
      await deleteInterviewRound(interviewId);
      setInterviewsByApplication((current) => ({
        ...current,
        [applicationId]: (current[applicationId] || []).filter((item) => item._id !== interviewId),
      }));
      toast.success("Interview round deleted");
    } catch (err) {
      const message = getErrorMessage(err, "Unable to delete interview round");
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-56 rounded-lg bg-slate-100" />
          <div className="h-4 w-80 rounded bg-slate-100" />
        </div>
        <TableSkeleton rows={6} columns={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load external applications"
        message={error}
        onRetry={fetchApplications}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="External Applications"
        description="Track roles you applied to outside QuickHire and keep everything in one place."
        cta={
          <AppButton
            size="md"
            onClick={() => {
              setIsFormOpen(true);
              setEditingId(null);
              setFormData(initialFormState);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Application
          </AppButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Visible applications", dashboardStats.total],
          ["Favorites", dashboardStats.favorites],
          ["In interview", dashboardStats.interviews],
          ["Archived in view", dashboardStats.archived],
        ].map(([label, value]) => (
          <AppCard key={label} hover={false} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          </AppCard>
        ))}
      </div>

      <AppCard hover={false} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr]">
          <AppInput
            label="Search applications"
            name="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search company, role, platform, notes, salary, recruiter..."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AppSelect
              label="Status"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AppSelect>
            <AppSelect
              label="Platform"
              value={filterPlatform}
              onChange={(event) => setFilterPlatform(event.target.value)}
            >
              <option value="">All platforms</option>
              {platformOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AppSelect>
            <AppSelect
              label="Favorite"
              value={filterFavorite}
              onChange={(event) => setFilterFavorite(event.target.value)}
            >
              <option value="">All</option>
              <option value="true">Favorited</option>
              <option value="false">Not favorited</option>
            </AppSelect>
            <AppSelect
              label="Archived"
              value={filterArchived}
              onChange={(event) => setFilterArchived(event.target.value)}
            >
              <option value="false">Active only</option>
              <option value="true">Archived</option>
              <option value="">All</option>
            </AppSelect>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AppSelect
            label="Priority"
            value={filterPriority}
            onChange={(event) => setFilterPriority(event.target.value)}
          >
            <option value="">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </AppSelect>
          <AppSelect
            label="Quick date"
            value={quickFilter}
            onChange={(event) => setQuickFilter(event.target.value)}
          >
            <option value="">No quick filter</option>
            <option value="today">Applied today</option>
            <option value="tomorrow">Applied tomorrow</option>
            <option value="thisWeek">Applied this week</option>
            <option value="overdue">Overdue follow-ups</option>
          </AppSelect>
          <AppInput
            label="Applied from"
            type="date"
            value={appliedFrom}
            onChange={(event) => setAppliedFrom(event.target.value)}
          />
          <AppInput
            label="Applied to"
            type="date"
            value={appliedTo}
            onChange={(event) => setAppliedTo(event.target.value)}
          />
          <AppInput
            label="Follow-up from"
            type="date"
            value={followUpFrom}
            onChange={(event) => setFollowUpFrom(event.target.value)}
          />
          <AppInput
            label="Follow-up to"
            type="date"
            value={followUpTo}
            onChange={(event) => setFollowUpTo(event.target.value)}
          />
          <div className="flex items-end lg:col-span-2">
            <AppButton type="button" variant="secondary" onClick={resetFilters} fullWidth>
              Reset filters
            </AppButton>
          </div>
        </div>
      </AppCard>

      {isFormOpen && (
        <AppCard hover={false}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {editingId ? "Edit application" : "Add an external application"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Capture the details of a role you applied to through another platform.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <AppInput
                label="Company name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Labs"
                required
              />
              <AppInput
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Product Designer"
                required
              />
              <AppSelect
                label="Platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="">Select platform</option>
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </AppSelect>
              <AppInput
                label="Applied date"
                name="appliedDate"
                type="date"
                value={formData.appliedDate}
                onChange={handleChange}
                required
              />
              <AppSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </AppSelect>
              <AppInput
                label="Application URL"
                name="applicationUrl"
                type="url"
                value={formData.applicationUrl}
                onChange={handleChange}
                placeholder="https://example.com/job"
              />
              <AppInput
                label="Follow-up date"
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
              />
              <AppInput
                label="Interview count"
                name="interviewCount"
                type="number"
                min="0"
                value={formData.interviewCount}
                onChange={handleChange}
              />
              <AppSelect
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </AppSelect>
              <AppInput
                label="Expected salary"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                placeholder="80k"
              />
              <AppInput
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Remote"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <input
                  type="checkbox"
                  name="favorite"
                  checked={formData.favorite}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      favorite: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                Favorite this application
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <input
                  type="checkbox"
                  name="archived"
                  checked={formData.archived}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      archived: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                Archive this application
              </label>
            </div>

            <AppTextarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any context, referral details, or follow-up notes."
            />
            <AppTextarea
              label="Source notes"
              name="sourceNotes"
              value={formData.sourceNotes}
              onChange={handleChange}
              placeholder="Reference details from the source platform."
            />

            <SectionCard title="Company notes" hover={false} className="p-0" actions={null}>
              <div className="grid gap-4">
                <AppTextarea
                  label="Interview experience"
                  name="companyNotes.interviewExperience"
                  value={formData.companyNotes.interviewExperience}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      companyNotes: {
                        ...current.companyNotes,
                        interviewExperience: event.target.value,
                      },
                    }))
                  }
                  placeholder="Capture the candidate experience and impressions."
                />
                <AppTextarea
                  label="Recruiter information"
                  name="companyNotes.recruiterInformation"
                  value={formData.companyNotes.recruiterInformation}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      companyNotes: {
                        ...current.companyNotes,
                        recruiterInformation: event.target.value,
                      },
                    }))
                  }
                  placeholder="Record contact details or recruiter notes."
                />
              </div>
            </SectionCard>

            <div className="flex flex-wrap justify-end gap-3">
              <AppButton type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </AppButton>
              <AppButton type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Save Changes" : "Add Application"}
              </AppButton>
            </div>
          </form>
        </AppCard>
      )}

      {applications.length === 0 ? (
        <EmptyState
          title="No applications match this view"
          message="Adjust your search or filters, or add a new external application."
          hideAction
        />
      ) : (
        <AppTable>
          <AppTableElement>
            <AppTableHead>
              <tr>
                <AppTableHeaderCell>Company</AppTableHeaderCell>
                <AppTableHeaderCell>Role</AppTableHeaderCell>
                <AppTableHeaderCell>Platform</AppTableHeaderCell>
                <AppTableHeaderCell>Applied</AppTableHeaderCell>
                <AppTableHeaderCell>Status</AppTableHeaderCell>
                <AppTableHeaderCell>Actions</AppTableHeaderCell>
              </tr>
            </AppTableHead>
            <AppTableBody>
              {applications.map((application) => (
                <AppTableRow key={application._id}>
                  <AppTableCell className="font-semibold text-slate-900">
                    {application.companyName}
                  </AppTableCell>
                  <AppTableCell>{application.role}</AppTableCell>
                  <AppTableCell>{application.platform}</AppTableCell>
                  <AppTableCell>
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </AppTableCell>
                  <AppTableCell>
                    <StatusBadge status={application.status} />
                  </AppTableCell>
                  <AppTableCell>
                    <div className="flex flex-wrap items-center gap-2">
                          <Link
                        to={`/candidate/external-applications/${application._id}`}
                        className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-brand hover:text-brand"
                        aria-label="View application details"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      {application.applicationUrl && (
                        <a
                          href={application.applicationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-brand hover:text-brand"
                          aria-label="Open application link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(application)}
                        className={`inline-flex items-center rounded-full border p-2 transition ${
                          application.favorite
                            ? "border-amber-200 bg-amber-50 text-amber-600"
                            : "border-slate-200 text-slate-500 hover:border-brand hover:text-brand"
                        }`}
                        aria-label={application.favorite ? "Remove favorite" : "Favorite application"}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleArchive(application)}
                        className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-brand hover:text-brand"
                        aria-label={application.archived ? "Restore application" : "Archive application"}
                      >
                        {application.archived ? (
                          <ArchiveRestore className="h-4 w-4" />
                        ) : (
                          <Archive className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenInterviews(application)}
                        className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-brand hover:text-brand"
                        aria-label="View interviews"
                      >
                        <CalendarDays className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(application)}
                        className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-brand hover:text-brand"
                        aria-label="Edit application"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(application._id)}
                        disabled={deletingId === application._id}
                        className="inline-flex items-center rounded-full border border-red-200 p-2 text-danger transition hover:bg-red-50"
                        aria-label="Delete application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </AppTableCell>
                </AppTableRow>
              ))}
            </AppTableBody>
          </AppTableElement>
        </AppTable>
      )}

      {activeInterviewApplicationId && (
        <AppCard hover={false} className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Interview history</h3>
              <p className="mt-1 text-sm text-slate-500">
                Add and review interview rounds for this application.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveInterviewApplicationId(null)}
              className="text-sm font-medium text-brand"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleInterviewSubmit} className="grid gap-4 md:grid-cols-2">
            <AppInput
              label="Round name"
              name="roundName"
              value={interviewForm.roundName}
              onChange={(event) => setInterviewForm((current) => ({ ...current, roundName: event.target.value }))}
              placeholder="Phone Screen"
              required
            />
            <AppInput
              label="Round type"
              name="roundType"
              value={interviewForm.roundType}
              onChange={(event) => setInterviewForm((current) => ({ ...current, roundType: event.target.value }))}
              placeholder="Technical"
              required
            />
            <AppInput
              label="Date & time"
              name="scheduledAt"
              type="datetime-local"
              value={interviewForm.scheduledAt}
              onChange={(event) => setInterviewForm((current) => ({ ...current, scheduledAt: event.target.value }))}
              required
            />
            <AppSelect
              label="Mode"
              name="mode"
              value={interviewForm.mode}
              onChange={(event) => setInterviewForm((current) => ({ ...current, mode: event.target.value }))}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </AppSelect>
            <AppInput
              label="Meeting link"
              name="meetingLink"
              value={interviewForm.meetingLink}
              onChange={(event) => setInterviewForm((current) => ({ ...current, meetingLink: event.target.value }))}
              placeholder="https://meet.google.com"
            />
            <AppInput
              label="Interviewer"
              name="interviewer"
              value={interviewForm.interviewer}
              onChange={(event) => setInterviewForm((current) => ({ ...current, interviewer: event.target.value }))}
              placeholder="Alex Morgan"
            />
            <AppSelect
              label="Status"
              name="status"
              value={interviewForm.status}
              onChange={(event) => setInterviewForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
            </AppSelect>
            <AppInput
              label="Feedback"
              name="feedback"
              value={interviewForm.feedback}
              onChange={(event) => setInterviewForm((current) => ({ ...current, feedback: event.target.value }))}
              placeholder="Notes from the interviewer"
            />
            <div className="md:col-span-2">
              <AppTextarea
                label="Notes"
                name="notes"
                value={interviewForm.notes}
                onChange={(event) => setInterviewForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Capture any preparation notes or follow-up details."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <AppButton type="button" variant="secondary" onClick={resetInterviewForm}>
                Reset
              </AppButton>
              <AppButton type="submit" disabled={interviewSubmitting}>
                {interviewSubmitting ? "Saving..." : editingInterviewId ? "Save Changes" : "Add interview round"}
              </AppButton>
            </div>
          </form>

          <div className="space-y-3">
            {(interviewsByApplication[activeInterviewApplicationId] || []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500">
                No interview rounds yet for this application.
              </div>
            ) : (
              (interviewsByApplication[activeInterviewApplicationId] || []).map((interview) => (
                <div key={interview._id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{interview.roundName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {interview.roundType} • {new Date(interview.scheduledAt).toLocaleString()}
                      </p>
                      {interview.meetingLink && (
                        <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-medium text-brand">
                          Open meeting link
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">
                        {interview.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEditInterview(interview)}
                        className="rounded-full border border-slate-200 p-2 text-slate-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInterview(interview._id, activeInterviewApplicationId)}
                        className="rounded-full border border-red-200 p-2 text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {(interview.notes || interview.feedback) && (
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      {interview.notes && <p>{interview.notes}</p>}
                      {interview.feedback && <p className="font-medium text-slate-700">Feedback: {interview.feedback}</p>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </AppCard>
      )}
    </div>
  );
};

export default ExternalApplications;
