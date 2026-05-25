import { useEffect, useState } from "react";
import { getAllJobs } from "../../api/jobApi";
import JobCard from "../../components/jobs/JobCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { Search } from "lucide-react";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllJobs({
        page,
        limit: 10,
        keyword: searchTerm,
        location,
      });

      setJobs(data.jobs);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchJobs(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, location]);

  const handlePageChange = (page) => {
    fetchJobs(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    fetchJobs(currentPage);
  };

  if (loading && jobs.length === 0) {
    return <Loader message="Finding great jobs..." />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Find Your Next Opportunity
        </h1>
        <p className="text-gray-600">
          Discover {totalPages > 0 ? "hundreds of" : "great"} job openings
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Jobs
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title, skills..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
                placeholder="City, region..."
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <ErrorState
          title="Failed to load jobs"
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* Jobs Grid */}
      {!error && jobs.length > 0 && (
        <div className="grid gap-6 mb-8">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!error && !loading && jobs.length === 0 && (
        <EmptyState
          title="No jobs found"
          message="Try adjusting your search filters or check back later"
        />
      )}

      {/* Pagination */}
      {!error && jobs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default JobsPage;