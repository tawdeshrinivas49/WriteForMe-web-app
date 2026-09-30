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
import Sitemap from "./pages/Sitemap";
import Welcome from "./pages/Welcome";
import Request from "./pages/Request";
import Waiting from "./pages/Waiting";
import Match from "./pages/Match";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AdminRoutes } from "@admin/AdminRoutes";

const queryClient = new QueryClient();

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
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
