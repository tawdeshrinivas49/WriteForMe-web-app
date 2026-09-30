import { useState } from "react";
import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@admin/store/useAdmin";
import { toast } from "sonner";

const order = { high: 0, medium: 1, low: 2 } as const;

export default function Flags() {
  const { flags, setFlagStatus } = useAdmin();
  const [filter, setFilter] = useState("all");

  const rows = [...flags]
    .filter((f) => (filter === "all" ? true : f.priority === filter))
    .sort((a, b) => order[a.priority] - order[b.priority]);

  return (
    <AdminPage
      title="Suspicious pattern flags"
      description="Automatically detected behaviour that needs a human look — no-shows, unusually short sessions, repeated OTP failures and over-frequent pairings."
      exportName={`flags-${filter}`}
      exportRows={rows.map(({ id, type, subject, detail, priority, detectedAt, status }) => ({ id, type, subject, detail, priority, detectedAt, status }))}
      actions={
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="high">High</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      <div className="space-y-3">
        {rows.map((f) => (
          <Card key={f.id} className={f.priority === "high" && f.status === "open" ? "border-l-4 border-coral" : ""}>
            <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={f.priority === "high" ? "destructive" : f.priority === "medium" ? "default" : "secondary"}>
                    {f.priority} priority
                  </Badge>
                  <span className="font-medium">{f.type}</span>
                  <span className="text-xs font-mono text-muted-foreground">{f.id} · {f.detectedAt}</span>
                </div>
                <p className="text-sm mt-2">{f.subject}</p>
                <p className="text-sm text-muted-foreground mt-1">{f.detail}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {f.status === "open" ? (
                  <>
                    <Button size="sm" onClick={() => { setFlagStatus(f.id, "actioned"); toast.success(`${f.id} marked as actioned`); }}>
                      Take action
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setFlagStatus(f.id, "dismissed"); toast(`${f.id} dismissed`); }}>
                      Dismiss
                    </Button>
                  </>
                ) : (
                  <Badge variant="secondary">{f.status}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
