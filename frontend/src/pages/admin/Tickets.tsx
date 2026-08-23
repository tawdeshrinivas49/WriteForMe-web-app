import { useMemo, useState } from "react";
import { AlertOctagon } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin, sinceLabel, TicketStatus } from "@/store/useAdmin";
import { toast } from "sonner";

const statuses: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];
const label = (s: TicketStatus) => s.replace("_", " ");

export default function Tickets() {
  const { tickets, setTicketStatus } = useAdmin();
  const [filter, setFilter] = useState("all");
  const [resolving, setResolving] = useState<{ id: string; status: TicketStatus } | null>(null);
  const [note, setNote] = useState("");

  const rows = useMemo(
    () => tickets.filter((t) => (filter === "all" ? true : filter === "urgent" ? t.priority === "urgent" : t.status === filter)),
    [tickets, filter]
  );

  const change = (id: string, status: TicketStatus) => {
    if (status === "resolved" || status === "closed") {
      setResolving({ id, status });
      setNote("");
      return;
    }
    setTicketStatus(id, status);
    toast.success(`Ticket ${id} moved to ${label(status)}`);
  };

  const confirm = () => {
    if (!resolving) return;
    if (!note.trim()) return toast.error("Add a resolution note");
    setTicketStatus(resolving.id, resolving.status, note.trim());
    toast.success(`Ticket ${resolving.id} ${label(resolving.status)}`);
    setResolving(null);
  };

  return (
    <AdminPage
      title="Support tickets"
      description="Issues raised by candidates, volunteers and donors. Urgent exam-day cases are highlighted."
      exportName={`tickets-${filter}`}
      exportRows={rows.map(({ id, raisedBy, role, category, subject, priority, status, openedAt, note: n }) => ({
        id, raisedBy, role, category, subject, priority, status, openedAt, note: n ?? "",
      }))}
      actions={
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      <div className="space-y-3">
        {rows.map((t) => (
          <Card
            key={t.id}
            className={t.priority === "urgent" && t.status !== "closed" ? "border-coral border-l-4 bg-coral/5" : ""}
          >
            <CardContent className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {t.priority === "urgent" && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertOctagon className="w-3 h-3" /> Urgent · ongoing exam
                    </Badge>
                  )}
                  <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                  <Badge variant="secondary">{t.category}</Badge>
                </div>
                <p className="font-medium mt-2">{t.subject}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.detail}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Raised by <span className="font-medium text-foreground">{t.raisedBy}</span> ({t.role}) · open {sinceLabel(t.openedAt)}
                </p>
                {t.note && <p className="text-xs mt-2 p-2 rounded bg-muted">Resolution note: {t.note}</p>}
              </div>
              <div className="lg:w-48 shrink-0">
                <Select value={t.status} onValueChange={(v) => change(t.id, v as TicketStatus)}>
                  <SelectTrigger aria-label={`Status for ${t.id}`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => <SelectItem key={s} value={s}>{label(s)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No tickets in this view.</p>}
      </div>

      <Dialog open={!!resolving} onOpenChange={(o) => !o && setResolving(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add a note before {resolving?.status === "closed" ? "closing" : "resolving"}</DialogTitle></DialogHeader>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was done to resolve this?" rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolving(null)}>Cancel</Button>
            <Button onClick={confirm}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
