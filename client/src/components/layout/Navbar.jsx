import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { AppButtonLink } from "../ui/AppButton";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const navLinkClass = (path) =>
    cn(
      "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
      isActive(path)
        ? "bg-brand-light text-brand"
        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
    );

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Browse Jobs" },
  ];

  const candidateLinks = [
    { to: "/candidate/dashboard", label: "Dashboard" },
    { to: "/candidate/applications", label: "Applications" },
    { to: "/candidate/resume", label: "Resume" },
  ];

  const recruiterLinks = [
    { to: "/recruiter/dashboard", label: "Dashboard" },
    { to: "/recruiter/jobs", label: "My Jobs" },
  ];

  const roleLinks =
    user?.role === "candidate"
      ? candidateLinks
      : user?.role === "recruiter"
        ? recruiterLinks
        : [];

  const renderLinks = (links, onClick) =>
    links.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className={navLinkClass(link.to)}
        onClick={onClick}
      >
        {link.label}
      </Link>
    ));

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl py-1 pr-2 transition-opacity hover:opacity-90"
          onClick={closeMobile}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white shadow-sm shadow-brand/25 transition-transform group-hover:scale-[1.02]">
            Q
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              QuickHire
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Hiring platform
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {!user ? (
            <>
              <div className="flex items-center gap-0.5 rounded-xl bg-slate-50/80 p-1">
                {renderLinks(publicLinks)}
              </div>
              <div className="ml-3 flex items-center gap-2 border-l border-slate-200 pl-3">
                <Link to="/login" className={navLinkClass("/login")}>
                  Sign in
                </Link>
                <AppButtonLink to="/register" size="md">
                  Get started
                </AppButtonLink>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-0.5 rounded-xl bg-slate-50/80 p-1">
                {renderLinks(roleLinks)}
              </div>

              {user.role === "candidate" && (
                <Link
                  to="/jobs"
                  className={cn(navLinkClass("/jobs"), "ml-1")}
                >
                  Browse Jobs
                </Link>
              )}

              {user.role === "recruiter" && (
                <AppButtonLink
                  to="/recruiter/create-job"
                  size="md"
                  className="ml-2"
                >
                  Post job
                </AppButtonLink>
              )}

              <div className="ml-3 flex items-center gap-2.5 border-l border-slate-200 pl-3">
                <div className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-slate-50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-xs font-semibold text-brand">
                    {getInitials(user.name)}
                  </span>
                  <div className="hidden text-left lg:block">
                    <p className="max-w-[140px] truncate text-sm font-medium text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-[11px] capitalize text-slate-400">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xl:inline">Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          {!user ? (
            <div className="space-y-4">
              <div>
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Explore
                </p>
                <div className="flex flex-col gap-1">
                  {renderLinks(publicLinks, closeMobile)}
                </div>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <Link
                  to="/login"
                  className={navLinkClass("/login")}
                  onClick={closeMobile}
                >
                  Sign in
                </Link>
                <AppButtonLink to="/register" fullWidth onClick={closeMobile}>
                  Get started
                </AppButtonLink>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {user.role === "candidate" ? "Candidate" : "Recruiter"}
                </p>
                <div className="flex flex-col gap-1">
                  {renderLinks(roleLinks, closeMobile)}
                </div>
              </div>

              {user.role === "candidate" && (
                <Link
                  to="/jobs"
                  className={navLinkClass("/jobs")}
                  onClick={closeMobile}
                >
                  Browse Jobs
                </Link>
              )}

              {user.role === "recruiter" && (
                <AppButtonLink
                  to="/recruiter/create-job"
                  fullWidth
                  onClick={closeMobile}
                >
                  Post job
                </AppButtonLink>
              )}

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-sm font-semibold text-brand">
                  {getInitials(user.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
