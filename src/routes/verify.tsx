import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InkAvatar, InkUnderline } from "@/components/ink";
import { toast } from "sonner";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Confirm your match — SCRIBE Connect" },
      {
        name: "description",
        content:
          "Share your one-time code with your scribe at the exam centre to confirm the match in person.",
      },
      { property: "og:title", content: "Confirm your match — SCRIBE Connect" },
      {
        property: "og:description",
        content: "A large, clear one-time code with a countdown, for confirming in person.",
      },
    ],
  }),
  component: Verify,
});

function Verify() {
  const [code, setCode] = useState("482 913");
  const [left, setLeft] = useState(300);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (confirmed) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [confirmed]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  const regenerate = () => {
    const n = String(Math.floor(100000 + Math.random() * 900000));
    setCode(`${n.slice(0, 3)} ${n.slice(3)}`);
    setLeft(300);
    toast.success("New code generated");
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:py-20">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          At the exam centre
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Read this code aloud</h1>
        <InkUnderline className="mx-auto mt-2 h-4 w-48" />

        <div className="mt-6 flex items-center justify-center gap-3">
          <InkAvatar initials="R.K." size={48} />
          <p className="text-sm text-muted-foreground">
            Your scribe <span className="font-semibold text-foreground">R. K.</span> is waiting to
            enter it.
          </p>
        </div>

        <p
          className="mt-8 font-mono text-5xl font-semibold tracking-[0.15em] text-foreground sm:text-6xl"
          aria-label={`Your one time code is ${code.split("").join(" ")}`}
        >
          {code}
        </p>

        <p className="mt-4 font-mono text-lg text-muted-foreground" aria-live="polite">
          Expires in {mm}:{ss}
        </p>

        <div className="mx-auto mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-accent transition-all duration-1000"
            style={{ width: `${(left / 300) * 100}%` }}
          />
        </div>

        {confirmed ? (
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-soft px-4 py-2 text-sm font-medium text-verified">
            <ShieldCheck className="size-4" aria-hidden="true" /> Match confirmed. Good luck today.
          </p>
        ) : (
          <Button
            size="lg"
            className="mt-8 h-14 w-full rounded-lg text-base"
            disabled={left === 0}
            onClick={() => setConfirmed(true)}
          >
            Confirm my scribe is here
          </Button>
        )}

        <Button variant="ghost" className="mt-3 rounded-lg" onClick={regenerate}>
          <RefreshCcw aria-hidden="true" /> Generate a new code
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Trouble at the centre?{" "}
        <Link to="/dashboard" className="underline underline-offset-4 hover:text-accent">
          Open your dashboard
        </Link>{" "}
        or call <span className="font-mono">1800 000 4321</span>.
      </p>
    </div>
  );
}