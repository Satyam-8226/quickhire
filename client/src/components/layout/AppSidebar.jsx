import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

function AppSidebar({ title, links }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200/80 bg-white/95 backdrop-blur lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-200/80 px-5 py-5 lg:border-b-0 lg:px-6 lg:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          QuickHire
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <nav
        className="flex gap-2 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible lg:px-3 lg:py-5"
        aria-label={`${title} navigation`}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "inline-flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-light text-brand shadow-sm shadow-brand/5"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AppSidebar;
