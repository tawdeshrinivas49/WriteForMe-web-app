import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InkAvatar, InkConnector, InkUnderline, InkWriting } from "@/components/ink";

export const Route = createFileRoute("/matching")({
  head: () => ({
    meta: [
      { title: "Finding your scribe — SCRIBE Connect" },
      {
        name: "description",
        content:
          "We're looking for a verified volunteer near you. You'll see initials, distance and a trust badge before any personal details.",
      },
      { property: "og:title", content: "Finding your scribe — SCRIBE Connect" },
      {
        property: "og:description",
        content: "Live matching status with a calm, hand-drawn waiting animation.",
      },
    ],
  }),
  component: Matching,
});

const beats = [
  "Looking for a volunteer near you…",
  "Checking who's verified for your subject…",
  "Confirming they're free on exam morning…",
  "Almost there — introducing you both…",
];

function Matching() {
  const [i, setI] = useState(0);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    if (matched) return;
    const t = setInterval(() => {
      setI((v) => {
        if (v >= beats.length - 1) {
          clearInterval(t);
          setTimeout(() => setMatched(true), 1500);
          return v;
        }
        return v + 1;
      });
    }, 2200);
    return () => clearInterval(t);
  }, [matched]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:py-20">
      {!matched ? (
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold">{beats[i]}</h1>
          <InkUnderline className="mx-auto mt-2 h-4 w-52" />

          <div className="mt-10 rounded-xl border border-border bg-card p-8">
            <InkWriting label="Our ink is still moving. This usually takes under two minutes." />
            <InkConnector className="mt-6 h-28" />
          </div>

          <ol className="mx-auto mt-8 grid max-w-sm gap-3 text-left">
            {beats.map((b, idx) => (
              <li
                key={b}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                  idx <= i ? "border-accent bg-secondary/60" : "border-border text-muted-foreground"
                }`}
              >
                <span className="font-mono text-xs text-accent">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                {b}
              </li>
            ))}
          </ol>

          <p aria-live="polite" className="sr-only">
            {beats[i]}
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            While you wait: keep your admit card handy — you'll need it at the centre.
          </p>
        </div>
      ) : (
        <div className="animate-soft-rise text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Match found</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Someone said yes</h1>
          <InkUnderline className="mx-auto mt-2 h-4 w-44" />

          <div className="mt-8 rounded-xl border-2 border-teal/40 bg-card p-8 text-left">
            <div className="flex items-center gap-4">
              <InkAvatar initials="R.K." size={72} />
              <div>
                <p className="font-display text-2xl font-semibold">R. K.</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" aria-hidden="true" />
                  <span className="font-mono">2.4 km</span> away · Graduate, Science stream
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1 text-xs font-medium text-verified">
                <ShieldCheck className="size-3.5" aria-hidden="true" /> Aadhaar verified
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                <Star className="size-3.5 text-accent" aria-hidden="true" /> 14 exams supported
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs">
                Trust score 4.9
              </span>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Full name and contact details unlock once you both confirm the one-time code at the
              exam centre.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-lg">
              <Link to="/verify">Accept and get my code</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg" onClick={() => { setMatched(false); setI(0); }}>
              Find someone else
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}