import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/useUser";
import { toast } from "sonner";
import {
  Phone, Mail, MapPin, Languages, GraduationCap, Star, ShieldCheck,
  KeyRound, LifeBuoy, CheckCircle2,
} from "lucide-react";

const criteria = ["speed", "patience", "neatness", "politeness"] as const;

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} aria-label={`${i} stars`}>
          <Star className={`w-6 h-6 ${i <= value ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
        </button>
      ))}
    </div>
  );
}

const Match = () => {
  const { role, request, matchFound, sessionStarted, sessionEnded, startSession, endSession, addHistory } = useUser();
  const isVolunteer = role === "volunteer";

  const person = isVolunteer
    ? {
        name: "Aarav Nair",
        role: "Candidate · Visual impairment (100%)",
        detail: "B.Com Graduate",
        languages: "English, Hindi, Malayalam",
        area: "Kothrud, Pune · 3.2 km away",
        phone: "+91 98200 41122",
        email: "aarav.n@example.com",
        score: 4.9,
      }
    : {
        name: "Meera Iyer",
        role: "Verified Scribe · 46 sessions",
        detail: "B.Sc. Student (below candidate's qualification)",
        languages: "English, Hindi, Marathi",
        area: "Kothrud, Pune · 3.2 km away",
        phone: "+91 98200 55231",
        email: "meera.i@example.com",
        score: 4.8,
      };

  const [startOtp, setStartOtp] = useState("");
  const [endOtp, setEndOtp] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviewed, setReviewed] = useState(false);

  const candidateStartOtp = "482913";
  const candidateEndOtp = "735204";

  const submitReview = () => {
    addHistory({
      id: `s-${Date.now()}`,
      date: request?.examDate || new Date().toISOString().slice(0, 10),
      exam: request?.examName || "Exam session",
      counterpart: person.name,
      speed: ratings.speed ?? 0,
      patience: ratings.patience ?? 0,
      neatness: ratings.neatness ?? 0,
      politeness: ratings.politeness ?? 0,
      status: "completed",
    });
    setReviewed(true);
    toast.success("Review submitted — trust score updated");
  };

  if (!matchFound) {
    return (
      <Layout>
        <section className="py-24 container-narrow text-center">
          <h1 className="text-3xl font-display font-bold mb-4">No active match</h1>
          <p className="text-muted-foreground mb-8">Submit a request and we will pair you with a verified partner.</p>
          <Button asChild><Link to="/request">Start a request</Link></Button>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-20 container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <span className="section-label mb-4">Matched</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-4">
              You have been matched with {person.name}
            </h1>
            <p className="text-muted-foreground mt-3">
              Full details are now unlocked for both sides. Contact them to confirm the plan.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal" /> {isVolunteer ? "Candidate" : "Scribe"} details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://i.pravatar.cc/120?u=${encodeURIComponent(person.name)}`}
                    alt={`Portrait of ${person.name}`}
                    className="w-20 h-20 rounded-full object-cover border"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-xl font-bold">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.role}</p>
                    <Badge className="mt-2">Trust score {person.score} / 5</Badge>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-teal" /> {person.detail}</p>
                  <p className="flex items-center gap-2"><Languages className="w-4 h-4 text-teal" /> {person.languages}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal" /> {person.area}</p>
                  <p className="flex items-center gap-2"><Star className="w-4 h-4 text-teal" /> Verified via DigiLocker</p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild><a href={`tel:${person.phone.replace(/\s/g, "")}`}><Phone className="w-4 h-4 mr-2" />Call</a></Button>
                  <Button variant="outline" asChild><a href={`mailto:${person.email}`}><Mail className="w-4 h-4 mr-2" />Email</a></Button>
                  <Button variant="outline" asChild><Link to="/emergency"><LifeBuoy className="w-4 h-4 mr-2" />Emergency support</Link></Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5" /> Exam session (OTP)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm">
                {!isVolunteer && (
                  <div className="rounded-xl bg-secondary p-4">
                    <p className="font-medium mb-2">Your OTPs</p>
                    <p>Start: <span className="font-mono text-lg tracking-widest">{candidateStartOtp}</span></p>
                    <p>End: <span className="font-mono text-lg tracking-widest">{candidateEndOtp}</span></p>
                    <p className="text-xs text-muted-foreground mt-2">Share the start OTP before the exam and the end OTP once you finish.</p>
                  </div>
                )}
                {!sessionStarted ? (
                  <div className="space-y-2">
                    <Label htmlFor="sotp">Enter start OTP from candidate</Label>
                    <Input id="sotp" value={startOtp} onChange={(e) => setStartOtp(e.target.value)} placeholder="6-digit OTP" />
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (startOtp === candidateStartOtp) { startSession(); toast.success("Session started"); }
                        else toast.error("Invalid start OTP");
                      }}
                    >
                      Start session
                    </Button>
                  </div>
                ) : !sessionEnded ? (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-teal font-medium"><CheckCircle2 className="w-4 h-4" /> Session in progress</p>
                    <Label htmlFor="eotp">Enter end OTP from candidate</Label>
                    <Input id="eotp" value={endOtp} onChange={(e) => setEndOtp(e.target.value)} placeholder="6-digit OTP" />
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (endOtp === candidateEndOtp) { endSession(); toast.success("Session closed — marked Successful Exam"); }
                        else toast.error("Invalid end OTP");
                      }}
                    >
                      End session
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-teal/40 bg-teal/5 p-4">
                    <p className="font-semibold text-teal flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Successful exam</p>
                    <p className="text-muted-foreground mt-1">Recorded in both profiles and added to the trust score.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {sessionEnded && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Rate your {isVolunteer ? "candidate" : "scribe"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {reviewed ? (
                  <p className="text-teal font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Thank you — your review is recorded in the history.
                  </p>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {criteria.map((c) => (
                        <div key={c} className="flex items-center justify-between rounded-xl border p-4">
                          <span className="capitalize font-medium">{c}</span>
                          <Stars value={ratings[c] ?? 0} onChange={(v) => setRatings((r) => ({ ...r, [c]: v }))} />
                        </div>
                      ))}
                    </div>
                    <Button onClick={submitReview} disabled={criteria.some((c) => !ratings[c])}>
                      Submit review
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      You can also <Link to="/hall-of-fame" className="text-primary hover:underline">leave a review for the platform</Link>.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default Match;
