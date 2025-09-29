import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-mindease-50 text-mindease-900 font-body">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t mt-16 py-10 text-center text-sm text-mindease-600">
        {new Date().getFullYear()} MindEase — All rights reserved.
      </footer>
    </div>
  );
}
