import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/store/useAdmin";
import { toast } from "sonner";

export default function Verifications() {
  const { verifications, decideVerification } = useAdmin();
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const pending = verifications.filter((v) => v.status === "pending");
  const decided = verifications.filter((v) => v.status !== "pending");

  const decide = (id: string, status: "approved" | "rejected") => {
    const reason = reasons[id]?.trim() ?? "";
    if (status === "rejected" && !reason) return toast.error("Give a reason for rejection");
    decideVerification(id, status, reason || "Manually matched by admin");
    toast.success(`Verification ${id} ${status}`);
  };

  return (
    <AdminPage
      title="Manual verification"
      description="Documents where automatic OCR matching failed. Compare the scan against what the system read, then approve or reject."
      exportName="manual-verifications"
      exportRows={verifications.map(({ id, name, role, docType, submittedAt, status, reason }) => ({
        id, name, role, docType, submittedAt, status, reason: reason ?? "",
      }))}
    >
      <div className="space-y-5">
        {pending.map((v) => (
          <Card key={v.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">
                {v.name} <span className="text-muted-foreground font-normal">· {v.role} · {v.docType}</span>
              </CardTitle>
              <Badge variant="secondary">{v.id} · {v.submittedAt}</Badge>
            </CardHeader>
            <CardContent className="grid gap-5 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Uploaded document</p>
                <img
                  src={v.docImage}
                  alt={`${v.docType} uploaded by ${v.name}`}
                  loading="lazy"
                  className="w-full h-56 object-cover rounded-md border border-border"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">OCR read vs declared</p>
                <div className="rounded-md border border-border overflow-hidden">
                  {Object.keys(v.declared).map((k) => {
                    const mismatch = v.ocr[k] !== v.declared[k];
                    return (
                      <div key={k} className={`grid grid-cols-3 gap-2 px-3 py-2 text-sm border-b last:border-0 border-border ${mismatch ? "bg-coral/10" : ""}`}>
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-mono text-xs self-center">{v.ocr[k]}</span>
                        <span className="self-center">{v.declared[k]}</span>
                      </div>
                    );
                  })}
                </div>
                <Textarea
                  className="mt-3"
                  rows={2}
                  placeholder="Note or rejection reason"
                  value={reasons[v.id] ?? ""}
                  onChange={(e) => setReasons((r) => ({ ...r, [v.id]: e.target.value }))}
                />
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => decide(v.id, "approved")}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => decide(v.id, "rejected")}>
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {pending.length === 0 && <p className="text-sm text-muted-foreground">No documents waiting for manual review.</p>}

        {decided.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Recently decided</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {decided.map((v) => (
                <div key={v.id} className="flex items-center justify-between gap-3 text-sm border-b last:border-0 border-border py-2">
                  <span>{v.name} · {v.docType}</span>
                  <span className="text-muted-foreground text-xs flex-1 truncate">{v.reason}</span>
                  <Badge variant={v.status === "approved" ? "default" : "destructive"}>{v.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPage>
  );
}
