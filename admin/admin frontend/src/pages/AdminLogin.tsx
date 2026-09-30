import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAdmin } from "@admin/store/useAdmin";
import { toast } from "sonner";
import { AccessibilityToolbar } from "@/components/AccessibilityToolbar";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, admins, log } = useAdmin();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const submitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      toast.error("Enter your admin email and password");
      return;
    }
    if (!admins.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      toast.error("No admin account exists for this email");
      return;
    }
    setStep(2);
  };

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code from your authenticator app");
      return;
    }
    login(email.toLowerCase());
    log("Signed in to admin panel", email.toLowerCase());
    navigate("/admin");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 px-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <AccessibilityToolbar />
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="border-border">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 grid place-items-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">Admin sign in</CardTitle>
            <p className="text-sm text-muted-foreground">
              Restricted area. Admin accounts are created by existing admins only.
            </p>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={submitCredentials} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin email</Label>
                  <Input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@writeforme.org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full">Continue</Button>
                <p className="text-xs text-muted-foreground text-center">
                  Demo: admin@writeforme.org · any password (6+ chars) · any 6-digit code
                </p>
              </form>
            ) : (
              <form onSubmit={submitCode} className="space-y-5">
                <div className="text-center space-y-1">
                  <Lock className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Two-factor verification</p>
                  <p className="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>
                </div>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button type="submit" className="w-full">Verify and sign in</Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>Back</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
