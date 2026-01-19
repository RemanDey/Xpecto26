import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Exhibition from "./pages/Exhibition";
import Events from "./pages/Events";
import About from "./pages/About";
// import Sessions from "./pages/Sessions";
import Profile from "./pages/Profile";
import AuthSuccess from "./pages/AuthSuccess";
import AuthError from "./pages/AuthError";
import AdminPanel from "./pages/AdminPanel";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import XpectoSideBar from "./components/XpectoSideBar";
import SmoothCursor from "./components/ui/SmoothCursor";
import ProfileCompletionModal from "./components/ProfileCompletionModal";
import GoogleOneTap from "./components/GoogleOneTap";
import { AuthProvider } from "./context/AuthContext";
import Exhibitions from "./pages/Exhibitions";
import Sessions from "./pages/Sessions";

export default function App() {
  return (
    <AuthProvider>
      <div className="overflow-x-hidden">
        <XpectoSideBar>
          <GoogleOneTap />
          <SmoothCursor />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/exhibition" element={<Exhibitions />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/auth/error" element={<AuthError />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </XpectoSideBar>
        {/* Profile Completion Modal - shows after OAuth if profile is incomplete */}
        <ProfileCompletionModal />
      </div>
    </AuthProvider>
  );
}
