import { useEffect, useMemo, useState } from "react"

import { Link } from "react-router-dom"

import { useAuth } from "../../context/AuthContext"
import { getMyApplications } from "../../api/applicationApi"

import Loader from "../../components/common/Loader"
import ErrorState from "../../components/common/ErrorState"
import EmptyState from "../../components/ui/EmptyState"
import PageHeader from "../../components/ui/PageHeader"
import SectionCard from "../../components/ui/SectionCard"
import StatCard from "../../components/ui/StatCard"
import StatusBadge from "../../components/ui/StatusBadge"

import {
  ClipboardList,
  Briefcase,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

const CandidateDashboard = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getMyApplications()
      setApplications(data?.applications || [])
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load your dashboard data"
      )
    } finally {
      setLoading(false)
    }
  }

  const applicationCounts = useMemo(
    () =>
      applications.reduce(
        (counts, application) => {
          const key = application.status || "pending"
          counts[key] = (counts[key] || 0) + 1
          return counts
        },
        {
          pending: 0,
          reviewed: 0,
          accepted: 0,
          rejected: 0,
        }
      ),
    [applications]
  )

  const recentApplications = useMemo(
    () => applications.slice(0, 5),
    [applications]
  )

  if (loading) {
    return <Loader message="Loading dashboard..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard error"
        message={error}
        onRetry={fetchApplications}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Candidate Dashboard"
        description="Track applications, review hiring updates, and stay ahead with an easy view of your job search progress."
        cta={
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
          >
            Browse Jobs
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total applications"
              value={applications.length}
              icon={<ClipboardList className="w-5 h-5" />}
              description="Applications sent so far"
            />
            <StatCard
              title="Pending review"
              value={applicationCounts.pending}
              icon={<FileText className="w-5 h-5" />}
              description="Waiting on recruiter feedback"
            />
            <StatCard
              title="Accepted offers"
              value={applicationCounts.accepted}
              icon={<CheckCircle2 className="w-5 h-5" />}
              description="Offers you received"
            />
            <StatCard
              title="Resume status"
              value={user?.resume ? "Uploaded" : "Missing"}
              icon={<Sparkles className="w-5 h-5" />}
              description={
                user?.resume
                  ? "Ready for applications"
                  : "Upload a resume"
              }
            />
          </div>

          <SectionCard
            title="Recent applications"
            subtitle="See your latest activity and application progress."
            actions={
              <Link
                to="/candidate/applications"
                className="text-sm font-semibold text-black transition hover:text-gray-700"
              >
                View all
              </Link>
            }
          >
            {recentApplications.length === 0 ? (
              <EmptyState
                title="No applications yet"
                message="You haven't applied to any jobs yet. Start browsing openings and submit your first application."
              />
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="rounded-3xl border border-gray-200 p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.job?.title || "Untitled Job"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {application.job?.company || "Unknown Company"}
                        </p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                      <p>
                        Applied on {" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                      <p>{application.job?.location || "Location not specified"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Profile summary"
            subtitle={`Welcome back, ${user?.name?.split(" ")[0] || "candidate"}!`}
          >
            <div className="space-y-4">
              <div className="rounded-3xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Account</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {user?.name || "Candidate"}
                </p>
                <p className="text-sm text-gray-500">{user?.email || "No email available"}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  to="/candidate/resume"
                  className="inline-flex items-center justify-center rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:border-gray-300"
                >
                  Manage resume
                </Link>
                <Link
                  to="/candidate/applications"
                  className="inline-flex items-center justify-center rounded-3xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
                >
                  View applications
                </Link>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Getting started"
            subtitle="Quick actions to keep your profile active."
          >
            <div className="space-y-4">
              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                      Latest update
                    </p>
                    <p className="mt-2 text-base text-gray-800">
                      {user?.resume ? "Your resume is ready for applications." : "Upload your resume to increase visibility."}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {user?.resume ? "Active" : "Action needed"}
                  </span>
                </div>
              </div>

              <Link
                to="/jobs"
                className="block rounded-3xl bg-black px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-gray-900"
              >
                Explore new jobs
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard;