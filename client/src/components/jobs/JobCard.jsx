import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-semibold">
        {job.title}
      </h2>

      <p>{job.company}</p>

      <p>{job.location}</p>

      <p>{job.jobType}</p>

      <Link to={`/jobs/${job._id}`}>
        View Details
      </Link>
    </div>
  );
};

export default JobCard;