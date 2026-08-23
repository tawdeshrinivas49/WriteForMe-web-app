import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, HeartHandshake, Building2, CheckCircle2, Gift, Ticket as TicketIcon, AlertTriangle, ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPage } from "@/components/admin/AdminPage";
import { useAdmin, successRateSeries, inr } from "@/store/useAdmin";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

export default function Overview() {
  const navigate = useNavigate();
  const { candidates, volunteers, ngos, donations, tickets, flags } = useAdmin();

  const monthDonations = donations.reduce((a, d) => a + d.amount, 0);
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const openFlags = flags.filter((f) => f.status === "open").length;

  const kpis = [
    { label: "Total candidates", value: candidates.length, icon: Users, to: "/admin/candidates", hint: "View candidate list" },
    { label: "Total volunteers", value: volunteers.length, icon: HeartHandshake, to: "/admin/volunteers", hint: "View volunteer list" },
    { label: "NGOs connected", value: ngos.length, icon: Building2, to: "/admin/ngos", hint: "Details & contributions" },
    { label: "Successful exams", value: "92%", icon: CheckCircle2, to: "/admin/payments", hint: "Completed sessions" },
    { label: "Donations this month", value: inr(monthDonations), icon: Gift, to: "/admin/donations", hint: "Receipts & donors" },
    { label: "Open tickets", value: openTickets, icon: TicketIcon, to: "/admin/tickets", hint: "Support queue", alert: openTickets > 0 },
    { label: "Flagged cases", value: openFlags, icon: AlertTriangle, to: "/admin/flags", hint: "Suspicious patterns", alert: openFlags > 0 },
  ];

  return (
    <AdminPage
      title="Overview"
      description="Every figure below is a link — open the underlying records instead of reading a flat number."
      exportName="overview-kpis"
      exportRows={kpis.map((k) => ({ metric: k.label, value: k.value }))}
    >
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {kpis.map((k, i) => (
          <motion.button
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => navigate(k.to)}
            className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          >
            <Card className="h-full transition-all hover:shadow-sm hover:border-primary/30 bg-card/60 backdrop-blur-sm border-border">
              <CardContent className="p-3.5 flex flex-col justify-between h-full min-h-[96px]">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-medium text-muted-foreground leading-tight line-clamp-2">{k.label}</span>
                  <k.icon className={`w-3.5 h-3.5 shrink-0 ${k.alert ? "text-coral animate-pulse" : "text-primary"}`} />
                </div>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <p className="text-xl font-display font-bold tracking-tight">{k.value}</p>
                  <ArrowUpRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </CardContent>
            </Card>
          </motion.button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Matching success rate over time</CardTitle>
            <Badge variant="secondary">Last 7 months</Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={successRateSeries} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis domain={[60, 100]} tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))" }}
                  formatter={(v: number, n) => (n === "rate" ? [`${v}%`, "Success rate"] : [v, "Matches"])}
                />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent flagged activity</CardTitle>
            <button className="text-xs text-primary hover:underline" onClick={() => navigate("/admin/flags")}>View all</button>
          </CardHeader>
          <CardContent className="space-y-3">
            {flags.slice(0, 5).map((f) => (
              <button
                key={f.id}
                onClick={() => navigate("/admin/flags")}
                className="w-full text-left p-3 rounded-md border border-border hover:border-primary/40 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{f.type}</span>
                  <Badge variant={f.priority === "high" ? "destructive" : f.priority === "medium" ? "default" : "secondary"}>
                    {f.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{f.subject}</p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
