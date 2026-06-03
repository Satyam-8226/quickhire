import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getMyApplications } from "../../api/applicationApi";
import { getErrorMessage } from "../../utils/errorMessage";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/ui/PageHeader";
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

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyApplications();
      setApplications(data?.applications || []);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to fetch applications");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading applications..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load applications"
        message={error}
        onRetry={fetchApplications}
      />
    );
  }

  if (applications.length === 0) {
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="My Applications"
          description="Track the status of all your job applications"
        />
        <EmptyState
          title="No applications yet"
          message="You haven't applied to any jobs yet. Start exploring available opportunities."
          buttonText="Browse Jobs"
          buttonLink="/jobs"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="My Applications"
        description="Track the status of all your job applications"
      />

      <AppTable>
        <AppTableElement>
          <AppTableHead>
            <tr>
              <AppTableHeaderCell>Company</AppTableHeaderCell>
              <AppTableHeaderCell>Role</AppTableHeaderCell>
              <AppTableHeaderCell>Location</AppTableHeaderCell>
              <AppTableHeaderCell>Applied</AppTableHeaderCell>
              <AppTableHeaderCell>Status</AppTableHeaderCell>
            </tr>
          </AppTableHead>
          <AppTableBody>
            {applications.map((application) => (
              <AppTableRow key={application._id}>
                <AppTableCell className="font-semibold text-slate-900">
                  {application.job?.company || "Unknown Company"}
                </AppTableCell>
                <AppTableCell>
                  {application.job?.title || "Untitled Job"}
                </AppTableCell>
                <AppTableCell>
                  {application.job?.location || "N/A"}
                </AppTableCell>
                <AppTableCell>
                  {new Date(application.createdAt).toLocaleDateString()}
                </AppTableCell>
                <AppTableCell>
                  <StatusBadge status={application.status} />
                </AppTableCell>
              </AppTableRow>
            ))}
          </AppTableBody>
        </AppTableElement>
      </AppTable>
    </div>
  );
};

export default Applications;
