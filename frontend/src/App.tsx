import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Community from "./pages/Community";
import HallOfFame from "./pages/HallOfFame";
import Donate from "./pages/Donate";
import Organisations from "./pages/Organisations";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Matching from "./pages/Matching";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOverview from "./pages/admin/Overview";
import AdminTickets from "./pages/admin/Tickets";
import AdminVerifications from "./pages/admin/Verifications";
import AdminFlags from "./pages/admin/Flags";
import AdminPeople from "./pages/admin/People";
import AdminNgos from "./pages/admin/Ngos";
import AdminPayments from "./pages/admin/Payments";
import AdminDonations from "./pages/admin/Donations";
import AdminGamification from "./pages/admin/Gamification";
import AdminReviews from "./pages/admin/Reviews";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminAudit from "./pages/admin/Audit";
import AdminAccounts from "./pages/admin/Accounts";
import Sitemap from "./pages/Sitemap";
import Welcome from "./pages/Welcome";
import Request from "./pages/Request";
import Waiting from "./pages/Waiting";
import Match from "./pages/Match";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PartnerDashboard from "./pages/admin/partner/Dashboard";
import PartnerRoster from "./pages/admin/partner/Roster";
import SuperDashboard from "./pages/admin/super/Dashboard";
import SuperCustomExams from "./pages/admin/super/CustomExams";
import SuperLegacyApprovals from "./pages/admin/super/LegacyApprovals";
import SuperSettings from "./pages/admin/super/Settings";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const GlobalKeyListener = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/organisations" element={<Organisations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/request" element={<Request />} />
          <Route path="/waiting" element={<Waiting />} />
          <Route path="/match" element={<Match />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="candidates" element={<AdminPeople kind="candidates" />} />
            <Route path="volunteers" element={<AdminPeople kind="volunteers" />} />
            <Route path="ngos" element={<AdminNgos />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="verifications" element={<AdminVerifications />} />
            <Route path="flags" element={<AdminFlags />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="gamification" element={<AdminGamification />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="partner/dashboard" element={<PartnerDashboard />} />
            <Route path="partner/roster" element={<PartnerRoster />} />
            <Route path="super/dashboard" element={<SuperDashboard />} />
            <Route path="super/custom-exams" element={<SuperCustomExams />} />
            <Route path="super/legacy-approvals" element={<SuperLegacyApprovals />} />
            <Route path="super/settings" element={<SuperSettings />} />
          </Route>
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <GlobalKeyListener />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
