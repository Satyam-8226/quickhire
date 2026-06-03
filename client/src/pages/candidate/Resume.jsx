import { useState } from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { uploadResume } from "../../api/applicationApi";

import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";

import {
  Upload,
  FileText,
} from "lucide-react";

const Resume = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState(0);
  const resumeUrl = user?.currentResume?.resumeUrl || user?.resume || "";

  const handleViewResume = () => {
    console.log("Resume URL for View Resume:", {
      resumeUrl,
      currentResume: user?.currentResume,
      legacyResume: user?.resume,
    });

    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
      return;
    }

    toast.error("No resume available");
  };

  const validateFile = (file) => {
    if (!file) {
      return "Please select a file.";
    }

    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      return "Only PDF files are allowed.";
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 5MB.";
    }

    return null;
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

      console.log("Resume upload response:", response, {
        updatedResumeUrl,
        version,
      });

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
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Resume Center"
        description="Keep your resume up to date so recruiters always see your latest profile and you can apply with confidence."
        cta={
          <Link
            to="/candidate/applications"
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
          >
            View Applications
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Upload Resume"
          subtitle="Upload your latest resume in PDF format to keep your profile recruiter-ready."
        >
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center transition hover:border-black">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm">
              <Upload className="h-10 w-10" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-3">
              Select your latest resume
            </p>
            <p className="mx-auto max-w-md text-sm text-gray-600 mb-6">
              PDF only, up to 5MB. Your upload will update the resume attached to all new applications.
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
              className="inline-flex items-center justify-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              {loading ? "Uploading..." : "Choose PDF"}
            </label>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => document.getElementById('resume-upload').click()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Upload Resume
              </button>
              {loading && (
                <div className="text-sm text-gray-600">Uploading... Please wait.</div>
              )}
            </div>

            {selectedFileName && (
              <p className="mt-4 text-sm text-gray-600">
                Selected file: <span className="font-medium text-gray-900">{selectedFileName}</span>
                <br />
                Size: <span className="font-medium text-gray-900">{selectedFileSize > 0 ? `${(selectedFileSize / 1024 / 1024).toFixed(2)} MB` : ''}</span>
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Current resume"
          subtitle="Your uploaded resume is visible to recruiters for future applications."
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-black text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resume status</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {resumeUrl ? "Uploaded" : "No resume uploaded"}
                  </p>
                </div>
              </div>
              <StatusBadge status={resumeUrl ? "accepted" : "pending"} />
            </div>

            {resumeUrl ? (
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Last resume</p>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {selectedFileName || "Resume.pdf"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleViewResume}
                    className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
                  >
                    View resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-900">No resume uploaded yet</p>
                <p className="mt-2 text-sm text-blue-700">
                  Upload a PDF to get your profile ready for recruiters and improve your application flow.
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Resume;