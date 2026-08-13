import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/store/useUser";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [role, setRole] = useState<"candidate" | "volunteer" | "contributor">("candidate");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDigiLockerLogin = async () => {
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

      const response = await axios.get(
        `${apiBaseUrl}/auth/digilocker/initiate?role=${role}`
      );

      const { url } = response.data;

      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not obtain authorization URL.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("DigiLocker login error:", error);
      toast.error(
        error.response?.data?.error || "Failed to launch DigiLocker authentication."
      );
      setLoading(false);
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, name.trim() || "Friend");
    navigate(role === "contributor" ? "/donate" : "/welcome");
  };

  return (
    <Layout>
      <section className="py-24 md:py-32 container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-card p-8 rounded-2xl shadow-sm border"
        >
          <div className="text-center mb-8">
            <span className="section-label mb-4">Welcome Back</span>
            <h1 className="text-3xl font-display font-bold mt-4">Log In</h1>
          </div>
          
          <form className="space-y-4" onSubmit={handleStandardSubmit}>
            <div>
              <Label htmlFor="loginname">Your Name</Label>
              <Input
                id="loginname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="email">Email / Phone</Label>
              <Input id="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label htmlFor="loginrole">Log in as</Label>
              <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                <SelectTrigger id="loginrole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="volunteer">Volunteer / Scribe</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" size="lg" type="submit">
              Log In
            </Button>

            {role !== "contributor" && (
              <div className="pt-2">
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDigiLockerLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 mr-2" />
                  )}
                  {loading ? "Connecting to DigiLocker..." : "Log in with DigiLocker"}
                </Button>
              </div>
            )}
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Login;