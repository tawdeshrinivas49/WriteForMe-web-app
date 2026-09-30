import { useState, useRef, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrg, BulkMember } from "@/store/useOrg";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Upload,
  Users,
  GraduationCap,
  HeartHandshake,
  BarChart3,
  Download,
  Search,
  Eye,
  UserX,
  UserCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  ChevronDown,
  Building2,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const performanceTrend = [
  { month: "Apr", exams: 12 },
  { month: "May", exams: 20 },
  { month: "Jun", exams: 34 },
  { month: "Jul", exams: 48 },
  { month: "Aug", exams: 61 },
  { month: "Sep", exams: 72 },
];

function StatusBadge({ status }: { status: BulkMember["status"] }) {
  return (
    <Badge variant={status === "active" ? "default" : "secondary"} className="capitalize">
      {status}
    </Badge>
  );
}

function ApprovalBanner({ status }: { status: string }) {
  if (status === "approved") return null;
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 text-sm ${
      status === "pending"
        ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
        : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
    }`}>
      {status === "pending" ? <Clock className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
      <span>
        {status === "pending"
          ? "Your organisation registration is pending admin approval. You can browse the portal but bulk upload will be enabled once approved."
          : "Your registration was rejected. Please contact support@writeforme.org for more information."}
      </span>
    </div>
  );
}

export default function OrgDashboard() {
  const { orgName, orgType, approvalStatus, members, addMembers, removeMember, updateMemberStatus, isRegistered } = useOrg();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadType, setUploadType] = useState<"candidate" | "volunteer">("candidate");
  const fileRef = useRef<HTMLInputElement>(null);

  const candidates = members.filter(m => m.type === "candidate");
  const volunteers = members.filter(m => m.type === "volunteer");
  const totalExams = members.reduce((acc, m) => acc + m.exams, 0);

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    m.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (approvalStatus !== "approved") {
      toast.error("Bulk upload is only available after admin approval.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws);

        if (!rows.length) {
          toast.error("No data found in the spreadsheet.");
          return;
        }

        const newMembers: BulkMember[] = rows.map((row, i) => ({
          id: `BM-${Date.now()}-${i}`,
          name: String(row["name"] || row["Name"] || "Unknown"),
          phone: String(row["phone"] || row["Phone"] || ""),
          gender: String(row["gender"] || row["Gender"] || ""),
          type: uploadType,
          city: String(row["city"] || row["City"] || ""),
          disability: uploadType === "candidate" ? String(row["disability"] || row["Disability"] || "") : undefined,
          education: String(row["education"] || row["Education"] || ""),
          status: "pending",
          exams: 0,
          rating: 0,
          uploadedAt: new Date().toISOString().slice(0, 10),
        }));

        addMembers(newMembers);
        toast.success(`Successfully registered ${newMembers.length} ${uploadType}s from spreadsheet.`);
        e.target.value = "";
        setActiveTab("members");
      } catch {
        toast.error("Failed to parse file. Please use the provided template.");
      }
    };
    reader.readAsBinaryString(file);
  }, [approvalStatus, uploadType, addMembers]);

  const downloadTemplate = (type: "candidate" | "volunteer") => {
    const candidateCols = [["name", "phone", "gender", "city", "disability", "education", "preferred_language"]];
    const volunteerCols = [["name", "phone", "gender", "city", "education", "has_vehicle", "upi_id"]];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(type === "candidate" ? candidateCols : volunteerCols);
    XLSX.utils.book_append_sheet(wb, ws, type === "candidate" ? "Candidates" : "Volunteers");
    XLSX.writeFile(wb, `wfm_${type}_template.xlsx`);
    toast.success(`${type} template downloaded`);
  };

  if (!isRegistered) {
    return (
      <Layout>
        <section className="py-32 container-narrow text-center">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-display font-bold mb-4">No Organisation Registered</h1>
          <p className="text-muted-foreground mb-8">Register your organisation to access the partner portal.</p>
          <Button asChild><Link to="/org/register">Register Now</Link></Button>
        </section>
      </Layout>
    );
  }

  const kpis = [
    { label: "Candidates Enrolled", value: candidates.length, icon: GraduationCap, color: "text-teal" },
    { label: "Volunteers Enrolled", value: volunteers.length, icon: HeartHandshake, color: "text-coral" },
    { label: "Total Exams Assisted", value: totalExams, icon: CheckCircle2, color: "text-primary" },
    { label: "Active Members", value: members.filter(m => m.status === "active").length, icon: Users, color: "text-lilac" },
  ];

  return (
    <Layout>
      <section className="py-16 md:py-24 container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="section-label mb-2">Organisation Portal</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold mt-2">{orgName}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{orgType}</Badge>
                <Badge className={approvalStatus === "approved" ? "bg-emerald-500" : "bg-amber-500"}>
                  {approvalStatus === "approved" ? "Approved" : approvalStatus === "pending" ? "Pending Approval" : "Rejected"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/org/register">Edit Profile</Link>
              </Button>
            </div>
          </div>

          <ApprovalBanner status={approvalStatus} />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview"><BarChart3 className="w-4 h-4 mr-2" />Overview</TabsTrigger>
              <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-2" />Bulk Upload</TabsTrigger>
              <TabsTrigger value="members"><Users className="w-4 h-4 mr-2" />Members ({members.length})</TabsTrigger>
            </TabsList>

            {/* ─── OVERVIEW TAB ─── */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => (
                  <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="border-border/50 bg-card/50">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{k.label}</p>
                          <p className="text-3xl font-display font-bold mt-1">{k.value}</p>
                          <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Active
                          </p>
                        </div>
                        <div className={`w-11 h-11 rounded-full bg-muted grid place-items-center ${k.color}`}>
                          <k.icon className="w-5 h-5" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Exams Assisted Over Time</CardTitle>
                    <CardDescription>Monthly count of exams your members participated in</CardDescription>
                  </CardHeader>
                  <CardContent className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceTrend} margin={{ left: -15, right: 10, top: 10 }}>
                        <defs>
                          <linearGradient id="orgColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                        <YAxis tickLine={false} axisLine={false} className="text-xs" />
                        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))" }} />
                        <Area type="monotone" dataKey="exams" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#orgColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Member Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Candidates", count: candidates.length, color: "bg-teal" },
                      { label: "Volunteers", count: volunteers.length, color: "bg-coral" },
                      { label: "Active", count: members.filter(m => m.status === "active").length, color: "bg-primary" },
                      { label: "Pending", count: members.filter(m => m.status === "pending").length, color: "bg-amber-400" },
                    ].map(({ label, count, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${color}`}
                            style={{ width: members.length ? `${(count / members.length) * 100}%` : "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ─── BULK UPLOAD TAB ─── */}
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" /> Bulk Upload via Excel / CSV
                  </CardTitle>
                  <CardDescription>
                    Download a template, fill in member details, then upload to register in bulk. Each row represents one candidate or volunteer.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Type */}
                  <div className="flex gap-3">
                    {(["candidate", "volunteer"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setUploadType(t)}
                        className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-colors duration-200 capitalize ${
                          uploadType === t
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {t === "candidate" ? <GraduationCap className="w-4 h-4 inline mr-2" /> : <HeartHandshake className="w-4 h-4 inline mr-2" />}
                        {t}s
                      </button>
                    ))}
                  </div>

                  {/* Download Template */}
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">Step 1: Download the template</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Pre-formatted Excel file with all required column headers</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => downloadTemplate(uploadType)}>
                      <Download className="w-4 h-4 mr-2" /> Template
                    </Button>
                  </div>

                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200 ${
                      approvalStatus === "approved"
                        ? "border-border hover:border-primary/50 hover:bg-muted/20"
                        : "border-border opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => approvalStatus === "approved" && fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                    />
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium">
                      {approvalStatus === "approved"
                        ? `Upload ${uploadType} spreadsheet`
                        : "Upload available after admin approval"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">XLSX, XLS or CSV</p>
                  </div>

                  {/* Required Columns */}
                  <div className="rounded-xl border p-4 text-sm">
                    <p className="font-semibold mb-2">Required columns for {uploadType}s:</p>
                    <div className="flex flex-wrap gap-2">
                      {(uploadType === "candidate"
                        ? ["name", "phone", "gender", "city", "disability", "education", "preferred_language"]
                        : ["name", "phone", "gender", "city", "education", "has_vehicle", "upi_id"]
                      ).map((col) => (
                        <code key={col} className="px-2 py-1 rounded bg-muted text-xs font-mono">{col}</code>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* ─── MEMBERS TAB ─── */}
            <TabsContent value="members" className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone…" className="pl-9" />
                </div>
                <Badge variant="outline">{filteredMembers.length} members</Badge>
              </div>

              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        {["Name", "Phone", "Type", "City", "Disability / Education", "Exams", "Rating", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left p-3 font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.length === 0 && (
                        <tr>
                          <td colSpan={9} className="text-center py-10 text-muted-foreground">
                            No members found. Upload a spreadsheet to get started.
                          </td>
                        </tr>
                      )}
                      {filteredMembers.map(m => (
                        <tr key={m.id} className="border-b last:border-0 border-border hover:bg-accent/50 transition-colors">
                          <td className="p-3 font-medium">{m.name}</td>
                          <td className="p-3 text-muted-foreground">{m.phone}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="capitalize">
                              {m.type === "candidate" ? <GraduationCap className="w-3 h-3 mr-1" /> : <HeartHandshake className="w-3 h-3 mr-1" />}
                              {m.type}
                            </Badge>
                          </td>
                          <td className="p-3">{m.city}</td>
                          <td className="p-3 text-muted-foreground text-xs">{m.disability || m.education || "—"}</td>
                          <td className="p-3 font-semibold">{m.exams}</td>
                          <td className="p-3">{m.rating > 0 ? `★ ${m.rating.toFixed(1)}` : "—"}</td>
                          <td className="p-3"><StatusBadge status={m.status} /></td>
                          <td className="p-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 px-2">
                                  Actions <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { updateMemberStatus(m.id, "active"); toast.success(`${m.name} set to active`); }}>
                                  <UserCheck className="w-4 h-4 mr-2 text-emerald-500" /> Set Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { updateMemberStatus(m.id, "pending"); toast.info(`${m.name} set to pending`); }}>
                                  <Eye className="w-4 h-4 mr-2 text-amber-500" /> Set Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => { removeMember(m.id); toast.error(`Removed ${m.name}`); }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <UserX className="w-4 h-4 mr-2" /> Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </section>
    </Layout>
  );
}
