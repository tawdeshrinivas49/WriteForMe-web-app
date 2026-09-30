import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdmin, inr } from "@admin/store/useAdmin";

export default function Payments() {
  const { payments } = useAdmin();
  const collected = payments.reduce((a, p) => a + p.collected, 0);
  const paid = payments.reduce((a, p) => a + p.payout, 0);

  return (
    <AdminPage
      title="Exam payments"
      description="Money collected from candidates for exam support and payouts made to volunteers. Donations are tracked separately."
      exportName="exam-payments"
      exportRows={payments as unknown as Record<string, unknown>[]}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Collected from candidates</p><p className="text-2xl font-display font-bold mt-1">{inr(collected)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Paid out to volunteers</p><p className="text-2xl font-display font-bold mt-1">{inr(paid)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Pending settlements</p><p className="text-2xl font-display font-bold mt-1">{payments.filter((p) => p.status === "pending").length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Transactions</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{["ID", "Date", "Candidate", "Volunteer", "Exam", "Collected", "Payout", "Status"].map((h) => (
                <th key={h} className="text-left p-3 font-medium">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0 border-border">
                  <td className="p-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="p-3">{p.date}</td>
                  <td className="p-3">{p.candidate}</td>
                  <td className="p-3">{p.volunteer}</td>
                  <td className="p-3">{p.exam}</td>
                  <td className="p-3">{inr(p.collected)}</td>
                  <td className="p-3 font-semibold">{inr(p.payout)}</td>
                  <td className="p-3"><Badge variant={p.status === "settled" ? "default" : p.status === "refunded" ? "destructive" : "secondary"}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
