import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import { getAllJobs } from "../../api/jobApi";
import JobCard from "../../components/jobs/JobCard";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { JobsPageSkeleton } from "../../components/skeletons/JobCardSkeleton";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorMessage";
import AppCard from "../../components/ui/AppCard";
import AppInput from "../../components/ui/AppInput";
import AppSelect from "../../components/ui/AppSelect";
import { inputClassName } from "../../components/ui/AppInput";
import { cn } from "../../utils/cn";

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, location, jobType, page]);

  useEffect(() => {
    setSearchParams({
      keyword,
      location,
      jobType,
      page,
    });
  }, [keyword, location, jobType, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && jobs.length === 0) {
    return <JobsPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
          Open roles
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Find your next opportunity
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          Discover professional opportunities curated for your career goals.
        </p>
      </header>

      <AppCard hover={false} className="mb-6 !p-5">
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Title or company..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                className={cn(inputClassName, "h-11 pl-10 text-sm")}
              />
            </div>
          </div>

          <AppInput
            label="Location"
            type="text"
            placeholder="City or region..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            className="h-11 text-sm"
          />

          <AppSelect
            label="Job type"
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
              setPage(1);
            }}
            className="h-11 text-sm"
          >
            <option value="">All types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </AppSelect>
        </div>
      </AppCard>

      {error && !loading && (
        <ErrorState
          title="Failed to load jobs"
          message={error}
          onRetry={fetchJobs}
        />
      )}

      {!error && jobs.length > 0 && (
        <>
          <p className="mb-4 text-xs font-medium text-slate-400">
            {jobs.length} role{jobs.length !== 1 ? "s" : ""} on this page
          </p>
          <div className="mb-8 grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} variant="browse" />
            ))}
          </div>
        </>
      )}

      {!error && !loading && jobs.length === 0 && (
        <EmptyState
          title="No matching jobs found"
          message="Try adjusting your search filters or check back later."
          hideAction={!keyword && !location && !jobType}
        />
      )}

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
