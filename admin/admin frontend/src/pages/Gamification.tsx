import { useState } from "react";
import { Trophy } from "lucide-react";
import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdmin } from "@admin/store/useAdmin";
import { toast } from "sonner";

export default function Gamification() {
  const { volunteers, adjustPoints } = useAdmin();
  const [open, setOpen] = useState<string | null>(null);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");

  const save = () => {
    const n = Number(delta);
    if (!open) return;
    if (!Number.isFinite(n) || n === 0) return toast.error("Enter a non-zero adjustment");
    if (!reason.trim()) return toast.error("A reason is required for every manual adjustment");
    adjustPoints(open, n, reason.trim());
    toast.success("Points adjusted and logged");
    setOpen(null); setDelta(""); setReason("");
  };

  return (
    <AdminPage
      title="Gamification control"
      description="Points, levels and badges earned by volunteers. Manual adjustments require a written reason and are written to the audit log."
      exportName="gamification"
      exportRows={volunteers.map(({ id, name, points, level, trustScore, badges }) => ({ id, name, points, level, trustScore, badges: badges.join(" | ") }))}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {volunteers.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.id} · {v.city} · trust {v.trustScore}%</p>
                </div>
                <Badge className="gap-1"><Trophy className="w-3 h-3" /> {v.level}</Badge>
              </div>
              <p className="text-3xl font-display font-bold mt-3">{v.points} <span className="text-sm font-sans font-normal text-muted-foreground">points</span></p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {v.badges.length ? v.badges.map((b) => <Badge key={b} variant="secondary">{b}</Badge>)
                  : <span className="text-xs text-muted-foreground">No badges yet</span>}
              </div>
              <Button size="sm" variant="outline" className="mt-4" onClick={() => setOpen(v.id)}>Adjust points</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Manual points adjustment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delta">Adjustment (use a minus sign to deduct)</Label>
              <Input id="delta" type="number" value={delta} onChange={(e) => setDelta(e.target.value)} placeholder="e.g. 150 or -75" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (required)</Label>
              <Textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain the dispute and why this change was made" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>Cancel</Button>
            <Button onClick={save}>Apply adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
