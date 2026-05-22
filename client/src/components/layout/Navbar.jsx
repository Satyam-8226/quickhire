import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-black text-white px-8 py-4 flex items-center justify-between">
      
      <Link to="/" className="text-2xl font-bold">
        QuickHire AI
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/login">Login</Link>
        <Link
          to="/register"
          className="bg-white text-black px-4 py-2 rounded-lg"
        >
          Register
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;