# SCRIBE Connect — Product Requirements Document

**Status:** Draft v2 · **Owner:** Akshaa (Frontend) · **Scope:** Full product, single build (no phased deferral)

---

## 1. Problem

Exam candidates who need a scribe today rely on word-of-mouth, last-minute college coordination, or manual NGO spreadsheets. There's no verified, on-demand way to find a trustworthy scribe near you, arrange transport, confirm the match safely, and walk into the exam hall with logistics settled. SCRIBE Connect solves the entire examination journey — not just scribe discovery — through one accessible platform connecting candidates, volunteers, contributors, and organizations.

## 2. Goals

1. A candidate can register, verify identity, and post a scribe request tied to a specific exam.
2. A volunteer can register, get verified, and receive/accept nearby requests.
3. Matching happens by radius (geospatial), not manual admin pairing.
4. Both parties confirm the match safely at the exam center via OTP handshake — no phone numbers exchanged until confirmed.
5. Trust is visible through a credit/reputation score, not hidden admin notes.
6. Candidates can arrange transport to the exam center as part of the same flow.
7. Contributors can donate securely and see transparent impact reporting.
8. Organizations/NGOs can onboard candidates and volunteers in bulk and manage them without going through admin.
9. Admin has full oversight: verification, fraud detection, matching, disputes, reporting.
10. The entire flow — landing page through post-exam review — is usable end-to-end with a screen reader and keyboard only, in more than one language.

## 3. Stakeholders & Core Needs

| Stakeholder | Primary Need | Success Signal |
|---|---|---|
| **Candidate** | Find a verified scribe fast, arrange transport, zero ambiguity about next steps | Request → matched → confirmed in under a defined time window |
| **Volunteer** | See relevant nearby requests, build reputation, feel safe accepting | Low false-accepts, rising trust score, repeat volunteering |
| **Contributor** | Donate with confidence, see where money goes | Repeat donations, transparency-report engagement |
| **Organization / NGO** | Bulk onboard candidates/volunteers, oversee matches, basic reporting | Time saved vs. spreadsheet coordination |
| **Admin** | Verification queue, fraud flags, dispute resolution, full analytics | Time-to-verify, false-positive rate on fraud flags |

## 4. Core User Flows

**Candidate:**
Landing → Sign up → DigiLocker verification → OCR admit card upload → Create scribe request (exam, date, location, subject) → Request transport (optional, same flow) → Radius-based matching → Assignment confirmed → Calendar sync → Checklist → OTP handshake at center → Exam → Post-exam review → Reputation updated

**Volunteer:**
Sign up → DigiLocker verification → Training module → Set availability + radius → Receive request → Accept → Calendar sync → OTP handshake → Exam → Review → Reputation updated

**Contributor:**
Landing → Donate → Razorpay → Impact dashboard → Donation history

**Organization / NGO:**
Register → Verification → Dashboard → Bulk upload (candidates + volunteers) → Assign/oversee → Analytics → Reports/export

**Admin:**
Login → Verification queue → Matching oversight → Fraud/dispute flags → Reports → Analytics

## 5. Functional Requirements

### 5.1 Authentication & Verification
- Role-based signup (Candidate / Volunteer / Contributor / Organization / Admin)
- DigiLocker-based identity verification
- OCR extraction + validation of admit card details (exam name, date, roll number, center)

### 5.2 Matching Engine
- Radius-based request broadcasting to eligible volunteers
- Filters: subject familiarity, past rating, distance, availability window
- Live match status: pending → matched → confirmed

### 5.3 Transport
- Candidate can request transport alongside a scribe request, same form, same confirmation flow
- Transport status tracked alongside scribe match status (two parallel tracks converging on exam day, not a separate silo)

### 5.4 OTP Session Handshake
- Two-step OTP exchange at the point of physical meeting, before full contact info is revealed
- Explicit failure states: expired code, mismatch, no-show — each with a clear next action

### 5.5 Credit / Trust Score
- Volunteers earn score from: completed sessions, on-time arrival, positive reviews, consistency, training completion, emergency assistance
- Candidates earn a lighter version: early document upload, timely communication, completed reviews, updated profile
- NGOs earn score from: successful matches, active volunteers, community engagement
- Shown as tier/badge, not a raw gameable number: New Member → Trusted Volunteer → Community Champion → Emergency Hero

### 5.6 Privacy Model
- Only initials + distance + trust tier visible pre-match
- Full name/contact revealed only after confirmed match
- Past matched candidates/volunteers remain visible under a "Previous Exams" history
- Consent-based information sharing throughout

### 5.7 Notifications & Calendar
- In-app + push + WhatsApp notification on match status changes
- Google Calendar sync for confirmed exam date/time

### 5.8 Contributor & Donations
- Razorpay-based donation flow
- Impact dashboard: aggregate transparency metrics (candidates helped, exams completed, funds allocated)
- Donation history per contributor

### 5.9 Organization / NGO Dashboard
- KPI cards (active candidates, active volunteers, matches this period)
- Candidate management + volunteer management
- Bulk upload (CSV) for candidates and volunteers
- Reports + analytics + export

### 5.10 Admin Console
- Verification queue with approve/reject + reason
- Fraud/dispute flag list
- Manual override on a stuck match (escalation path)
- Full analytics across all stakeholder types

### 5.11 Multi-language & Localization
- UI copy externalized from day one (no hardcoded strings in components)
- Initial languages: TBD with you — build the i18n layer now even if only one language ships first, so it isn't retrofitted later

### 5.12 Emergency Support
- SOS action reachable from any authenticated screen
- Emergency Hero badge tied to volunteers who respond to these

## 6. Non-Functional Requirements

- **Accessibility is a launch blocker:** WCAG 2.1 AA minimum across every screen, screen-reader tested (NVDA/VoiceOver), full keyboard nav, visible focus states, high-contrast mode, font scaling, read-aloud support.
- **Performance:** matching and transport status updates feel real-time (poll or socket-based, <5s perceived latency).
- **Trust-critical copy:** every error and empty state says what happened and what to do next — especially around verification, payments, and OTP.
- **Mobile-first:** candidates and volunteers primarily use this on a phone, often en route to an exam center.

## 7. Success Metrics

- Time from request posted → matched
- % of matches completing OTP handshake successfully
- Volunteer repeat-acceptance rate
- Donation conversion + repeat-donor rate
- NGO time saved vs. manual coordination (self-reported or proxy via bulk-upload adoption)
- Accessibility audit score (automated + manual screen-reader pass)
- Verification approval turnaround time

## 8. Open Questions for You / Backend Teammate

- Default matching radius and how it scales in low-volunteer-density areas
- No-show handling at OTP handshake — auto re-match, or manual escalation?
- Is the credit score numeric internally even if shown as a tier externally?
- Transport: in-house dispatch, or third-party integration (e.g., ride-share API)?
- Which languages ship first, and who owns translation content?
- Org-level data visibility — full candidate match history, or status only?
