import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getSingleJob,
} from "../../api/jobApi";
import {
  applyToJob,
} from "../../api/applicationApi";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useAuth } from "../../context/AuthContext";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  ArrowLeft,
} from "lucide-react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] =
    useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getSingleJob(id);

        setJob(data.job);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load job"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user || user.role !== "candidate") {
      toast.error(
        "Only candidates can apply. Please login as a candidate."
      );
      navigate("/login");
      return;
    }

    try {
      setApplying(true);

      const data =
        await applyToJob(id);

      toast.success(
        data.message ||
          "Applied successfully!"
      );

      navigate(
        "/candidate/applications"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to apply for job"
      );
    } finally {
      setApplying(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Loader message="Loading job details..." />
    );
  }

  if (error || !job) {
    return (
      <ErrorState
        title="Job not found"
        message={
          error ||
          "This job posting may have been removed."
        }
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
              <Building2 className="w-5 h-5" />
              <span>{job.company}</span>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8 pb-8 border-b">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Location
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">
                  {job.location}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Job Type
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">
                  {job.jobType}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Salary
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">
                  {job.salary}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Posted
              </p>
              <span className="font-medium text-gray-700">
                {new Date(
                  job.createdAt
                ).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Apply Button */}
          {user?.role === "candidate" && (
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {applying ? "Applying..." : "Apply Now"}
            </button>
          )}

          {!token && (
            <button
              onClick={() =>
                navigate("/login")
              }
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Login to Apply
            </button>
          )}

          {user?.role === "recruiter" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-center">
                Recruiters cannot apply to jobs
              </p>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            About this job
          </h2>

          <div className="prose prose-sm max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements &&
            job.requirements.length >
              0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Requirements
                </h3>

                <ul className="space-y-3">
                  {Array.isArray(
                    job.requirements
                  )
                    ? job.requirements.map(
                        (req, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <span className="w-2 h-2 bg-black rounded-full mt-2 shrink-0" />
                            <span>
                              {req}
                            </span>
                          </li>
                        )
                      )
                    : null}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;