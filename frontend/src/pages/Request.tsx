import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser, isFullyVerified } from "@/store/useUser";
import { toast } from "sonner";
import { Lock, Upload, PenLine, Bus, Users } from "lucide-react";

type Need = "scribe" | "transport" | "both";

const Request = () => {
  const navigate = useNavigate();
  const state = useUser();
  const { role, setRequest } = state;
  const verified = isFullyVerified(state);
  const isVolunteer = role === "volunteer";

  const [need, setNeed] = useState<Need>(isVolunteer ? "scribe" : "both");
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [city, setCity] = useState("");
  const [admitCardName, setAdmitCardName] = useState<string | null>(null);

  const options: { key: Need; icon: typeof PenLine; title: string; desc: string }[] = isVolunteer
    ? [
        { key: "scribe", icon: PenLine, title: "Scribe only", desc: "Write the paper as dictated by the candidate." },
        { key: "transport", icon: Bus, title: "Transport only", desc: "Drive or accompany the candidate to the centre." },
        { key: "both", icon: Users, title: "Scribe + transport", desc: "Offer both services for the same exam." },
      ]
    : [
        { key: "scribe", icon: PenLine, title: "Scribe only", desc: "I need someone to write my paper." },
        { key: "transport", icon: Bus, title: "Transport only", desc: "I can write, I need help reaching the centre." },
        { key: "both", icon: Users, title: "Scribe + transport", desc: "I need both for this exam." },
      ];

  const canSubmit =
    verified && examName && examDate && city && (isVolunteer || need === "transport" || admitCardName);

  const submit = () => {
    setRequest({ needs: need, examName, examDate, city, admitCardName });
    toast.success(isVolunteer ? "Availability published" : "Request submitted");
    navigate("/waiting");
  };

  return (
    <Layout>
      <section className="py-16 md:py-24 container-narrow">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-10">
            <span className="section-label mb-4">{isVolunteer ? "Volunteer" : "Candidate"}</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-4">
              {isVolunteer ? "Offer to be a scribe" : "Request a scribe"}
            </h1>
            <p className="text-muted-foreground mt-3">
              {isVolunteer
                ? "Tell us what you can offer and where. We match you anonymously with a nearby candidate."
                : "Choose what you need, add your exam details, and we will find a verified match nearby."}
            </p>
          </div>

          {!verified && (
            <Card className="mb-8 border-destructive/40">
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 py-6">
                <Lock className="w-6 h-6 text-destructive flex-shrink-0" />
                <p className="flex-1 text-sm">
                  You are not fully verified yet. Complete the orientation
                  {isVolunteer ? " and the questionnaire" : ""} before you can{" "}
                  {isVolunteer ? "accept requests" : "request a scribe"}.
                </p>
                <Button asChild>
                  <Link to="/welcome">Complete orientation</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {options.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setNeed(o.key)}
                disabled={!verified}
                className={`text-left rounded-2xl border p-5 transition-all disabled:opacity-50 ${
                  need === o.key ? "border-primary bg-secondary shadow-sm" : "bg-card hover:-translate-y-0.5 hover:shadow"
                }`}
              >
                <o.icon className="w-6 h-6 text-teal mb-3" />
                <p className="font-bold mb-1">{o.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
              </button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Exam details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exam">Exam name</Label>
                  <Input id="exam" value={examName} disabled={!verified} onChange={(e) => setExamName(e.target.value)} placeholder="e.g. SSC CGL Tier I" />
                </div>
                <div>
                  <Label htmlFor="date">Exam date</Label>
                  <Input id="date" type="date" value={examDate} disabled={!verified} onChange={(e) => setExamDate(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="city">City / centre area</Label>
                <Input id="city" value={city} disabled={!verified} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Pune, Kothrud" />
              </div>

              {!isVolunteer && need !== "transport" && (
                <div>
                  <Label htmlFor="admit">Admit card upload (for exam detail cross-checking)</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Input
                      id="admit"
                      type="file"
                      accept="image/*,application/pdf"
                      disabled={!verified}
                      onChange={(e) => setAdmitCardName(e.target.files?.[0]?.name ?? null)}
                    />
                  </div>
                  {admitCardName && (
                    <p className="text-sm text-teal mt-2 flex items-center gap-2">
                      <Upload className="w-4 h-4" /> {admitCardName} attached
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-start gap-2">
                <Checkbox id="agree" disabled={!verified} />
                <Label htmlFor="agree" className="font-normal text-sm leading-snug">
                  I confirm these details match my admit card and I will follow the code of conduct.
                </Label>
              </div>

              <Button size="lg" className="w-full" disabled={!canSubmit} onClick={submit}>
                {isVolunteer ? "Publish availability" : "Find me a match"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Request;
