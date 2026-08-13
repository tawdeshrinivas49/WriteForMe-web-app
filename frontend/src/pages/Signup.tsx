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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/store/useUser";
import { toast } from "sonner";
import { BadgeCheck, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";

type Role = "candidate" | "volunteer" | "contributor" | "";

const disabilityTypes = [
  "Visual Impairment",
  "Hearing Impairment",
  "Locomotor Disability",
  "Intellectual Disability",
  "Multiple Disabilities",
  "Other",
];

const languages = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Malayalam",
  "Kannada",
  "Punjabi",
];

const educationLevels = [
  "10th Pass",
  "12th Pass",
  "Graduate",
  "Post Graduate",
  "Doctorate",
];

function AadhaarVerify({ role }: { role: Role }) {
  const { aadhaarVerified } = useUser();
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);
    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

      const response = await axios.get(
        `${apiBaseUrl}/auth/digilocker/initiate?role=${role}`
      );

      const { url } = response.data;

      if (url) {
        // Redirect user to Setu / DigiLocker authorization screen
        window.location.href = url;
      } else {
        toast.error("Could not obtain authorization URL from server.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("DigiLocker initiation error:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to connect to DigiLocker service. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-muted/40 p-5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-teal flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold">Verify by Aadhaar / DigiLocker</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            We fetch your identity and certificates straight from DigiLocker. Your Aadhaar number is never stored.
          </p>
          {aadhaarVerified ? (
            <p className="flex items-center gap-2 text-teal font-medium text-sm">
              <BadgeCheck className="w-5 h-5" /> Verified via DigiLocker
            </p>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={verify}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4 mr-2" />
              )}
              {loading ? "Connecting to DigiLocker…" : "Verify with DigiLocker"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const Signup = () => {
  const [role, setRole] = useState<Role>("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { login, aadhaarVerified } = useUser();

  const needsAadhaar = role === "candidate" || role === "volunteer";
  const canContinue = role !== "" && (!needsAadhaar || aadhaarVerified);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    login(role as Exclude<Role, "">, name.trim() || "Friend");
    navigate(role === "contributor" ? "/donate" : "/welcome");
  };

  return (
    <Layout>
      <section className="py-24 md:py-32 container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-card p-8 md:p-10 rounded-2xl shadow-sm border"
        >
          <div className="text-center mb-8">
            <span className="section-label mb-4">Get Started</span>
            <h1 className="text-3xl font-display font-bold mt-4">Create Account</h1>
            <p className="text-muted-foreground mt-2">
              Join Write For Me as a candidate, volunteer, or contributor.
            </p>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            <div>
              <Label htmlFor="role">I am a</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="volunteer">Volunteer / Scribe</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  maxLength={100}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {role === "contributor" && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="c-phone">Phone</Label>
                  <Input
                    id="c-phone"
                    type="tel"
                    maxLength={15}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="c-email">Email</Label>
                  <Input
                    id="c-email"
                    type="email"
                    maxLength={255}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}

            {role !== "contributor" && role !== "" && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Email / Phone</Label>
                    <Input
                      id="phone"
                      maxLength={255}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    maxLength={300}
                    placeholder="Street address, city, state, pincode"
                  />
                </div>
                <AadhaarVerify role={role} />
              </>
            )}

            {role === "candidate" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-5 overflow-hidden"
              >
                <div>
                  <Label htmlFor="disability">Type of Disability</Label>
                  <Select>
                    <SelectTrigger id="disability">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {disabilityTypes.map((t) => (
                        <SelectItem key={t} value={t.toLowerCase()}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edu">Educational Qualification</Label>
                  <Select>
                    <SelectTrigger id="edu">
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((e) => (
                        <SelectItem key={e} value={e.toLowerCase()}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pwd-cert">
                    PwD Certificate (auto-fetched from DigiLocker, or upload)
                  </Label>
                  <Input id="pwd-cert" type="file" />
                </div>
                <div>
                  <Label htmlFor="preferred-lang">Preferred Language</Label>
                  <Select>
                    <SelectTrigger id="preferred-lang">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => (
                        <SelectItem key={l} value={l.toLowerCase()}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {role === "volunteer" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-5 overflow-hidden"
              >
                <div>
                  <Label htmlFor="vol-edu">Educational Qualification</Label>
                  <Select>
                    <SelectTrigger id="vol-edu">
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((e) => (
                        <SelectItem key={e} value={e.toLowerCase()}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Languages Known</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {languages.slice(0, 6).map((l) => (
                      <div key={l} className="flex items-center gap-2">
                        <Checkbox id={`lang-${l}`} />
                        <Label
                          htmlFor={`lang-${l}`}
                          className="font-normal text-sm"
                        >
                          {l}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="terms" />
              <Label
                htmlFor="terms"
                className="font-normal text-sm leading-snug"
              >
                I agree to the code of conduct and understand that my
                information will be verified for safety.
              </Label>
            </div>

            {needsAadhaar && !aadhaarVerified && (
              <p className="text-sm text-muted-foreground">
                Aadhaar / DigiLocker verification is required before you can
                continue.
              </p>
            )}

            <Button
              className="w-full"
              size="lg"
              type="submit"
              disabled={!canContinue}
            >
              Continue
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Signup;