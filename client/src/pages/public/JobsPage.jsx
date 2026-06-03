import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import { getAllJobs } from "../../api/jobApi";

import JobCard from "../../components/jobs/JobCard";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import JobCardSkeleton from "../../components/skeletons/JobCardSkeleton";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorMessage";

const JobsPage = () => {
  // ===============================
  // URL SEARCH PARAMS
  // ===============================

  const [searchParams, setSearchParams] =
    useSearchParams();

  // ===============================
  // FILTER STATES
  // ===============================

  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") || ""
  );

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  const [jobType, setJobType] = useState(
    searchParams.get("jobType") || ""
  );

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // ===============================
  // DATA STATES
  // ===============================

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [totalPages, setTotalPages] = useState(1);

  // ===============================
  // FETCH JOBS
  // ===============================

  const fetchJobs = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await getAllJobs({
        keyword,
        location,
        jobType,
        page,
        limit: 10,
      });

      setJobs(data.jobs);

      setTotalPages(data.totalPages);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to fetch jobs");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FETCH ON FILTER CHANGE
  // ===============================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, location, jobType, page]);

  // ===============================
  // URL QUERY SYNC
  // ===============================

  useEffect(() => {
    setSearchParams({
      keyword,
      location,
      jobType,
      page,
    });
  }, [keyword, location, jobType, page]);

  // ===============================
  // PAGINATION HANDLER
  // ===============================

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // RETRY HANDLER
  // ===============================

  const handleRetry = () => {
    fetchJobs();
  };

  // ===============================
  // INITIAL LOADER
  // ===============================

  if (loading && jobs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Find Your Next Opportunity
        </h1>

        <p className="text-gray-600">
          Discover professional opportunities with
          QuickHire AI
        </p>
      </div>

      {/* ========================= */}
      {/* SEARCH + FILTERS */}
      {/* ========================= */}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
        <div className="grid gap-4 md:grid-cols-3">

          {/* Keyword Search */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Search Jobs
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Job title or company..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Location Filter */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Location
            </label>

            <input
              type="text"
              placeholder="City or region..."
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Job Type Filter */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Job Type
            </label>

            <select
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">
                All Types
              </option>

              <option value="Remote">
                Remote
              </option>

              <option value="Hybrid">
                Hybrid
              </option>

              <option value="Onsite">
                Onsite
              </option>

              <option value="Internship">
                Internship
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* ERROR STATE */}
      {/* ========================= */}

      {error && !loading && (
        <ErrorState
          title="Failed to load jobs"
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* ========================= */}
      {/* JOBS GRID */}
      {/* ========================= */}

      {!error && jobs.length > 0 && (
        <div className="grid gap-6 mb-8">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
            />
          ))}
        </div>
      )}

      {/* ========================= */}
      {/* EMPTY STATE */}
      {/* ========================= */}

      {!error &&
        !loading &&
        jobs.length === 0 && (
          <EmptyState
            title="No jobs found"
            message="Try adjusting your filters or search keywords"
          />
        )}

      {/* ========================= */}
      {/* PAGINATION */}
      {/* ========================= */}

      {!error && jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default JobsPage;