import { motion } from "framer-motion";
import { Users, ShieldAlert, BadgeCent, Percent, Server, Activity } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar,
} from "recharts";

const analyticsData = [
  { month: "Apr", volunteers: 1200, candidates: 900, completed: 780 },
  { month: "May", volunteers: 1540, candidates: 1100, completed: 950 },
  { month: "Jun", volunteers: 1980, candidates: 1450, completed: 1200 },
  { month: "Jul", volunteers: 2500, candidates: 1900, completed: 1650 },
  { month: "Aug", volunteers: 3200, candidates: 2450, completed: 2150 },
];

const partnerLeaders = [
  { rank: 1, name: "Delhi Technological University", scribes: 184, completed: 490, efficiency: "99.2%" },
  { rank: 2, name: "Savitribai Phule Pune University", scribes: 142, completed: 388, efficiency: "98.4%" },
  { rank: 3, name: "PES University, Bengaluru", scribes: 96, completed: 210, efficiency: "96.8%" },
  { rank: 4, name: "Anna University, Chennai", scribes: 74, completed: 150, efficiency: "95.5%" },
];

export default function SuperDashboard() {
  const kpis = [
    { label: "Platform Members", value: "24,840", sub: "+3,200 this week", icon: Users },
    { label: "Funds in Escrow", value: "₹4,25,000", sub: "182 active sessions", icon: BadgeCent },
    { label: "Global Matching Rate", value: "92.4%", sub: "Target 95.0%", icon: Percent },
    { label: "API Cluster Load", value: "99.98% uptime", sub: "Normal operation", icon: Server },
  ];

  return (
    <AdminPage
      title="Platform Analytics"
      description="Super admin metrics console providing server diagnostics, escrow balances, and platform user growth timelines."
      exportName="platform-growth"
      exportRows={analyticsData}
    >
      {/* Platform KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{k.label}</p>
                  <p className="text-2xl font-display font-bold mt-1.5">{k.value}</p>
                  <p className="text-xs text-primary font-medium mt-1">{k.sub}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center text-primary">
                  <k.icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Growth Plot */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">User Acquisition & Match Output</CardTitle>
            <CardDescription>Comparison of volunteer growth, candidate signups, and completed matches.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData} margin={{ left: -15, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
                <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" dataKey="volunteers" name="Volunteers" stroke="hsl(var(--primary))" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="candidates" name="Candidates" stroke="hsl(var(--accent))" strokeWidth={2.5} />
                <Line type="monotone" dataKey="completed" name="Completed Matches" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Diagnostic Metrics */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Platform Diagnostics</CardTitle>
            <CardDescription>Real-time microservices monitor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/20 border border-border rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">DigiLocker API gateway</span>
                <p className="text-sm font-semibold">Active & Responsive</p>
              </div>
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
            <div className="p-3 bg-muted/20 border border-border rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Sarvam OCR processor</span>
                <p className="text-sm font-semibold">Active (Avg latency: 420ms)</p>
              </div>
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
            <div className="p-3 bg-muted/20 border border-border rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Razorpay escrow pool</span>
                <p className="text-sm font-semibold">Sync Successful</p>
              </div>
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Performing Partners Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Leading Partner Institutions</CardTitle>
          <CardDescription>Top universities ranking by active student scribes and match completion metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/20">
                <tr>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Rank</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Institution Name</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Active Scribes</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Matches Completed</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Efficiency Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {partnerLeaders.map((partner) => (
                  <tr key={partner.rank} className="hover:bg-muted/10 transition-colors">
                    <td className="p-3 font-semibold text-muted-foreground">{partner.rank}</td>
                    <td className="p-3 font-medium">{partner.name}</td>
                    <td className="p-3 text-center">{partner.scribes}</td>
                    <td className="p-3 text-center">{partner.completed}</td>
                    <td className="p-3 text-right text-emerald-600 font-semibold">{partner.efficiency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
