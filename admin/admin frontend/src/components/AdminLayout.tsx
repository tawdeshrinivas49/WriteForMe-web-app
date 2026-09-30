import { useMemo, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Bell, Download, LogOut, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useAdmin, sinceLabel } from "@admin/store/useAdmin";
import { exportCsv } from "@admin/lib/exportCsv";
import { toast } from "sonner";
import { AccessibilityToolbar } from "@/components/AccessibilityToolbar";


const searchIndex = [
  { label: "Dashboard", to: "/admin" }, { label: "Candidates", to: "/admin/candidates" },
  { label: "Volunteers", to: "/admin/volunteers" }, { label: "NGOs connected", to: "/admin/ngos" },
  { label: "Org Approvals", to: "/admin/org-approvals" },
  { label: "Support tickets", to: "/admin/tickets" }, { label: "Manual verification", to: "/admin/verifications" },
  { label: "Suspicious flags", to: "/admin/flags" }, { label: "Reviews moderation", to: "/admin/reviews" },
  { label: "Exam payments", to: "/admin/payments" }, { label: "Donations & receipts", to: "/admin/donations" },
  { label: "Gamification", to: "/admin/gamification" }, { label: "News & leaderboard", to: "/admin/announcements" },
  { label: "Audit log", to: "/admin/audit" }, { label: "Admin accounts", to: "/admin/accounts" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { authed, adminEmail, logout, tickets, flags, verifications, payments, donations } = useAdmin();
  const [q, setQ] = useState("");

  const results = useMemo(
    () => (q.trim() ? searchIndex.filter((s) => s.label.toLowerCase().includes(q.toLowerCase())) : []),
    [q]
  );

  const notifications = useMemo(
    () => [
      ...tickets.filter((t) => t.priority === "urgent" && t.status !== "closed").map((t) => ({
        id: t.id, text: `Urgent ticket · ${t.subject}`, when: sinceLabel(t.openedAt), to: "/admin/tickets",
      })),
      ...flags.filter((f) => f.priority === "high" && f.status === "open").map((f) => ({
        id: f.id, text: `High-priority flag · ${f.type}`, when: f.detectedAt, to: "/admin/flags",
      })),
      ...verifications.filter((v) => v.status === "pending").slice(0, 2).map((v) => ({
        id: v.id, text: `Verification pending · ${v.name}`, when: v.submittedAt, to: "/admin/verifications",
      })),
    ],
    [tickets, flags, verifications]
  );

  if (!authed) return <Navigate to="/admin/login" replace />;

  const exportAll = () => {
    exportCsv("wfm-admin-snapshot", [
      { metric: "Tickets open", value: tickets.filter((t) => t.status === "open").length },
      { metric: "Flags open", value: flags.filter((f) => f.status === "open").length },
      { metric: "Verifications pending", value: verifications.filter((v) => v.status === "pending").length },
      { metric: "Payments recorded", value: payments.length },
      { metric: "Donations recorded", value: donations.length },
    ]);
    toast.success("Snapshot exported");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-3 md:px-6 border-b border-border bg-background">
            <SidebarTrigger />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search admin panel…"
                className="pl-9"
                aria-label="Search admin panel"
              />
              {results.length > 0 && (
                <div className="absolute mt-1 w-full rounded-md border border-border bg-popover shadow-lg overflow-hidden z-50">
                  {results.map((r) => (
                    <button
                      key={r.to}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                      onClick={() => { navigate(r.to); setQ(""); }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coral text-[10px] font-semibold text-white grid place-items-center">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="px-4 py-3 border-b border-border text-sm font-semibold">Notifications</div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 && <p className="p-4 text-sm text-muted-foreground">Nothing needs attention.</p>}
                    {notifications.map((n) => (
                      <button
                        key={n.id + n.text}
                        onClick={() => navigate(n.to)}
                        className="w-full text-left px-4 py-3 border-b last:border-0 border-border hover:bg-accent"
                      >
                        <p className="text-sm">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.when}</p>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <AccessibilityToolbar />

              <Button variant="outline" size="sm" onClick={exportAll}>
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>

              <Badge variant="secondary" className="hidden md:inline-flex">{adminEmail}</Badge>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                onClick={() => { logout(); navigate("/admin/login"); }}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
