import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@admin/store/useAdmin";

export default function People({ kind }: { kind: "candidates" | "volunteers" }) {
  const navigate = useNavigate();
  const { candidates, volunteers } = useAdmin();
  const [q, setQ] = useState("");

  const data = (kind === "candidates" ? candidates : volunteers).filter(
    (p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.city.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AdminPage
      title={kind === "candidates" ? "Candidates" : "Volunteers"}
      description={kind === "candidates"
        ? "Everyone registered for scribe or transport support."
        : "Registered scribes and transport volunteers, with trust score and level."}
      exportName={kind}
      exportRows={data as unknown as Record<string, unknown>[]}
      actions={<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name or city" className="w-56" aria-label="Filter list" />}
    >
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">City</th>
                <th className="text-left p-3 font-medium">Phone</th>
                <th className="text-left p-3 font-medium">Exams</th>
                {kind === "volunteers" && <th className="text-left p-3 font-medium">Trust</th>}
                {kind === "volunteers" && <th className="text-left p-3 font-medium">Level</th>}
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-0 border-border hover:bg-accent/50 cursor-pointer"
                  onClick={() => navigate(kind === "volunteers" ? "/admin/gamification" : "/admin/verifications")}
                >
                  <td className="p-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.city}</td>
                  <td className="p-3 text-muted-foreground">{p.phone}</td>
                  <td className="p-3">{p.exams}</td>
                  {kind === "volunteers" && <td className="p-3">{(p as unknown as { trustScore: number }).trustScore}%</td>}
                  {kind === "volunteers" && <td className="p-3">{(p as unknown as { level: string }).level}</td>}
                  <td className="p-3">
                    <Badge variant={p.status === "verified" ? "default" : p.status === "suspended" ? "destructive" : "secondary"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
