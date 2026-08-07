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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [role, setRole] = useState<"candidate" | "volunteer" | "contributor">("candidate");
  const [name, setName] = useState("");

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
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login(role, name.trim() || "Friend");
              navigate(role === "contributor" ? "/donate" : "/welcome");
            }}
          >
            <div>
              <Label htmlFor="loginname">Your Name</Label>
              <Input id="loginname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={100} />
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
                <SelectTrigger id="loginrole"><SelectValue /></SelectTrigger>
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
