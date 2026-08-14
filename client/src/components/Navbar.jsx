import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";
import { useAuth } from "./AuthProvider";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/skills", label: "My Skills", icon: Sparkles },
  { to: "/requests", label: "Requests", icon: ArrowLeftRight },
];

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const firstName = user?.firstName || "Profile";
  const initial = user?.firstName?.charAt(0)?.toUpperCase();

  const desktopLinkClass = ({ isActive }) =>
    [
      "group relative flex h-11 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60",
      isActive
        ? "border border-gray-800 bg-gray-900 text-white shadow-lg shadow-blue-950/20"
        : "text-gray-400 hover:-translate-y-0.5 hover:bg-gray-900 hover:text-white",
    ].join(" ");

  const mobileLinkClass = ({ isActive }) =>
    [
      "group flex items-center justify-between rounded-lg border px-3 py-3 transition",
      isActive
        ? "border-gray-800 bg-gray-900 text-white"
        : "border-transparent text-gray-400 hover:border-gray-800 hover:bg-gray-900 hover:text-white",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-gray-950/95 backdrop-blur">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60"
          aria-label="SkillBridge home">
          <span className="grid h-10 w-10 grid-cols-2 gap-1 rounded-lg border border-gray-800 bg-gray-900 p-2 shadow-lg shadow-blue-950/20 transition group-hover:-translate-y-0.5">
            <span className="rounded-sm bg-white" />
            <span className="rounded-sm bg-gray-400" />
            <span className="rounded-sm bg-blue-600" />
            <span className="rounded-sm bg-white" />
          </span>

          <span className="leading-none">
            <span className="block text-xl font-bold text-white sm:text-2xl">
              SkillBridge
            </span>
            <span className="mt-1 hidden text-xs font-medium text-gray-400 sm:block">
              Exchange skills. Grow faster.
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={desktopLinkClass}>
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 transition group-hover:text-white"
                    }
                  />
                  <span>{label}</span>
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-blue-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3.5 py-2 shadow-lg shadow-blue-950/10">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-sm text-gray-400">Credits</span>
            <span className="rounded-md bg-gray-950 px-2 py-0.5 text-sm font-semibold text-white">
              {user?.credits ?? 0}
            </span>
          </div>

          <Link
            to="/profile"
            className="group flex items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 transition hover:border-gray-800 hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition group-hover:scale-105">
              {initial || <User size={18} />}
            </div>
            <span className="max-w-28 truncate text-sm font-semibold text-gray-200">
              {firstName}
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((previous) => !previous)}
          className="rounded-lg border border-gray-800 bg-gray-900 p-2.5 text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 md:hidden"
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }>
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-gray-800 bg-gray-950 md:hidden">
          <div className="mx-auto max-w-7xl space-y-2 px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {initial || <User size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {firstName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.credits ?? 0} skill credits
                  </p>
                </div>
              </div>
              <Sparkles size={18} className="text-blue-600" />
            </div>

            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setIsMenuOpen(false)}
                className={mobileLinkClass}>
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={isActive ? "text-blue-600" : "text-gray-400"}
                      />
                      {label}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive ? "bg-blue-600" : "bg-gray-800"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            <NavLink
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className={mobileLinkClass}>
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <User
                      size={18}
                      className={isActive ? "text-blue-600" : "text-gray-400"}
                    />
                    Profile
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? "bg-blue-600" : "bg-gray-800"
                    }`}
                  />
                </>
              )}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
