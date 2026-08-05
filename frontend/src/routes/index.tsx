import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InkAvatar, InkConnector, InkGlyph, InkUnderline, SectionTitle } from "@/components/ink";
import hero from "@/assets/hero-illustration.jpg";
import t1 from "@/assets/t1.jpg";
import t2 from "@/assets/t2.jpg";
import t3 from "@/assets/t3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SCRIBE Connect — Access. Empower. Equalise." },
      {
        name: "description",
        content:
          "Connecting exam candidates with verified volunteer scribes, transport help and donation support — warm, private and accessible by design.",
      },
      { property: "og:title", content: "SCRIBE Connect — Access. Empower. Equalise." },
      {
        property: "og:description",
        content: "Verified scribes, transport help and community support for exam candidates.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { n: "12,480", l: "Exams supported" },
  { n: "6,300", l: "Verified volunteers" },
  { n: "148", l: "Cities covered" },
  { n: "98%", l: "On-time match rate" },
];

const steps = [
  { n: "01", t: "Verify", d: "Aadhaar-backed identity check for every candidate and volunteer." },
  { n: "02", t: "Request", d: "Tell us the exam, the date and whether you need transport too." },
  { n: "03", t: "Get matched", d: "We find a nearby verified scribe who fits your subject." },
  { n: "04", t: "Confirm", d: "Meet at the centre and confirm with a one-time code." },
];

const audiences = [
  { k: "candidate", t: "Candidate", d: "Ask for a scribe, add transport, track your match." },
  { k: "volunteer", t: "Volunteer", d: "Offer a few hours. Get verified. Change a life." },
  { k: "contributor", t: "Contributor", d: "Fund travel, stationery and centre-day costs." },
  { k: "organization", t: "Organization", d: "Coordinate scribes for a whole exam centre." },
];

const testimonials = [
  {
    img: t1,
    name: "Aarushi M.",
    role: "Candidate, UPSC Prelims",
    q: "For the first time I walked into an exam hall calm. My scribe had practised with me twice before the day.",
  },
  {
    img: t2,
    name: "Rohan K.",
    role: "Volunteer scribe",
    q: "Three hours of my Sunday. It's the most useful thing I do all month.",
  },
  {
    img: t3,
    name: "Sunita R.",
    role: "Teacher & coordinator",
    q: "We arranged scribes for 40 students at one centre without a single phone call chain.",
  },
];

const faqs = [
  {
    q: "Who can request a scribe?",
    a: "Any candidate with a certified disability or temporary injury who is permitted a writing assistant by their exam board. Upload your admit card and we handle the rest.",
  },
  {
    q: "How are volunteers verified?",
    a: "Every volunteer completes Aadhaar identity verification, an education check and a short scribe-conduct orientation before they can be matched.",
  },
  {
    q: "Is my personal information visible to volunteers?",
    a: "No. Until you confirm the match at the exam centre with a one-time code, volunteers see only your initials, distance and exam subject.",
  },
  {
    q: "Does it cost anything?",
    a: "SCRIBE Connect is free for candidates. Travel and stationery costs are covered by contributors where needed.",
  },
  {
    q: "Can I get help reaching the centre?",
    a: "Yes — add transport support in the same request form. We arrange an accessible ride or a companion volunteer.",
  },
];

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
          <InkConnector className="absolute left-0 top-1/3 h-64 w-[140%] text-accent" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2">
          <div className="animate-soft-rise">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
              Exam-day support, made human
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold sm:text-6xl">
              ACCESS
              <br />
              EMPOWER
              <br />
              <span className="text-accent">EQUALISE</span>
            </h1>
            <InkUnderline className="mt-2 h-4 w-64" />
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
              A steady hand on an important day. We connect candidates who need a writing assistant
              with verified volunteers nearby — plus transport help and community funding.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-lg">
                <Link to="/request">Request a scribe</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-lg">
                <Link to="/signup">Volunteer as a scribe</Link>
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-verified" aria-hidden="true" />
              Aadhaar-verified volunteers · Identity stays private until you confirm
            </p>
          </div>
          <div className="animate-ink-float">
            <img
              src={hero}
              alt="Line drawing of a person steadying another's hand as they write on an exam paper"
              width={1200}
              height={900}
              className="w-full rounded-xl border border-border bg-card"
            />
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section aria-labelledby="impact" className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 id="impact" className="sr-only">
            Our impact
          </h2>
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd>
                  <span className="block font-mono text-3xl font-semibold text-accent sm:text-4xl">
                    {s.n}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{s.l}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section aria-labelledby="how" className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle eyebrow="How it works">Four steps, start to finish</SectionTitle>
        <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 hidden lg:block">
            <InkConnector className="h-24 text-accent opacity-50" />
          </li>
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent"
            >
              <span className="font-mono text-sm text-accent">{s.n}</span>
              <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
              <InkUnderline className="mt-1 h-3 w-24" />
              <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WHO IT'S FOR */}
      <section aria-labelledby="who" className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="Who it's for">Everyone has a part to play</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <Link
                key={a.k}
                to="/signup"
                className="group rounded-xl border border-border bg-card p-6 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="text-teal transition-colors group-hover:text-accent-foreground">
                  <InkGlyph kind={a.k} />
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{a.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground transition-colors group-hover:text-accent-foreground">
                  {a.d}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section aria-labelledby="about" className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle eyebrow="About us">Why we exist</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-8">
            <h3 className="font-display text-2xl font-semibold">Our vision</h3>
            <InkUnderline className="mt-1 h-3 w-32" />
            <p className="mt-4 text-muted-foreground">
              A country where no one misses an examination because they could not find someone to
              write with them. Access should never depend on who you happen to know.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-8">
            <h3 className="font-display text-2xl font-semibold">Our mission</h3>
            <InkUnderline className="mt-1 h-3 w-32" />
            <p className="mt-4 text-muted-foreground">
              To build the most trusted, private and genuinely usable scribe network in India —
              verified end to end, free for candidates, and designed with disabled users at every
              step, not after the fact.
            </p>
          </article>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section aria-labelledby="voices" className="overflow-hidden border-y border-border bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="Voices">People who've been through it</SectionTitle>
        </div>
        <div className="group relative">
          <ul className="flex w-max animate-marquee gap-6 px-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <li
                key={i}
                className="w-[19rem] shrink-0 rounded-xl border border-border bg-card p-6 sm:w-[24rem]"
              >
                <Quote className="size-5 text-accent" aria-hidden="true" />
                <blockquote className="mt-3 text-sm text-foreground">“{t.q}”</blockquote>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={t.img}
                    alt={`Portrait of ${t.name}`}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="size-12 rounded-full border border-border object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TRUST */}
      <section aria-labelledby="trust" className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle eyebrow="Trust &amp; verification">Safety is the product</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              t: "Aadhaar identity check",
              d: "Every volunteer and candidate is verified against a government ID before matching.",
            },
            {
              t: "Privacy until confirmation",
              d: "Only initials, distance and a trust badge are shared. Full details unlock at the centre.",
            },
            {
              t: "One-time code handshake",
              d: "The match is only completed when both people confirm a shared OTP in person.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border-2 border-teal/30 bg-card p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1 text-xs font-medium text-verified">
                <ShieldCheck className="size-3.5" aria-hidden="true" /> Verified
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-4 rounded-xl border border-border bg-card p-6">
          <InkAvatar initials="AM" size={56} />
          <p className="text-sm text-muted-foreground">
            This is how you appear to others: initials and a drawn avatar only. Your name, photo and
            contact number are never shown before you confirm.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="mx-auto max-w-3xl px-4 pb-20">
        <SectionTitle eyebrow="FAQ">Questions people ask us</SectionTitle>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`i${i}`}>
              <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-xl border border-border bg-secondary/50 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">Ready when you are</h2>
          <InkUnderline className="mx-auto mt-1 h-3 w-40" />
          <p className="mt-3 text-sm text-muted-foreground">
            Sign up takes about four minutes, one question at a time.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-lg">
            <Link to="/signup">Create your profile</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
