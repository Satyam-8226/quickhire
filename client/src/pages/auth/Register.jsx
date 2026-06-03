import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";
import { showErrorToast } from "../../utils/errorMessage";
import AppCard from "../../components/ui/AppCard";
import AppInput from "../../components/ui/AppInput";
import AppSelect from "../../components/ui/AppSelect";
import AppButton from "../../components/ui/AppButton";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/register", formData);

      toast.success("Registration successful. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      showErrorToast(error, "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white">
            Q
          </span>
          <h1 className="text-4xl font-bold text-slate-900">Join QuickHire</h1>
          <p className="mt-3 text-sm text-slate-500">
            Create your account to get started
          </p>
        </div>

        <AppCard hover={false} className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AppInput
              label="Full Name"
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <AppInput
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <AppInput
              label="Password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <AppSelect
              label="I am a..."
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="candidate">Candidate (Job Seeker)</option>
              <option value="recruiter">Recruiter (Hiring)</option>
            </AppSelect>

            <AppButton type="submit" disabled={loading} fullWidth>
              {loading ? "Creating account..." : "Create account"}
            </AppButton>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand hover:text-brand-hover"
            >
              Sign in
            </Link>
          </p>
        </AppCard>
      </div>
    </div>
  );
}

export default Register;
