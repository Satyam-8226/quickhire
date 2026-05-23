import { Outlet, Link } from "react-router-dom";

function RecruiterLayout() {

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 border-r p-5">

        <h2 className="text-2xl font-bold mb-6">
          Recruiter Panel
        </h2>

        <div className="flex flex-col gap-4">

          <Link to="/recruiter/dashboard">
            Dashboard
          </Link>

          <Link to="/recruiter/jobs">
            Manage Jobs
          </Link>

          <Link to="/recruiter/create-job">
            Create Job
          </Link>

        </div>

      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}

export default RecruiterLayout;