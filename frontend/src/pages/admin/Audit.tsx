import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent } from "@/components/ui/card";
import { useAdmin } from "@/store/useAdmin";

export default function Audit() {
  const { audit } = useAdmin();

  return (
    <AdminPage
      title="Audit log"
      description="Who did what, and when. Every moderation, verification and adjustment action is recorded here."
      exportName="audit-log"
      exportRows={audit as unknown as Record<string, unknown>[]}
    >
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{["When", "Admin", "Action", "Target"].map((h) => <th key={h} className="text-left p-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {audit.map((a) => (
                <tr key={a.id} className="border-b last:border-0 border-border">
                  <td className="p-3 text-muted-foreground whitespace-nowrap">{new Date(a.at).toLocaleString()}</td>
                  <td className="p-3">{a.admin}</td>
                  <td className="p-3 font-medium">{a.action}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{a.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
