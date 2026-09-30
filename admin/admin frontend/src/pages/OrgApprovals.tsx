import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdmin } from "@admin/store/useAdmin";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileCheck2,
  Clock,
  Users,
} from "lucide-react";

export interface OrgApplication {
  id: string;
  name: string;
  type: string;
  website: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  licenseFile: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewNote?: string;
  candidatesCount: number;
  volunteersCount: number;
}

const seedApplications: OrgApplication[] = [
  {
    id: "ORG-001",
    name: "Roshni Welfare Society",
    type: "Society",
    website: "https://roshni.org",
    contactName: "Imran Ali",
    contactPhone: "+91 98001 55001",
    contactEmail: "info@roshni.org",
    city: "Lucknow, UP",
    licenseFile: "roshni_registration.pdf",
    submittedAt: "2026-09-28",
    status: "pending",
    candidatesCount: 0,
    volunteersCount: 0,
  },
  {
    id: "ORG-002",
    name: "Asha Kiran Foundation",
    type: "NGO",
    website: "https://ashakiran.in",
    contactName: "Sunita Yadav",
    contactPhone: "+91 98001 55002",
    contactEmail: "contact@ashakiran.in",
    city: "Patna, Bihar",
    licenseFile: "asha_kiran_80g.pdf",
    submittedAt: "2026-09-25",
    status: "pending",
    candidatesCount: 0,
    volunteersCount: 0,
  },
  {
    id: "ORG-003",
    name: "Sneha Foundation",
    type: "NGO",
    website: "https://snehafoundation.org",
    contactName: "Anita Deshpande",
    contactPhone: "+91 98765 43210",
    contactEmail: "contact@snehafoundation.org",
    city: "Pune, Maharashtra",
    licenseFile: "sneha_darpan.pdf",
    submittedAt: "2025-06-01",
    status: "approved",
    candidatesCount: 48,
    volunteersCount: 31,
  },
  {
    id: "ORG-004",
    name: "Prerna Trust",
    type: "Trust",
    website: "",
    contactName: "Mohit Bhatia",
    contactPhone: "+91 98001 55004",
    contactEmail: "prerna@trust.org",
    city: "Chandigarh, PB",
    licenseFile: "prerna_trust_cert.pdf",
    submittedAt: "2026-09-10",
    status: "rejected",
    reviewNote: "Uploaded document is expired (more than 3 years old). Please re-apply with a current certificate.",
    candidatesCount: 0,
    volunteersCount: 0,
  },
];

export default function OrgApprovals() {
  const [applications, setApplications] = useState<OrgApplication[]>(seedApplications);
  const [selected, setSelected] = useState<OrgApplication | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [note, setNote] = useState("");
  const { log } = useAdmin();

  const pending = applications.filter(a => a.status === "pending");
  const approved = applications.filter(a => a.status === "approved");
  const rejected = applications.filter(a => a.status === "rejected");

  const openAction = (app: OrgApplication, action: "approve" | "reject") => {
    setSelected(app);
    setActionType(action);
    setNote("");
    setReviewOpen(true);
  };

  const handleDecision = () => {
    if (!selected || !actionType) return;
    setApplications(prev =>
      prev.map(a =>
        a.id === selected.id
          ? { ...a, status: actionType === "approve" ? "approved" : "rejected", reviewNote: note }
          : a
      )
    );
    log(`${actionType === "approve" ? "Approved" : "Rejected"} org application ${selected.id}`, selected.name);
    toast[actionType === "approve" ? "success" : "error"](
      `${selected.name} ${actionType === "approve" ? "approved" : "rejected"}.`
    );
    setReviewOpen(false);
    setSelected(null);
  };

  const StatusBadge = ({ status }: { status: OrgApplication["status"] }) => {
    const map = {
      pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300",
      approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300",
      rejected: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-300",
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${map[status]}`}>
        {status === "pending" && <Clock className="w-3 h-3" />}
        {status === "approved" && <CheckCircle2 className="w-3 h-3" />}
        {status === "rejected" && <XCircle className="w-3 h-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AdminPage
      title="Organisation Approvals"
      description="Review and approve or reject partner organisation registration requests."
      exportName="org-applications"
      exportRows={applications as unknown as Record<string, unknown>[]}
    >
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending Review", count: pending.length, color: "text-amber-500", icon: Clock },
          { label: "Approved", count: approved.length, color: "text-emerald-500", icon: CheckCircle2 },
          { label: "Rejected", count: rejected.length, color: "text-red-500", icon: XCircle },
        ].map(({ label, count, color, icon: Icon }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-muted grid place-items-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["ID", "Organisation", "Type", "City", "Contact", "Submitted", "Candidates", "Volunteers", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left p-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b last:border-0 border-border hover:bg-accent/50 transition-colors"
                >
                  <td className="p-3 text-muted-foreground font-mono text-xs">{app.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {app.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                      </div>
                      <span className="font-medium">{app.name}</span>
                    </div>
                  </td>
                  <td className="p-3"><Badge variant="outline">{app.type}</Badge></td>
                  <td className="p-3 text-muted-foreground">{app.city}</td>
                  <td className="p-3">
                    <div className="text-xs space-y-0.5">
                      <p className="font-medium">{app.contactName}</p>
                      <p className="text-muted-foreground">{app.contactEmail}</p>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{app.submittedAt}</td>
                  <td className="p-3 text-center font-semibold">{app.candidatesCount || "—"}</td>
                  <td className="p-3 text-center font-semibold">{app.volunteersCount || "—"}</td>
                  <td className="p-3"><StatusBadge status={app.status} /></td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => { setSelected(app); setReviewOpen(false); }}
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {app.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="h-7 px-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => openAction(app, "approve")}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2"
                            onClick={() => openAction(app, "reject")}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detail panel when selected without action */}
      {selected && !reviewOpen && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center text-white font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selected.name}</h3>
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {[
                  { icon: Building2, label: "Type", value: selected.type },
                  { icon: Globe, label: "Website", value: selected.website || "—" },
                  { icon: MapPin, label: "City", value: selected.city },
                  { icon: Phone, label: "Phone", value: selected.contactPhone },
                  { icon: Mail, label: "Email", value: selected.contactEmail },
                  { icon: FileCheck2, label: "Document", value: selected.licenseFile },
                  { icon: Users, label: "Candidates", value: String(selected.candidatesCount) },
                  { icon: Users, label: "Volunteers", value: String(selected.volunteersCount) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selected.reviewNote && (
                <div className="p-3 rounded-lg bg-muted/30 text-sm">
                  <p className="text-xs text-muted-foreground mb-1">Review Note</p>
                  <p>{selected.reviewNote}</p>
                </div>
              )}
              {selected.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => openAction(selected, "approve")}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button variant="destructive" onClick={() => openAction(selected, "reject")}>
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Approve / Reject Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Organisation
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? `You are about to approve "${selected?.name}". They will gain access to the partner portal.`
                : `You are about to reject "${selected?.name}". Please provide a reason.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="review-note">
              {actionType === "approve" ? "Note (optional)" : "Rejection Reason *"}
            </Label>
            <Textarea
              id="review-note"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={
                actionType === "approve"
                  ? "Any internal notes for this approval…"
                  : "Explain why this application is being rejected…"
              }
              className="mt-2"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDecision}
              disabled={actionType === "reject" && !note.trim()}
              className={actionType === "approve" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}
              variant={actionType === "reject" ? "destructive" : "default"}
            >
              {actionType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
