import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
} from "lucide-react";
import AppSidebar from "../components/layout/AppSidebar";

const links = [
  {
    to: "/recruiter/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    end: true,
  },
  {
    to: "/recruiter/jobs",
    label: "Manage Jobs",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    to: "/recruiter/create-job",
    label: "Create Job",
    icon: <PlusCircle className="h-4 w-4" />,
  },
];

function RecruiterLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <AppSidebar title="Recruiter" links={links} />
      <main className="min-w-0 flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default RecruiterLayout;
