import { useState } from "react";
import { Check, X, FileText, ExternalLink, Calendar, Search } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CustomExamRequest {
  id: string;
  candidateName: string;
  customTitle: string;
  board: string;
  examDate: string;
  admitCardUrl: string;
  status: "pending" | "approved" | "rejected";
}

const initialRequests: CustomExamRequest[] = [
  { id: "CER-101", candidateName: "Devika Rao", customTitle: "TPO Semester III Practical", board: "JNTU Hyderabad", examDate: "2026-09-12", admitCardUrl: "#", status: "pending" },
  { id: "CER-102", candidateName: "Rohan Deshpukh", customTitle: "Scribe Skill Test v2", board: "MIT Academy", examDate: "2026-09-18", admitCardUrl: "#", status: "pending" },
  { id: "CER-103", candidateName: "Siddharth Sen", customTitle: "West Bengal Clerkship Phase 1", board: "WBPSC", examDate: "2026-09-25", admitCardUrl: "#", status: "pending" },
  { id: "CER-104", candidateName: "Aarti Mehra", customTitle: "National Music Theory Level 4", board: "Trinity Guildhall", examDate: "2026-10-02", admitCardUrl: "#", status: "pending" },
];

export default function CustomExams() {
  const [requests, setRequests] = useState<CustomExamRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (id: string, title: string) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: "approved" as const } : r));
    toast.success(`Approved "${title}" and added to the master exam registry.`);
  };

  const handleReject = (id: string, title: string) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: "rejected" as const } : r));
    toast.error(`Rejected exam request: "${title}"`);
  };

  const activeRequests = requests.filter(
    (r) =>
      r.status === "pending" &&
      (r.customTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.board.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminPage
      title="Unlisted Exam Approvals"
      description="Review candidate requests to add custom/unlisted examinations to the platform registry. Ensure details match official admit cards."
    >
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Approval Queue</CardTitle>
              <CardDescription>Verify and authorize custom exam definitions</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/20">
                <tr>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Candidate</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Requested Exam Title</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Board / Institution</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Exam Date</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Documents</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No pending custom exam approval requests found.
                    </td>
                  </tr>
                ) : (
                  activeRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-3 font-medium">{r.candidateName}</td>
                      <td className="p-3">
                        <div className="font-semibold text-foreground">{r.customTitle}</div>
                        <div className="text-xs text-muted-foreground">Request ID: {r.id}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">{r.board}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{r.examDate}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 flex items-center gap-1 mx-auto h-8">
                          <FileText className="w-4 h-4" />
                          <span>Admit Card</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-2.5 h-8"
                            onClick={() => handleApprove(r.id, r.customTitle)}
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                            onClick={() => handleReject(r.id, r.customTitle)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
