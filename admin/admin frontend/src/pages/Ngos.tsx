import { useNavigate } from "react-router-dom";
import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdmin, inr } from "@admin/store/useAdmin";

export default function Ngos() {
  const navigate = useNavigate();
  const { ngos } = useAdmin();

  return (
    <AdminPage
      title="NGOs connected"
      description="Partner organisations, the volunteers they bring in and what they have contributed. Select a row to see their donations."
      exportName="ngos"
      exportRows={ngos as unknown as Record<string, unknown>[]}
    >
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Organisation", "City", "Contact", "Email", "Partner since", "Volunteers", "Contributed", "Status"].map((h) => (
                  <th key={h} className="text-left p-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ngos.map((n) => (
                <tr key={n.id} className="border-b last:border-0 border-border hover:bg-accent/50 cursor-pointer" onClick={() => navigate("/admin/donations")}>
                  <td className="p-3 font-medium">{n.name}</td>
                  <td className="p-3">{n.city}</td>
                  <td className="p-3">{n.contact}</td>
                  <td className="p-3 text-muted-foreground">{n.email}</td>
                  <td className="p-3 text-muted-foreground">{n.since}</td>
                  <td className="p-3">{n.volunteers}</td>
                  <td className="p-3 font-semibold">{inr(n.contributed)}</td>
                  <td className="p-3"><Badge variant={n.status === "active" ? "default" : "secondary"}>{n.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
