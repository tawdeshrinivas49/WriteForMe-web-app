import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminOverview from "./pages/Overview";
import AdminTickets from "./pages/Tickets";
import AdminVerifications from "./pages/Verifications";
import AdminFlags from "./pages/Flags";
import AdminPeople from "./pages/People";
import AdminNgos from "./pages/Ngos";
import AdminPayments from "./pages/Payments";
import AdminDonations from "./pages/Donations";
import AdminGamification from "./pages/Gamification";
import AdminReviews from "./pages/Reviews";
import AdminAnnouncements from "./pages/Announcements";
import AdminAudit from "./pages/Audit";
import AdminAccounts from "./pages/Accounts";
import PartnerDashboard from "./pages/partner/Dashboard";
import PartnerRoster from "./pages/partner/Roster";
import SuperDashboard from "./pages/super/Dashboard";
import SuperCustomExams from "./pages/super/CustomExams";
import SuperLegacyApprovals from "./pages/super/LegacyApprovals";
import SuperSettings from "./pages/super/Settings";
import OrgApprovals from "./pages/OrgApprovals";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="candidates" element={<AdminPeople kind="candidates" />} />
        <Route path="volunteers" element={<AdminPeople kind="volunteers" />} />
        <Route path="ngos" element={<AdminNgos />} />
        <Route path="org-approvals" element={<OrgApprovals />} />
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
    </Routes>
  );
}

export default AdminRoutes;
