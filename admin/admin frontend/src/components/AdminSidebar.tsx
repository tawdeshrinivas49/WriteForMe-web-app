import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Ticket, ShieldCheck, AlertTriangle, Users, HeartHandshake,
  CreditCard, Gift, Trophy, MessageSquare, Megaphone, ScrollText, UserCog, Building2,
  GraduationCap, Settings, ClipboardCheck,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
      { title: "Candidates", url: "/admin/candidates", icon: Users },
      { title: "Volunteers", url: "/admin/volunteers", icon: HeartHandshake },
      { title: "NGOs", url: "/admin/ngos", icon: Building2 },
      { title: "Org Approvals", url: "/admin/org-approvals", icon: ClipboardCheck },
    ],
  },
  {
    label: "Partner Org",
    items: [
      { title: "Institutional Metrics", url: "/admin/partner/dashboard", icon: GraduationCap },
      { title: "Student Roster", url: "/admin/partner/roster", icon: Users },
    ],
  },
  {
    label: "Trust & Safety",
    items: [
      { title: "Tickets", url: "/admin/tickets", icon: Ticket },
      { title: "Manual verification", url: "/admin/verifications", icon: ShieldCheck },
      { title: "Suspicious flags", url: "/admin/flags", icon: AlertTriangle },
      { title: "Reviews", url: "/admin/reviews", icon: MessageSquare },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Exam payments", url: "/admin/payments", icon: CreditCard },
      { title: "Donations", url: "/admin/donations", icon: Gift },
      { title: "Gamification", url: "/admin/gamification", icon: Trophy },
      { title: "News & leaderboard", url: "/admin/announcements", icon: Megaphone },
    ],
  },
  {
    label: "Platform Governance",
    items: [
      { title: "Platform Analytics", url: "/admin/super/dashboard", icon: LayoutDashboard },
      { title: "Unlisted Exams", url: "/admin/super/custom-exams", icon: Ticket },
      { title: "Legacy Approvals", url: "/admin/super/legacy-approvals", icon: ShieldCheck },
      { title: "Platform Settings", url: "/admin/super/settings", icon: Settings },
    ],
  },
  {
    label: "Admin settings",
    items: [
      { title: "Audit log", url: "/admin/audit", icon: ScrollText },
      { title: "Admin accounts", url: "/admin/accounts", icon: UserCog },
    ],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isActive = (url: string) => (url === "/admin" ? pathname === "/admin" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-4 border-b border-sidebar-border">
          <span className="font-display font-bold text-sidebar-foreground text-sm tracking-tight">
            {collapsed ? "WFM" : "Write For Me · Admin"}
          </span>
        </div>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <NavLink to={item.url} end={item.url === "/admin"} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
