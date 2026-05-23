import { Outlet, Link } from "react-router-dom";

function CandidateLayout() {

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 border-r p-5">

        <h2 className="text-2xl font-bold mb-6">
          Candidate Panel
        </h2>

        <div className="flex flex-col gap-4">

          <Link to="/candidate/dashboard">
            Dashboard
          </Link>

          <Link to="/candidate/applications">
            Applications
          </Link>

          <Link to="/candidate/resume">
            Resume
          </Link>

        </div>

      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}

export default CandidateLayout;