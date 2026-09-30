import { useState } from "react";
import { UserPlus, Trash2, ShieldCheck } from "lucide-react";
import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin } from "@admin/store/useAdmin";
import { toast } from "sonner";

export default function Accounts() {
  const { admins, addAdmin, removeAdmin, adminEmail } = useAdmin();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Super admin" | "Moderator">("Moderator");

  const create = () => {
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) return toast.error("Enter a name and a valid email");
    if (admins.some((a) => a.email.toLowerCase() === email.toLowerCase())) return toast.error("That admin already exists");
    addAdmin(name.trim(), email.toLowerCase(), role);
    toast.success("Admin invited — they must set up 2FA on first sign in");
    setName(""); setEmail("");
  };

  return (
    <AdminPage
      title="Admin accounts"
      description="There is no public admin sign-up. Accounts can only be created here by an existing admin, and every account requires two-factor authentication."
      exportName="admin-accounts"
      exportRows={admins as unknown as Record<string, unknown>[]}
    >
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><UserPlus className="w-4 h-4" /> Create an admin account</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4 md:items-end">
          <div className="space-y-2">
            <Label htmlFor="ad-name">Full name</Label>
            <Input id="ad-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aditi Verma" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-email">Work email</Label>
            <Input id="ad-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@writeforme.org" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger id="ad-role"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Super admin">Super admin</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={create}>Send invite</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Existing admins</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{["Name", "Email", "Role", "2FA", "Added", ""].map((h) => <th key={h} className="text-left p-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-b last:border-0 border-border">
                  <td className="p-3 font-medium">{a.name}</td>
                  <td className="p-3 text-muted-foreground">{a.email}</td>
                  <td className="p-3"><Badge variant={a.role === "Super admin" ? "default" : "secondary"}>{a.role}</Badge></td>
                  <td className="p-3"><span className="inline-flex items-center gap-1 text-xs text-primary"><ShieldCheck className="w-3.5 h-3.5" /> Authenticator app</span></td>
                  <td className="p-3 text-muted-foreground">{a.added}</td>
                  <td className="p-3">
                    <Button
                      size="icon" variant="ghost" aria-label={`Revoke ${a.name}`}
                      disabled={a.email === adminEmail}
                      onClick={() => { removeAdmin(a.id); toast("Admin access revoked"); }}
                    >
                      <Trash2 className="w-4 h-4" />
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
