import { FileText } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdmin, inr, Donation } from "@/store/useAdmin";
import { toast } from "sonner";

function receipt(d: Donation) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${d.receiptNo}</title>
  <style>body{font-family:system-ui,sans-serif;padding:48px;color:#111}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:24px}td{padding:10px 0;border-bottom:1px solid #e5e5e5}td:last-child{text-align:right;font-weight:600}
  .head{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #0f766e;padding-bottom:12px}small{color:#666}</style></head>
  <body><div class="head"><h1>Write For Me</h1><small>Donation receipt ${d.receiptNo}</small></div>
  <table>
    <tr><td>Donor</td><td>${d.donor}</td></tr>
    <tr><td>Donor type</td><td>${d.type}</td></tr>
    <tr><td>Date</td><td>${d.date}</td></tr>
    <tr><td>Cause</td><td>${d.cause}</td></tr>
    <tr><td>Amount</td><td>${inr(d.amount)}</td></tr>
    <tr><td>Reference</td><td>${d.id}</td></tr>
  </table>
  <p><small>This is a system-generated receipt issued by Write For Me for the donation above.</small></p>
  </body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${d.receiptNo.replace(/\//g, "-")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Donations() {
  const { donations } = useAdmin();
  const total = donations.reduce((a, d) => a + d.amount, 0);

  return (
    <AdminPage
      title="Donations"
      description="Incoming contributions from NGOs, corporates and individual donors, with downloadable receipts."
      exportName="donations"
      exportRows={donations as unknown as Record<string, unknown>[]}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total received</p><p className="text-2xl font-display font-bold mt-1">{inr(total)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Donors</p><p className="text-2xl font-display font-bold mt-1">{donations.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Largest gift</p><p className="text-2xl font-display font-bold mt-1">{inr(Math.max(...donations.map((d) => d.amount)))}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Donation ledger</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{["Receipt", "Date", "Donor", "Type", "Cause", "Amount", ""].map((h) => (
                <th key={h} className="text-left p-3 font-medium">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b last:border-0 border-border">
                  <td className="p-3 font-mono text-xs text-muted-foreground">{d.receiptNo}</td>
                  <td className="p-3">{d.date}</td>
                  <td className="p-3 font-medium">{d.donor}</td>
                  <td className="p-3"><Badge variant="secondary">{d.type}</Badge></td>
                  <td className="p-3">{d.cause}</td>
                  <td className="p-3 font-semibold">{inr(d.amount)}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" onClick={() => { receipt(d); toast.success("Receipt generated"); }}>
                      <FileText className="w-4 h-4 mr-2" /> Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
