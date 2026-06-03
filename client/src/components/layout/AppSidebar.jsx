import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

function AppSidebar({ title, links }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-200 px-6 py-6 lg:border-b-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          QuickHire
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:flex-col lg:overflow-visible lg:px-3 lg:py-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "inline-flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-light text-brand"
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
