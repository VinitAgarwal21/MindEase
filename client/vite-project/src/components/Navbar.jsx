import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { User, LogOut, Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isSignedIn, user: clerkUser } = useUser();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const displayName = user?.name || clerkUser?.fullName || clerkUser?.firstName || "Profile";
  const displayImage = clerkUser?.imageUrl || null;

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };
  const handleProfileClick = () => {
    setOpen(false); // close dropdown
    setMobileOpen(false);
    if (user) {
      if (user.role === "therapist") {
        navigate("/therapist/profile/edit");
      } else {
        navigate(`/user/${user.id}`);
      }
    } else if (isSignedIn) {
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("mindease_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("mindease_theme", nextIsDark ? "dark" : "light");
  };

  const navLinkClass = ({ isActive }) =>
    `tap-target inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition ${isActive
      ? "bg-mindease-100 text-mindease-700"
      : "text-mindease-700 hover:bg-mindease-100/70 hover:text-mindease-800"
    }`;

  const handleMobileNavigate = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-mindease-100 bg-white/85 backdrop-blur-md">
      <div className="container mx-auto h-14 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl sm:text-4xl font-bold gradient-title inline-block">
          MindEase
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 relative">
          {user?.role === "therapist" ? (
            <>
              <NavLink to='/therapist/appointments' className={navLinkClass}>
                Patients
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to='/therapist' className={navLinkClass}>
                Therapists
              </NavLink>
              <NavLink to='/therapistchat' className={navLinkClass}>
                Chat
              </NavLink>
              <NavLink to='/videos' className={navLinkClass}>
                Explore
              </NavLink>
            </>
          )}

          {/* <Link to="/dashboard" className="text-sm hover:text-mindease-600">
            Dashboard
          </Link> */}

          {/* Conditional Render */}
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-outline inline-flex h-11 w-11 items-center justify-center rounded-full border border-mindease-200 bg-white/75 text-mindease-700 transition hover:bg-mindease-100"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!user && !isSignedIn ? (
            <Link
              to="/auth"
              className="tap-target focus-outline ml-1 inline-flex items-center rounded-full bg-mindease-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-mindease-600"
            >
              Get Started
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="focus-outline flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-mindease-500 text-white ring-2 ring-white transition hover:bg-mindease-600"
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
              </button>

              {open && (
                <div className="surface-card absolute right-0 mt-2 w-48 rounded-xl py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full border-b border-mindease-100 px-4 py-2 text-left text-sm text-mindease-800 hover:bg-mindease-50"
                  >
                    {displayName}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-mindease-800 hover:bg-mindease-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-outline inline-flex h-11 w-11 items-center justify-center rounded-full border border-mindease-200 bg-white/75 text-mindease-700 transition hover:bg-mindease-100"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="focus-outline inline-flex h-11 w-11 items-center justify-center rounded-full border border-mindease-200 bg-white/75 text-mindease-700 transition hover:bg-mindease-100"
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-mindease-100 bg-white/90 backdrop-blur-md px-4 py-4 space-y-3">
          {user?.role === "therapist" ? (
            <button onClick={() => handleMobileNavigate('/therapist/appointments')} className="tap-target block w-full text-left rounded-lg px-3 py-2 text-mindease-700 hover:bg-mindease-100">
              Patients
            </button>
          ) : (
            <>
              <button onClick={() => handleMobileNavigate('/therapist')} className="tap-target block w-full text-left rounded-lg px-3 py-2 text-mindease-700 hover:bg-mindease-100">
                Therapists
              </button>
              <button onClick={() => handleMobileNavigate('/therapistchat')} className="tap-target block w-full text-left rounded-lg px-3 py-2 text-mindease-700 hover:bg-mindease-100">
                Chat
              </button>
              <button onClick={() => handleMobileNavigate('/videos')} className="tap-target block w-full text-left rounded-lg px-3 py-2 text-mindease-700 hover:bg-mindease-100">
                Explore
              </button>
            </>
          )}

          {!user && !isSignedIn ? (
            <button
              onClick={() => handleMobileNavigate('/auth')}
              className="tap-target focus-outline w-full rounded-full bg-mindease-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-mindease-600"
            >
              Get Started
            </button>
          ) : (
            <>
              <button
                onClick={handleProfileClick}
                className="tap-target w-full rounded-lg border border-mindease-100 px-3 py-2 text-left text-sm text-mindease-800 hover:bg-mindease-50"
              >
                {displayName}
              </button>
              <button
                onClick={handleLogout}
                className="tap-target flex w-full items-center gap-2 rounded-lg border border-mindease-100 px-3 py-2 text-left text-sm text-mindease-800 hover:bg-mindease-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
