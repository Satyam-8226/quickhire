import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function Navbar() {

  const { user, logout } = useAuth();

  return (
    <nav className="bg-black text-white px-8 py-4 flex items-center justify-between">
      
      <Link to="/" className="text-2xl font-bold">
        QuickHire AI
      </Link>

      <div className="flex items-center gap-6">

        <Link to="/">Home</Link>

        <Link to="/jobs">Jobs</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>

            <Link
              to="/register"
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span>
              {user.name}
            </span>

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;