# SCRIBE Connect — Design Doc

**Direction name: "The Steady Hand"**

Your own design review nailed the problem: strong bones, government-portal skin. The fix isn't more polish on the current direction — it's a different one. Below is the reasoning, then the system you build from, covering the full product (candidate, volunteer, contributor, organization/NGO, admin).

---

## 1. Why a new direction, not a cleanup

Two ruts most redesigns fall into right now: (1) warm cream background + high-contrast serif + terracotta accent, or (2) near-black background + single neon accent. Neither fits this product. A scribe platform's entire premise is a steady, trustworthy hand helping someone through a high-stakes moment — the design should *feel* like that, not like a generic SaaS dashboard or startup landing page template.

**The one thing this product is actually about:** a person writes on behalf of another person, at a moment that matters, and a stranger becomes reliable in the space of one exam. Everything visual traces back to that — across every stakeholder surface, not just the candidate-facing screens.

## 2. Signature element: The Steady Line

One hand-drawn ink stroke — a single confident pen line, slightly imperfect, like something written by hand rather than rendered by a computer. It shows up as:
- The underline beneath section headings (drawn on scroll-in, not static)
- The "connector" in the matching animation — two short lines, candidate and volunteer, drawing toward each other and joining when a match confirms
- The progress track in onboarding steps, the OTP handshake screen, and the transport-confirmation step
- A loading state (the line writes itself instead of a spinner)
- The impact-dashboard visual for contributors — funds "drawn" into outcomes rather than a generic bar chart

This is the one place you spend visual boldness. Everything else stays quiet and disciplined around it.

## 3. Color system

| Token | Hex | Role |
|---|---|---|
| `ink` | `#1B2A4A` | Primary text, dark UI surfaces — deep navy-ink, not black, echoes handwriting ink rather than "tech dark mode" |
| `paper` | `#FAF6EF` | Background — warm off-white like exam paper, not stark white |
| `signal` | `#E8A33D` | Primary CTA, active states — amber, reads as "in progress / attention" |
| `trust` | `#2F6B63` | Verified badges, confirmed states, secondary actions |
| `moss` | `#4C7A4A` | Success states only (kept distinct from `trust` so "verified" and "succeeded" don't visually collide) |
| `rust` | `#C0503A` | Errors, warnings — muted clay-red, serious without being alarmist |

**High-contrast mode:** pure `#000000` / `#FFFFFF`, `#FFD400` for focus rings, `#00B0FF` reserved only for focus outlines. Built as its own token set from day one, not a tweaked light theme.

## 4. Typography

- **Display — Fraunces (variable, soft optical size):** headlines only, used sparingly. Warmth and a slightly handwritten character in its curves without sacrificing legibility.
- **Body / UI — IBM Plex Sans:** everything a user reads to act on. Strong multi-script support, which matters directly since multi-language ships as part of this build, not later.
- **Utility / Mono — IBM Plex Mono:** OTP codes, roll numbers, timestamps, transport ETAs, donation amounts. Monospace here is functional, not decorative — numbers that must be read correctly get a face built for scanning.

Type scale (base 16px, 1.25 ratio): 16 / 20 / 25 / 31 / 39 / 49 / 61px. Headlines use Fraunces at 39–61, body stays Plex Sans at 16–20.

**Localization note:** since multiple languages ship as part of this build, no string gets baked into a component as a fixed-width assumption — build every button/label/card to reflow gracefully for scripts that run 30–40% longer than English (a common gap for Hindi/Marathi UI copy).

## 5. Layout system

- **8pt spacing grid**, no exceptions.
- **Radius:** 12px cards, 8px inputs/buttons, 999px (pill) only for status badges/tags — shape communicates category.
- **Numbered steps** are justified only where sequence is real: "How It Works," onboarding progress, the transport+scribe confirmation checklist. Not used decoratively on parallel content like stakeholder cards — use icon + label there instead.

## 6. Page-by-page direction

### Landing Page
Hero opens with the **matching animation itself** — two steady lines drawing toward each other and joining — looping behind a short, human headline ("Every candidate deserves a steady hand"). Thesis shown, not told.
Sections: Hero → How It Works (numbered, real sequence) → Who It's For (Candidate / Volunteer / Contributor / Organization — icon-led, not numbered) → Trust & Verification (DigiLocker/OCR made tangible) → Impact Metrics (real numbers only — placeholder metrics read as templated) → Success Stories → FAQ → Footer.

### Onboarding (multi-step, per role)
Full-screen steps on mobile, Steady Line as the progress track. One question group per screen. Exit/save-and-continue always visible.

### Request Screen (Scribe + Transport, combined)
One request flow, not two separate silos: candidate picks exam details, then optionally adds transport in the same form — because on exam day these are one trip, not two products. Status view shows both tracks (scribe match / transport match) side by side, each with its own Steady Line progress state.

### Matching / Live Status Screen
Candidate sees a live status, not a spinner: "Looking for volunteers near you" → Steady Line animates while searching → on match, the line joins and a card slides in with initials + distance + trust tier. Empty state gives a real next action (expand radius, get notified) — never just a sad illustration.

### OTP Handshake Screen
Treat like a boarding pass, not a form. Large mono-type OTP display, clear expiry countdown, one primary action. Failure states (expired, mismatch, no-show) each get a specific instruction, in the interface's voice.

### Contributor Flow
Donation screen: clear amount selection, Razorpay handoff, immediate confirmation. Impact dashboard uses the Steady Line motif reframed — lines connecting a donation to an outcome (candidates supported, exams completed) rather than a generic bar/pie chart, so it stays visually consistent with the rest of the product instead of looking like a bolted-on fintech widget. Donation history as a simple, scannable list — mono type for amounts and dates.

### Organization / NGO Dashboard
KPI cards up top (`trust` teal for verified/active states), candidate + volunteer management as two clearly separated tables/lists, bulk upload as a dedicated, low-anxiety flow (drag-drop CSV, clear validation errors row-by-row — not a single opaque "upload failed"). Reports/export as a secondary action, never competing visually with the primary management views.

### Admin Console
Verification queue is the default view on login — that's the highest-frequency task. Fraud/dispute flags get a distinct visual weight (`rust` accent, not buried in a generic table). Match oversight and analytics are separate tabs, not stacked on one dense screen.

## 7. Accessibility — built in at the component level

- Every interactive element has a visible focus ring using the high-contrast token, not a suppressed default outline.
- Color is never the only signal — trust tier, match status, and errors pair color with icon + text label.
- Font scaling doesn't break layout at 200% zoom — tested per component.
- `prefers-reduced-motion` respected: the Steady Line has a static equivalent (completed line, no draw animation).
- Screen-reader order follows visual order, verified with an actual NVDA/VoiceOver pass per page.
- Read-aloud and multi-language support are tested together — a screen reader announcing a partially-translated page is a real failure mode, not an edge case.

## 8. What makes this portfolio-standout

The signature interaction — the Steady Line — is a real, reusable component that shows up in matching, onboarding, the handshake screen, and the contributor impact view, so it reads as a systemic design decision, not a one-off hero animation. Paired with a rigorous, documented accessibility implementation (before/after contrast ratios, screen-reader test notes) and a genuinely multi-stakeholder product (five distinct roles, each with a coherent but distinct dashboard), this is a stronger case study than a single-persona SaaS redesign — show the range across roles, not just the prettiest screen.

## 9. Build order (frontend)

1. Design tokens (color, type, spacing) — light and high-contrast sets together, plus i18n string externalization from the start.
2. Steady Line component (SVG + draw animation, with static fallback) — five downstream screens depend on it.
3. Landing page hero + How It Works.
4. Onboarding flow shell (progress + step container), reused across Candidate/Volunteer/Organization.
5. Combined Request screen (scribe + transport) with live status states.
6. OTP handshake screen.
7. Contributor donation + impact dashboard.
8. Organization/NGO dashboard (KPI cards, management tables, bulk upload).
9. Admin console last — it reuses components from every surface above.
