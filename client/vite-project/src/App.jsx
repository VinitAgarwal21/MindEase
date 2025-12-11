import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import VideosPage from "./pages/Videos";
import TherapistChat from "./pages/TherapistChat";
import TherapistDetail from "./pages/TherapistDetail";
import Therapists from "./pages/Therapists";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import JournalWrite from "./pages/JournalWrite";
import TherapistOnboarding from "./pages/TherapistOnboarding";
import TherapistAppointments from "./pages/TherapistAppointments";
import TherapistProfileEdit from "./pages/TherapistProfileEdit";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* later: <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/videos" element={<VideosPage />} />
          <Route path="/therapistchat" element={<TherapistChat />} />
             <Route path="/therapist" element={<Therapists />} />
        <Route path="/therapist/:id" element={<TherapistDetail />} />        <Route path="/therapist/onboarding" element={<TherapistOnboarding />} />
        <Route path="/therapist/appointments" element={<TherapistAppointments />} />
        <Route path="/therapist/profile/edit" element={<TherapistProfileEdit />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/journalwrite" element={<JournalWrite />} />
      </Route>
    </Routes>
  );
}

export default App;
