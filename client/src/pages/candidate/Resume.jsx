import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Upload, FileText } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  activateResume,
  getMyResumes,
  uploadResume,
} from "../../api/applicationApi";
import { getErrorMessage, showErrorToast } from "../../utils/errorMessage";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import AppButton, { AppButtonLink, buttonClassName } from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";

const Resume = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState(0);
  const [resumeHistory, setResumeHistory] = useState([]);
  const resumeUrl = user?.currentResume?.resumeUrl || user?.resume || "";

  useEffect(() => {
    const loadResumeHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await getMyResumes();
        setResumeHistory(response?.history || []);
      } catch (error) {
        showErrorToast(error, "Failed to load resume history");
      } finally {
        setHistoryLoading(false);
      }
    };

    if (user) {
      loadResumeHistory();
    }
  }, [user]);

  const handleViewResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
      return;
    }
    toast.error("No resume available");
  };

  const validateFile = (file) => {
    if (!file) return "Please select a file.";
    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPDF) return "Only PDF files are allowed.";
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB.";
    }
    return null;
  };

  const handleActivateResume = async (versionId) => {
    try {
      const response = await activateResume(versionId);
      const activatedResume = response?.current || null;

      if (!activatedResume?.resumeUrl) {
        throw new Error("Resume activation did not return a valid URL.");
      }

      const updatedHistory = resumeHistory.map((item) => ({
        ...item,
        active:
          item.id === versionId ||
          item._id === versionId ||
          item.version === activatedResume.version,
      }));

      const updatedUser = {
        ...user,
        resume: activatedResume.resumeUrl,
        currentResume: activatedResume,
        resumeHistory: updatedHistory,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setResumeHistory(updatedHistory);
      toast.success("Resume version activated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to activate resume version."));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    const validationError = validateFile(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const response = await uploadResume(formData);
      const updatedResumeUrl = response?.resumeUrl || "";
      const version = response?.version ?? user?.currentResume?.version ?? 1;

      if (!updatedResumeUrl) {
        throw new Error("Resume upload did not return a valid URL.");
      }

      const updatedUser = {
        ...user,
        resume: updatedResumeUrl,
        currentResume: {
          version,
          fileName: file.name,
          resumeUrl: updatedResumeUrl,
          publicId: user?.currentResume?.publicId || "",
          uploadedAt: new Date().toISOString(),
          active: true,
        },
        resumeHistory: Array.isArray(user?.resumeHistory)
          ? [
              ...user.resumeHistory,
              {
                version,
                fileName: file.name,
                resumeUrl: updatedResumeUrl,
                publicId: user?.currentResume?.publicId || "",
                uploadedAt: new Date().toISOString(),
                active: true,
              },
            ]
          : [
              {
                version,
                fileName: file.name,
                resumeUrl: updatedResumeUrl,
                publicId: user?.currentResume?.publicId || "",
                uploadedAt: new Date().toISOString(),
                active: true,
              },
            ],
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Resume uploaded successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to upload resume."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Resume Center"
        description="Keep your resume up to date so recruiters always see your latest profile and you can apply with confidence."
        cta={
          <AppButtonLink to="/candidate/applications" size="md">
            View Applications
          </AppButtonLink>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Upload Resume"
          subtitle="Upload your latest resume in PDF format to keep your profile recruiter-ready."
          hover={false}
        >
          <AppCard
            hover={false}
            className="border-dashed bg-brand-light/30 text-center !p-10"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-brand shadow-sm">
              <Upload className="h-10 w-10" />
            </div>
            <p className="text-lg font-semibold text-slate-900 mb-3">
              Select your latest resume
            </p>
            <p className="mx-auto mb-6 max-w-md text-sm text-slate-500">
              PDF only, up to 5MB. Your upload will update the resume attached
              to all new applications.
            </p>

            <input
              type="file"
              accept=".pdf"
              id="resume-upload"
              className="hidden"
              disabled={loading}
              onChange={handleFileUpload}
            />
            <label
              htmlFor="resume-upload"
              className={`${buttonClassName()} cursor-pointer ${loading ? "pointer-events-none opacity-50" : ""}`}
            >
              {loading ? "Uploading..." : "Choose PDF"}
            </label>

            {selectedFileName && (
              <p className="mt-4 text-sm text-slate-500">
                Selected:{" "}
                <span className="font-medium text-slate-900">
                  {selectedFileName}
                </span>
                {selectedFileSize > 0 && (
                  <>
                    {" "}
                    · {(selectedFileSize / 1024 / 1024).toFixed(2)} MB
                  </>
                )}
              </p>
            )}
          </AppCard>
        </SectionCard>

        <SectionCard
          title="Current resume"
          subtitle="Your uploaded resume is visible to recruiters for future applications."
          hover={false}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Resume status</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {resumeUrl ? "Uploaded" : "No resume uploaded"}
                  </p>
                </div>
              </div>
              <StatusBadge status={resumeUrl ? "accepted" : "pending"} />
            </div>

            {resumeUrl ? (
              <AppCard hover={false} className="!p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Last resume</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {selectedFileName || "Resume.pdf"}
                    </p>
                  </div>
                  <AppButton
                    type="button"
                    size="md"
                    onClick={handleViewResume}
                  >
                    View resume
                  </AppButton>
                </div>
              </AppCard>
            ) : (
              <div className="rounded-2xl border border-brand/20 bg-brand-light p-5">
                <p className="text-sm font-semibold text-brand">
                  No resume uploaded yet
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Upload a PDF to get your profile ready for recruiters.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-900">
                Resume versions
              </p>
              {historyLoading && (
                <p className="text-sm text-slate-500">Loading...</p>
              )}
              {resumeHistory.length === 0 && !historyLoading ? (
                <p className="text-sm text-slate-500">
                  No previous versions yet.
                </p>
              ) : (
                resumeHistory.map((item) => (
                  <AppCard
                    key={item.id || item._id || item.version}
                    hover={false}
                    className="!p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Version {item.version}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.fileName || "Resume.pdf"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Uploaded{" "}
                          {new Date(item.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          status={item.active ? "accepted" : "pending"}
                        />
                        {!item.active && (
                          <AppButton
                            type="button"
                            size="md"
                            onClick={() =>
                              handleActivateResume(item.id || item._id)
                            }
                          >
                            Set Active
                          </AppButton>
                        )}
                      </div>
                    </div>
                  </AppCard>
                ))
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Resume;
