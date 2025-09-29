import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import VideosPage from "./pages/Videos";
import TherapistChat from "./pages/TherapistChat";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* later: <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/videos" element={<VideosPage />} />
          <Route path="/therapist" element={<TherapistChat />} />
      </Route>
    </Routes>
  );
}

export default App;
