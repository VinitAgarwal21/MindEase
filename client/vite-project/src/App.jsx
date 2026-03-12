import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import VideosPage from "./pages/Videos";
import TherapistChat from "./pages/TherapistChat";
import TherapistDetail from "./pages/TherapistDetail";
import Therapists from "./pages/Therapists";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import JournalWrite from "./pages/JournalWrite";
import EmotionPredictor from "./pages/EmotionPredictor";
import TherapistOnboarding from "./pages/TherapistOnboarding";
import TherapistAppointments from "./pages/TherapistAppointments";
import TherapistProfileEdit from "./pages/TherapistProfileEdit";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}

function RequireTherapist({ children }) {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "therapist") return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* later: <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/videos" element={<VideosPage />} />
          <Route path="/therapistchat" element={<TherapistChat />} />
             <Route path="/therapist" element={<Therapists />} />
        <Route path="/therapist/:id" element={<TherapistDetail />} />
        <Route path="/therapist/onboarding" element={<RequireTherapist><TherapistOnboarding /></RequireTherapist>} />
        <Route path="/therapist/appointments" element={<RequireTherapist><TherapistAppointments /></RequireTherapist>} />
        <Route path="/therapist/profile/edit" element={<RequireTherapist><TherapistProfileEdit /></RequireTherapist>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user/:id" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/journalwrite" element={<RequireAuth><JournalWrite /></RequireAuth>} />
        <Route path="/emotionpredictor" element={<RequireAuth><EmotionPredictor /></RequireAuth>} />
      </Route>
    </Routes>
  );
}

export default App;
