import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          QuickHire AI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link to="/" className="hover:opacity-80 transition">
            Home
          </Link>

          <Link to="/jobs" className="hover:opacity-80 transition">
            Browse Jobs
          </Link>

          {!user ? (
            <>
              <Link 
                to="/login"
                className="hover:opacity-80 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-90 transition font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "candidate" && (
                <>
                  <Link
                    to="/candidate/dashboard"
                    className="hover:opacity-80 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/candidate/applications"
                    className="hover:opacity-80 transition"
                  >
                    Applications
                  </Link>
                  <Link
                    to="/candidate/resume"
                    className="hover:opacity-80 transition"
                  >
                    Resume
                  </Link>
                </>
              )}

              {user.role === "recruiter" && (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    className="hover:opacity-80 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/recruiter/jobs"
                    className="hover:opacity-80 transition"
                  >
                    My Jobs
                  </Link>
                  <Link
                    to="/recruiter/create-job"
                    className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-90 transition font-medium"
                  >
                    Post Job
                  </Link>
                </>
              )}

              <div className="border-l border-white/30 pl-8">
                <p className="text-sm text-gray-300 mb-2">
                  {user.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3">
          <Link
            to="/"
            className="block py-2 hover:opacity-80 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className="block py-2 hover:opacity-80 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Jobs
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="block py-2 hover:opacity-80 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block py-2 hover:opacity-80 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "candidate" && (
                <>
                  <Link
                    to="/candidate/dashboard"
                    className="block py-2 hover:opacity-80 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/candidate/applications"
                    className="block py-2 hover:opacity-80 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/candidate/resume"
                    className="block py-2 hover:opacity-80 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Resume
                  </Link>
                </>
              )}

              {user.role === "recruiter" && (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    className="block py-2 hover:opacity-80 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/recruiter/jobs"
                    className="block py-2 hover:opacity-80 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Jobs
                  </Link>
                  <Link
                    to="/recruiter/create-job"
                    className="block py-2 hover:opacity-80 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Post Job
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-red-400 hover:text-red-300 transition font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;