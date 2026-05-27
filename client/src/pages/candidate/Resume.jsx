import { useState } from "react";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import { uploadResume } from "../../api/applicationApi";

import {
  Upload,
  FileText,
  CheckCircle2,
} from "lucide-react";

const Resume = () => {
  const { user } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const validateFile = (file) => {
    if (!file) {
      return "Please select a file";
    }

    const isPDF =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPDF) {
      return "Only PDF files are allowed";
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleFileUpload =
    async (e) => {
      const file =
        e.target.files?.[0];

      const validationError =
        validateFile(file);

      if (validationError) {
        toast.error(
          validationError
        );
        return;
      }

      try {
        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          file
        );

        await uploadResume(formData);

        toast.success(
          "Resume uploaded successfully"
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to upload resume"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          My Resume
        </h1>

        <p className="text-gray-600">
          Upload and manage your resume for
          job applications
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-black transition">
          <div className="flex justify-center mb-5">
            <div className="bg-gray-100 p-4 rounded-full">
              <Upload className="w-10 h-10 text-gray-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Upload Resume
          </h2>

          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upload your latest resume in PDF
            format to apply for jobs faster and
            improve your recruiter visibility.
          </p>

          <input
            type="file"
            accept=".pdf"
            id="resume-upload"
            className="hidden"
            disabled={loading}
            onChange={
              handleFileUpload
            }
          />

          <label
            htmlFor="resume-upload"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:opacity-90 transition"
          >
            <Upload className="w-5 h-5" />

            {loading
              ? "Uploading..."
              : "Select PDF"}
          </label>

          <p className="text-xs text-gray-500 mt-4">
            Only PDF files are supported
            (Maximum size: 5MB)
          </p>
        </div>
      </div>

      {/* Resume Preview */}
      {user?.resume ? (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-500" />

            <h2 className="text-2xl font-bold">
              Current Resume
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border bg-gray-50">
            <div className="bg-white p-3 rounded-lg border">
              <FileText className="w-8 h-8 text-gray-700" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                Resume.pdf
              </p>

              <p className="text-sm text-gray-600">
                Resume uploaded successfully to
                your profile
              </p>
            </div>

            <a
              href={user.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
            >
              View Resume
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-blue-600 mt-1" />

            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                No Resume Uploaded
              </h3>

              <p className="text-blue-700 text-sm leading-relaxed">
                Uploading your resume increases
                your chances of getting noticed
                by recruiters and helps you apply
                to jobs more efficiently.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;