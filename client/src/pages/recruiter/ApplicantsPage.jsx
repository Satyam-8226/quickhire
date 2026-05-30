import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getJobApplicants,
  updateApplicationStatus,
} from "../../api/applicationApi";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import toast from "react-hot-toast";

import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Mail,
  User,
  Download,
  Eye,
  AlertTriangle,
} from "lucide-react";

import ApplicantSkeleton from "../../components/skeletons/ApplicationSkeleton";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "reviewed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "accepted":
      return <CheckCircle2 className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    case "reviewed":
      return <FileText className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ApplicantsPage = () => {
  const { id } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getJobApplicants(id);
      setApplications(data.applications || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    const current = applications.find(
      (app) => app._id === applicationId
    )?.status;

    if (!status || status === current) {
      return;
    }

    try {
      setStatusUpdating((prev) => ({
        ...prev,
        [applicationId]: true,
      }));

      await updateApplicationStatus(applicationId, status);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status }
            : app
        )
      );

      if (
        selectedApplication &&
        selectedApplication._id === applicationId
      ) {
        setSelectedApplication({
          ...selectedApplication,
          status,
        });
      }

      toast.success("Application status updated");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to update status"
      );
    } finally {
      setStatusUpdating((prev) => ({
        ...prev,
        [applicationId]: false,
      }));
    }
  };

  const openDetails = (application) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  const closeDetails = () => {
    setIsDetailOpen(false);
    setSelectedApplication(null);
  };

  const handleRetry = () => {
    fetchApplicants();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ApplicantSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load applicants"
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applicants yet"
        message="No one has applied to this job posting yet"
      />
    );
  }

  const jobTitle = applications[0]?.job?.title || "Job Applicants";
  const jobCompany = applications[0]?.job?.company || "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              Applicant Review
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
              {jobTitle}
            </h1>
            {jobCompany && (
              <p className="text-gray-600">{jobCompany}</p>
            )}
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
            {applications.length} applicant{applications.length !== 1 ? "s" : ""}
          </div>
        </div>
        <p className="max-w-2xl text-sm text-gray-600">
          Review candidate profiles, open resumes, and update application status with a recruiter-grade workflow.
        </p>
      </div>

      <div className="space-y-6">
        {applications.map((application) => {
          const resumeUrl =
            application.applicant?.currentResume?.resumeUrl ||
            application.applicant?.resume ||
            application.resume ||
            "";

          return (
            <article
              key={application._id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-200 bg-slate-50 px-6 py-5 sm:px-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
                      <User className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {application.applicant?.name || "Unnamed Candidate"}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <span>{application.applicant?.email || "No email"}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>Applied {formatDate(application.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${getStatusBadge(
                        application.status
                      )}`}
                    >
                      {getStatusIcon(application.status)}
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                      Applied {formatDate(application.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 sm:px-8">
                <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                  <div className="space-y-5">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                            Candidate Profile
                          </p>
                          <p className="mt-2 text-base font-medium text-slate-900">
                            {application.applicant?.name || "Unknown Candidate"}
                          </p>
                        </div>
                        <span className="text-sm text-slate-500">
                          Joined {formatDate(application.applicant?.createdAt)}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="mt-2 font-medium text-slate-900">
                            {application.applicant?.email || "No email provided"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <p className="text-sm text-slate-500">Job</p>
                          <p className="mt-2 font-medium text-slate-900">
                            {application.job?.title || "Unknown role"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {application.job?.company || "Unknown company"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-500">Resume Status</p>
                            <p className="mt-2 text-base font-medium text-slate-900">
                              {resumeUrl ? "Resume Available" : "No Resume Uploaded"}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                            {resumeUrl ? "Ready" : "Missing"}
                          </span>
                        </div>
                        {!resumeUrl && (
                          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-yellow-50 p-3 text-sm text-yellow-700">
                            <AlertTriangle className="h-4 w-4" />
                            Candidate does not have a resume link available.
                          </div>
                        )}
                      </div>

                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-sm font-semibold text-slate-500">Application Details</p>
                        <div className="mt-4 space-y-3 text-sm text-slate-700">
                          <div>
                            <p className="font-medium text-slate-900">Applied On</p>
                            <p>{formatDate(application.createdAt)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Current Status</p>
                            <p className="mt-1 capitalize">{application.status}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Cover Letter</p>
                            <p>{application.coverLetter ? "Provided" : "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                            Resume Actions
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            Open or download the candidate resume in a new tab.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <a
                          href={resumeUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            resumeUrl
                              ? "bg-black text-white hover:bg-slate-900"
                              : "cursor-not-allowed bg-slate-300 text-slate-600"
                          }`}
                          onClick={(e) => {
                            if (!resumeUrl) e.preventDefault();
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View Resume
                        </a>
                        <a
                          href={resumeUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 ${
                            resumeUrl
                              ? ""
                              : "cursor-not-allowed opacity-60"
                          }`}
                          onClick={(e) => {
                            if (!resumeUrl) e.preventDefault();
                          }}
                        >
                          <Download className="h-4 w-4" />
                          Download Resume
                        </a>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Update Status
                      </p>
                      <label className="block text-sm font-medium text-slate-700">
                        Review outcome
                      </label>
                      <select
                        value={application.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            application._id,
                            e.target.value
                          )
                        }
                        disabled={statusUpdating[application._id]}
                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => openDetails(application)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black transition"
                      >
                        <FileText className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {isDetailOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Candidate details
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedApplication.applicant?.name || "Candidate Profile"}
                </h2>
              </div>
              <button
                onClick={closeDetails}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Candidate Information
                  </p>
                  <div className="space-y-3 text-slate-700">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {selectedApplication.applicant?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {selectedApplication.applicant?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Account Created</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatDate(selectedApplication.applicant?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Application Overview
                  </p>
                  <div className="space-y-3 text-slate-700">
                    <div>
                      <p className="text-sm text-slate-500">Applied On</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatDate(selectedApplication.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p className="mt-1 font-medium text-slate-900 capitalize">
                        {selectedApplication.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Job</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {selectedApplication.job?.title || "N/A"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedApplication.job?.company || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Resume details
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Access the candidate's resume directly from the application record.
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(
                      selectedApplication.applicant?.currentResume?.resumeUrl || selectedApplication.applicant?.resume || selectedApplication.resume
                        ? "accepted"
                        : "pending"
                    )}`}
                  >
                    {selectedApplication.applicant?.currentResume?.resumeUrl || selectedApplication.applicant?.resume || selectedApplication.resume
                      ? "Resume available"
                      : "No resume uploaded"}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <a
                    href={
                      selectedApplication.applicant?.currentResume?.resumeUrl ||
                      selectedApplication.applicant?.resume ||
                      selectedApplication.resume ||
                      "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black ${
                      selectedApplication.applicant?.currentResume?.resumeUrl || selectedApplication.applicant?.resume || selectedApplication.resume
                        ? ""
                        : "cursor-not-allowed opacity-60"
                    }`}
                    onClick={(e) => {
                      if (!selectedApplication.applicant?.currentResume?.resumeUrl && !selectedApplication.applicant?.resume && !selectedApplication.resume) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    Open Resume
                  </a>
                  <a
                    href={
                      selectedApplication.applicant?.currentResume?.resumeUrl ||
                      selectedApplication.applicant?.resume ||
                      selectedApplication.resume ||
                      "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 ${
                      selectedApplication.applicant?.currentResume?.resumeUrl || selectedApplication.applicant?.resume || selectedApplication.resume
                        ? ""
                        : "cursor-not-allowed opacity-60"
                    }`}
                    onClick={(e) => {
                      if (!selectedApplication.applicant?.currentResume?.resumeUrl && !selectedApplication.applicant?.resume && !selectedApplication.resume) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Cover letter
                </p>
                <p className="mt-4 rounded-3xl bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm">
                  {selectedApplication.coverLetter || "This candidate did not submit a cover letter."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
