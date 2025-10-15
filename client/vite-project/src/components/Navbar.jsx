import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { User, LogOut } from "lucide-react"; // for icons

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-bold text-mindease-600">
          MindEase
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 relative">
          <a href="#features" className="text-sm hover:text-mindease-600">
            Features
          </a>
          <Link to="/dashboard" className="text-sm hover:text-mindease-600">
            Dashboard
          </Link>

          {/* Conditional Render */}
          {!user ? (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-full bg-mindease-500 text-white hover:bg-mindease-600 transition"
            >
              Get Started
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-mindease-500 text-white hover:bg-mindease-600"
              >
                <User size={20} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border py-2">
                  <p className="px-4 py-2 text-sm text-gray-700 border-b">
                    {user.name || "User"}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
