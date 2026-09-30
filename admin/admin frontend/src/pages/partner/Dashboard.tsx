import { motion } from "framer-motion";
import { GraduationCap, Clock, Award, ShieldCheck, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminPage } from "@admin/components/AdminPage";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar,
} from "recharts";

const performanceData = [
  { month: "Mar", hours: 120, matches: 28 },
  { month: "Apr", hours: 180, matches: 42 },
  { month: "May", hours: 240, matches: 56 },
  { month: "Jun", hours: 310, matches: 68 },
  { month: "Jul", hours: 420, matches: 92 },
  { month: "Aug", hours: 480, matches: 104 },
];

const recentActivity = [
  { id: "ACT-1", student: "Karan Mehta", exam: "SSC CGL", date: "2026-08-20", hours: 3.5, status: "Verified" },
  { id: "ACT-2", student: "Priya Patel", exam: "IBPS PO", date: "2026-08-18", hours: 3.0, status: "Verified" },
  { id: "ACT-3", student: "Amit Shah", exam: "UPSC Prelims", date: "2026-08-15", hours: 4.0, status: "Pending approval" },
  { id: "ACT-4", student: "Rohan Deshmukh", exam: "Railway RRB", date: "2026-08-12", hours: 3.0, status: "Verified" },
];

export default function PartnerDashboard() {
  const kpis = [
    { label: "Enrolled Students", value: "142", sub: "+12 this month", icon: GraduationCap },
    { label: "Total Scribe Hours", value: "1,750 hrs", sub: "+380 hrs vs Q2", icon: Clock },
    { label: "Exams Assisted", value: "388", sub: "98.4% fulfillment", icon: Award },
    { label: "DigiLocker Verified", value: "94.2%", sub: "134 students", icon: ShieldCheck },
  ];

  return (
    <AdminPage
      title="Institutional Metrics"
      description="Track student volunteer participation, exam fulfillment rates, and community impact metrics for your affiliated university/college."
      exportName="partner-metrics"
      exportRows={performanceData}
    >
      {/* Mini KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{k.label}</p>
                  <p className="text-2xl font-display font-bold mt-1.5">{k.value}</p>
                  <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {k.sub}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center text-primary">
                  <k.icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Community Service Hours</CardTitle>
            <CardDescription>Monthly service hours contributed by student scribes</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ left: -15, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
                <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))" }}
                />
                <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Exams Assisted</CardTitle>
            <CardDescription>Monthly match fulfillment volume</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ left: -20, right: 5, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))" }}
                />
                <Bar dataKey="matches" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Student Activity</CardTitle>
            <CardDescription>Realtime logs of student scribe commitments</CardDescription>
          </div>
          <button className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold">
            View full log <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/20">
                <tr>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Student Name</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Exam Name</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Assisted Date</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Hours Contributed</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentActivity.map((act) => (
                  <tr key={act.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-3 font-medium">{act.student}</td>
                    <td className="p-3">{act.exam}</td>
                    <td className="p-3 text-muted-foreground">{act.date}</td>
                    <td className="p-3 text-right font-medium">{act.hours} hrs</td>
                    <td className="p-3 text-right">
                      <Badge variant={act.status === "Verified" ? "default" : "secondary"}>
                        {act.status}
                      </Badge>
                    </td>
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
