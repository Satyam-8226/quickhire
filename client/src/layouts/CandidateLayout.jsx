import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  ExternalLink,
  FileText,
} from "lucide-react";
import AppSidebar from "../components/layout/AppSidebar";

const links = [
  {
    to: "/candidate/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    end: true,
  },
  {
    to: "/candidate/applications",
    label: "Applications",
    icon: <ClipboardList className="h-4 w-4" />,
  },
  {
    to: "/candidate/external-applications",
    label: "External Applications",
    icon: <ExternalLink className="h-4 w-4" />,
  },
  {
    to: "/candidate/resume",
    label: "Resume",
    icon: <FileText className="h-4 w-4" />,
  },
];

function CandidateLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <AppSidebar title="Candidate" links={links} />
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default CandidateLayout;
