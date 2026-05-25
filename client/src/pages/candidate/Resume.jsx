import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Upload, FileText } from "lucide-react";

function Resume() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    const isPDF = file.type === "application/pdf" || 
                  file.name.toLowerCase().endsWith(".pdf");
    
    if (!isPDF) {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      // TODO: Implement actual upload API call
      // const response = await uploadResume(formData);

      toast.success("Resume uploaded successfully");
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to upload resume"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          My Resume
        </h1>
        <p className="text-gray-600">
          Upload and manage your resume for job applications
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-black transition">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

          <h3 className="text-xl font-semibold mb-2">
            Upload Your Resume
          </h3>

          <p className="text-gray-600 mb-6">
            Drag and drop your PDF file here, or click to select
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={loading}
            className="hidden"
            id="resume-upload"
          />

          <label
            htmlFor="resume-upload"
            className="inline-block bg-black text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading
              ? "Uploading..."
              : "Select PDF"}
          </label>

          <p className="text-xs text-gray-500 mt-4">
            PDF files up to 5MB
          </p>
        </div>
      </div>

      {/* Current Resume Info */}
      {user?.resume && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold mb-4">
            Current Resume
          </h2>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <FileText className="w-8 h-8 text-gray-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                Resume.pdf
              </p>
              <p className="text-sm text-gray-600">
                Uploaded to your profile
              </p>
            </div>
            <a
              href={user.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black font-medium hover:underline"
            >
              View
            </a>
          </div>
        </div>
      )}

      {!user?.resume && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-700">
            You haven't uploaded a resume yet. Upload one to increase your chances of getting hired!
          </p>
        </div>
      )}
    </div>
  );
}

export default Resume;