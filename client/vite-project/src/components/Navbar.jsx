import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-mindease-600">
          MindEase
        </Link>
        <nav className="flex items-center gap-4">
          <a href="#features" className="text-sm hover:text-mindease-600">Features</a>
          <Link to="/dashboard" className="text-sm hover:text-mindease-600">Dashboard</Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-mindease-500 text-white hover:bg-mindease-600 transition"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
