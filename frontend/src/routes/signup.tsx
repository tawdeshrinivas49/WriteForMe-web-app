import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { InkAvatar, InkGlyph, InkUnderline } from "@/components/ink";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your profile — SCRIBE Connect" },
      {
        name: "description",
        content:
          "Join SCRIBE Connect in a few short steps: one question per screen, Aadhaar verification and a private, initials-only profile.",
      },
      { property: "og:title", content: "Create your profile — SCRIBE Connect" },
      {
        property: "og:description",
        content: "A calm, one-question-at-a-time sign-up for candidates, volunteers and donors.",
      },
    ],
  }),
  component: SignUp,
});

type Data = {
  role: string;
  name: string;
  dob: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  education: string;
  gender: string;
  disability: string;
  aadhaar: string;
  otp: string;
  terms: boolean;
  password: string;
  confirm: string;
};

const empty: Data = {
  role: "",
  name: "",
  dob: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  education: "",
  gender: "",
  disability: "",
  aadhaar: "",
  otp: "",
  terms: false,
  password: "",
  confirm: "",
};

const roles = [
  { k: "candidate", t: "Candidate", d: "I need a scribe for an exam" },
  { k: "volunteer", t: "Volunteer", d: "I want to write for someone" },
  { k: "contributor", t: "Contributor", d: "I want to fund exam-day costs" },
  { k: "organization", t: "Organization", d: "We coordinate for a centre" },
];

function initialsOf(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "??"
  );
}

function SignUp() {
  const [data, setData] = useState<Data>(empty);
  const [step, setStep] = useState(0);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const set = (k: keyof Data, v: string | boolean) => setData((d) => ({ ...d, [k]: v }));

  const isCandidate = data.role === "candidate";

  const steps = useMemo(
    () =>
      [
        "role",
        "address",
        "education",
        ...(isCandidate ? ["disability"] : []),
        "aadhaar",
        "password",
        "done",
      ] as const,
    [isCandidate],
  );

  const current = steps[Math.min(step, steps.length - 1)]!;
  const progress = (step / (steps.length - 1)) * 100;

  const canContinue = () => {
    switch (current) {
      case "role":
        return !!data.role;
      case "address":
        return (
          data.name.trim().length > 1 &&
          !!data.dob &&
          !!data.city &&
          !!data.state &&
          /^\d{6}$/.test(data.pincode)
        );
      case "education":
        return !!data.education && !!data.gender;
      case "disability":
        return !!data.disability;
      case "aadhaar":
        return aadhaarVerified && data.terms;
      case "password":
        return data.password.length >= 8 && data.password === data.confirm;
      default:
        return true;
    }
  };

  const next = () => {
    if (!canContinue()) return;
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
        Step {Math.min(step + 1, steps.length)} of {steps.length}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Create your profile</h1>

      {/* hand-drawn progress line */}
      <div className="mt-4" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Sign-up progress">
        <svg viewBox="0 0 600 20" className="h-5 w-full" aria-hidden="true" preserveAspectRatio="none">
          <path
            d="M4 14c96-6 190-9 296-8 104 1 196 4 296 9"
            className="ink-path"
            strokeWidth="3"
            style={{ stroke: "var(--border)" }}
          />
          <path
            d="M4 14c96-6 190-9 296-8 104 1 196 4 296 9"
            className="ink-path"
            strokeWidth="4"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: 600 - (progress / 100) * 600,
              transition: "stroke-dashoffset .6s ease",
            }}
          />
        </svg>
      </div>

      <div key={current} className="animate-soft-rise mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        {current === "role" && (
          <fieldset>
            <legend className="font-display text-2xl font-semibold">
              First — who are you joining as?
            </legend>
            <InkUnderline className="mt-1 h-3 w-32" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {roles.map((r) => (
                <button
                  key={r.k}
                  type="button"
                  aria-pressed={data.role === r.k}
                  onClick={() => set("role", r.k)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                    data.role === r.k ? "border-accent bg-secondary" : "border-border hover:border-accent"
                  }`}
                >
                  <span className="text-teal">
                    <InkGlyph kind={r.k} className="h-10 w-10" />
                  </span>
                  <span>
                    <span className="block font-semibold">{r.t}</span>
                    <span className="block text-sm text-muted-foreground">{r.d}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {current === "address" && (
          <div>
            <h2 className="font-display text-2xl font-semibold">Tell us where to find you</h2>
            <InkUnderline className="mt-1 h-3 w-32" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={data.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="dob">Date of birth</Label>
                <Input id="dob" type="date" className="font-mono" value={data.dob} onChange={(e) => set("dob", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">City of residence</Label>
                <Input id="city" value={data.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={data.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="country">Country / nationality</Label>
                <Input id="country" value={data.country} onChange={(e) => set("country", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pin">PIN code</Label>
                <Input
                  id="pin"
                  inputMode="numeric"
                  className="font-mono"
                  value={data.pincode}
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  aria-describedby="pin-hint"
                />
                <p id="pin-hint" className="mt-1 text-xs text-muted-foreground">
                  Six digits. Used only to find nearby volunteers.
                </p>
              </div>
            </div>
          </div>
        )}

        {current === "education" && (
          <div>
            <h2 className="font-display text-2xl font-semibold">A little about you</h2>
            <InkUnderline className="mt-1 h-3 w-32" />
            <fieldset className="mt-6">
              <legend className="text-sm font-medium">Highest education qualification</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Class 10", "Class 12", "Graduate", "Post-graduate", "Doctorate"].map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={data.education === o}
                    onClick={() => set("education", o)}
                    className={`rounded-full border-2 px-4 py-2 text-sm transition-colors ${
                      data.education === o ? "border-accent bg-accent text-accent-foreground" : "border-border"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="text-sm font-medium">Gender</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Woman", "Man", "Non-binary", "Prefer not to say"].map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={data.gender === o}
                    onClick={() => set("gender", o)}
                    className={`rounded-full border-2 px-4 py-2 text-sm transition-colors ${
                      data.gender === o ? "border-accent bg-accent text-accent-foreground" : "border-border"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {current === "disability" && (
          <div>
            <h2 className="font-display text-2xl font-semibold">What support do you need?</h2>
            <InkUnderline className="mt-1 h-3 w-32" />
            <p className="mt-3 text-sm text-muted-foreground">
              This helps us match a scribe who has worked with similar needs before.
            </p>
            <div className="mt-5 grid gap-2">
              {[
                "Blindness or low vision",
                "Locomotor / upper-limb disability",
                "Cerebral palsy",
                "Dysgraphia or learning disability",
                "Temporary injury",
                "Other",
              ].map((o) => (
                <button
                  key={o}
                  type="button"
                  aria-pressed={data.disability === o}
                  onClick={() => set("disability", o)}
                  className={`rounded-lg border-2 px-4 py-3 text-left text-sm transition-colors ${
                    data.disability === o ? "border-accent bg-secondary" : "border-border hover:border-accent"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        {current === "aadhaar" && (
          <div>
            <h2 className="font-display text-2xl font-semibold">Verify your identity</h2>
            <InkUnderline className="mt-1 h-3 w-32" />
            <p className="mt-3 text-sm text-muted-foreground">
              Every person on SCRIBE Connect is Aadhaar-verified. Your number is never shown to
              anyone else.
            </p>
            <div className="mt-6">
              <Label htmlFor="aadhaar">Aadhaar number</Label>
              <Input
                id="aadhaar"
                inputMode="numeric"
                className="font-mono tracking-[0.2em]"
                placeholder="0000 0000 0000"
                value={data.aadhaar}
                onChange={(e) => set("aadhaar", e.target.value.replace(/\D/g, "").slice(0, 12))}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="a-otp">One-time code sent to your linked mobile</Label>
              <Input
                id="a-otp"
                inputMode="numeric"
                className="font-mono tracking-[0.4em]"
                placeholder="000000"
                value={data.otp}
                onChange={(e) => set("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-4 rounded-lg"
              disabled={data.aadhaar.length !== 12 || data.otp.length !== 6}
              onClick={() => {
                setAadhaarVerified(true);
                toast.success("Aadhaar verified");
              }}
            >
              Verify Aadhaar
            </Button>
            {aadhaarVerified && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1 text-sm text-verified">
                <ShieldCheck className="size-4" aria-hidden="true" /> Identity verified
              </p>
            )}
            <div className="mt-6 flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={data.terms}
                onCheckedChange={(v) => set("terms", v === true)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed font-normal">
                I accept the terms of service, the volunteer code of conduct and the privacy policy.
              </Label>
            </div>
          </div>
        )}

        {current === "password" && (
          <div>
            <h2 className="font-display text-2xl font-semibold">Set a password</h2>
            <InkUnderline className="mt-1 h-3 w-32" />
            <div className="mt-6 grid gap-4">
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input
                  id="pw"
                  type="password"
                  autoComplete="new-password"
                  value={data.password}
                  onChange={(e) => set("password", e.target.value)}
                  aria-describedby="pw-hint"
                />
                <p id="pw-hint" className="mt-1 text-xs text-muted-foreground">
                  At least 8 characters.
                </p>
              </div>
              <div>
                <Label htmlFor="pw2">Confirm password</Label>
                <Input
                  id="pw2"
                  type="password"
                  autoComplete="new-password"
                  value={data.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                />
                {data.confirm && data.confirm !== data.password && (
                  <p className="mt-1 text-xs text-destructive">Passwords don't match yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {current === "done" && (
          <div className="text-center">
            <InkAvatar initials={initialsOf(data.name)} size={96} className="mx-auto" />
            <h2 className="mt-5 font-display text-2xl font-semibold">
              Welcome, {initialsOf(data.name)}
            </h2>
            <InkUnderline className="mx-auto mt-1 h-3 w-32" />
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
              For your privacy, others only ever see your initials and this drawn avatar — never
              your name or photo.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-lg">
                <Link to="/request">Request a scribe</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-lg">
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </div>
        )}

        {current !== "done" && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              className="rounded-lg"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ArrowLeft aria-hidden="true" /> Back
            </Button>
            <Button type="button" className="rounded-lg" disabled={!canContinue()} onClick={next}>
              {current === "password" ? (
                <>
                  Finish <Check aria-hidden="true" />
                </>
              ) : (
                <>
                  Continue <ArrowRight aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}