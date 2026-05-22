import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/axios";

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

      const response = await API.post(
        "/auth/register",
        formData
      );

      alert(response.data.message || "Registration successful");

      navigate("/login");

    } catch (error) {

      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md"
      >

        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-3"
        >
          <option value="candidate">
            Candidate
          </option>

          <option value="recruiter">
            Recruiter
          </option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3"
        >
          {loading ? "Registering..." : "Register"}
        </button>

      </form>

    </div>
  );
}

export default Register;