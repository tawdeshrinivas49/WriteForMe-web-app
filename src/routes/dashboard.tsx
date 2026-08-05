import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, CalendarDays, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InkAvatar, InkUnderline, SectionTitle } from "@/components/ink";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — SCRIBE Connect" },
      {
        name: "description",
        content:
          "Track your upcoming exam, scribe match, transport and contributions — one clear action per card.",
      },
      { property: "og:title", content: "Your dashboard — SCRIBE Connect" },
      {
        property: "og:description",
        content: "A calm overview of your exam-day support.",
      },
    ],
  }),
  component: Dashboard,
});

const cards = [
  {
    icon: CalendarDays,
    label: "Next exam",
    value: "12 Sep",
    sub: "SSC CGL Tier 1 · 09:30 AM",
    action: "View request",
    to: "/request" as const,
    verified: false,
  },
  {
    icon: Users,
    label: "Scribe match",
    value: "R. K.",
    sub: "2.4 km away · Aadhaar verified",
    action: "Confirm with code",
    to: "/verify" as const,
    verified: true,
  },
  {
    icon: Bus,
    label: "Transport",
    value: "Booked",
    sub: "Pick-up 08:15 AM · accessible cab",
    action: "Change pick-up",
    to: "/request" as const,
    verified: true,
  },
  {
    icon: HeartHandshake,
    label: "Support received",
    value: "₹1,200",
    sub: "From 3 contributors",
    action: "Say thank you",
    to: "/dashboard" as const,
    verified: false,
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <InkAvatar initials="AM" size={64} />
          <div>
            <h1 className="font-display text-3xl font-semibold">Hello, A. M.</h1>
            <InkUnderline className="mt-1 h-3 w-32" />
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1 text-xs font-medium text-verified">
              <ShieldCheck className="size-3.5" aria-hidden="true" /> Verified candidate
            </p>
          </div>
        </div>
        <Button asChild className="rounded-lg">
          <Link to="/request">New request</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <section
            key={c.label}
            className={`rounded-xl border bg-card p-6 ${c.verified ? "border-teal/40" : "border-border"}`}
            aria-labelledby={`card-${c.label}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id={`card-${c.label}`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <c.icon className="size-4 text-accent" aria-hidden="true" />
                {c.label}
              </h2>
              {c.verified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1 text-xs font-medium text-verified">
                  <ShieldCheck className="size-3.5" aria-hidden="true" /> Verified
                </span>
              )}
            </div>
            <p className="mt-3 font-mono text-3xl font-semibold">{c.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.sub}</p>
            <Button asChild variant="outline" className="mt-5 w-full rounded-lg">
              <Link to={c.to}>{c.action}</Link>
            </Button>
          </section>
        ))}
      </div>

      <div className="mt-14">
        <SectionTitle eyebrow="Recent">Activity</SectionTitle>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {[
            ["Match accepted by R. K.", "Today, 10:12"],
            ["Admit card read successfully", "Today, 10:04"],
            ["Transport request added", "Yesterday, 18:40"],
            ["Aadhaar verification completed", "3 Sep, 12:20"],
          ].map(([t, when]) => (
            <li key={t} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
              <span className="text-sm">{t}</span>
              <span className="font-mono text-xs text-muted-foreground">{when}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}