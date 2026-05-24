import { useEffect, useState } from "react";
import { getAllJobs } from "../../api/jobApi";
import JobCard from "../../components/jobs/JobCard";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const data = await getAllJobs();

        setJobs(data.jobs);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <h2>Loading jobs...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Available Jobs
      </h1>

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
          />
        ))
      )}
    </div>
  );
};

export default JobsPage;