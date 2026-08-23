import { useState } from "react";
import { Check, X, FileText, RefreshCw, Calendar, Search } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LegacyApprovalRequest {
  id: string;
  volunteerName: string;
  email: string;
  passingYear: number;
  rollNumber: string;
  status: "pending" | "approved" | "rejected";
}

const initialRequests: LegacyApprovalRequest[] = [
  { id: "LVR-901", volunteerName: "Vijay Kumar", email: "vijay.k@gmail.com", passingYear: 2008, rollNumber: "10-B-49281", status: "pending" },
  { id: "LVR-902", volunteerName: "Sunita Deshmukh", email: "sunita.d@rediffmail.com", passingYear: 2011, rollNumber: "MSB-8839201", status: "pending" },
  { id: "LVR-903", volunteerName: "John D'Souza", email: "j.dsouza@outlook.com", passingYear: 2005, rollNumber: "K-0291-88", status: "pending" },
  { id: "LVR-904", volunteerName: "Harpreet Singh", email: "happy.singh@yahoo.com", passingYear: 2013, rollNumber: "CBSE-883912", status: "pending" },
];

export default function LegacyApprovals() {
  const [requests, setRequests] = useState<LegacyApprovalRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (id: string, name: string) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: "approved" as const } : r));
    toast.success(`Volunteer "${name}" approved. Credentials synced to registry.`);
  };

  const handleReject = (id: string, name: string) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: "rejected" as const } : r));
    toast.error(`Rejected credentials for volunteer: "${name}"`);
  };

  const activeRequests = requests.filter(
    (r) =>
      r.status === "pending" &&
      (r.volunteerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminPage
      title="Legacy Marksheet Approvals"
      description="Review and manually verify 10th-grade class passing marksheet certificates for older/legacy volunteers whose details cannot be auto-fetched from DigiLocker databases."
    >
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Legacy Queue</CardTitle>
              <CardDescription>Manually check certificate uploads for volunteers born before 2000</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search legacy queue..."
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
                  <th className="text-left p-3 font-semibold text-muted-foreground">Volunteer</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Roll / Reg Number</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Passing Year</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Uploaded Certificate</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No pending legacy marksheet verification requests found.
                    </td>
                  </tr>
                ) : (
                  activeRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-foreground">{r.volunteerName}</div>
                        <div className="text-xs text-muted-foreground">{r.email}</div>
                      </td>
                      <td className="p-3 font-mono text-xs">{r.rollNumber}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{r.passingYear}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 flex items-center gap-1 mx-auto h-8">
                          <FileText className="w-4 h-4" />
                          <span>View Marksheet PDF</span>
                        </Button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-2.5 h-8"
                            onClick={() => handleApprove(r.id, r.volunteerName)}
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                            onClick={() => handleReject(r.id, r.volunteerName)}
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
