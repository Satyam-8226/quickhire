import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../../api/axios";

import { useAuth } from "../../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

      const response = await API.post(
        "/auth/login",
        formData
      );

      const data = response.data;

      login(data.user, data.token);

      toast.success("Login successful");

      if (data.user.role === "candidate") {

        navigate("/candidate/dashboard");

      } else if (data.user.role === "recruiter") {

        navigate("/recruiter/dashboard");

      } else {

        navigate("/");
      }

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">

        <h1 className="text-3xl font-bold mb-2 text-center">
          Welcome Back
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Sign in to your QuickHire account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-black font-medium hover:underline"
          >
            Register here
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;