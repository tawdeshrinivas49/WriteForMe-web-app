import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "urgent" | "high" | "normal";
export type FlagPriority = "low" | "medium" | "high";

export interface Ticket {
  id: string;
  raisedBy: string;
  role: "Candidate" | "Volunteer" | "Donor";
  category: string;
  subject: string;
  detail: string;
  priority: TicketPriority;
  status: TicketStatus;
  openedAt: string; // ISO
  note?: string;
}

export interface Verification {
  id: string;
  name: string;
  role: "Candidate" | "Volunteer";
  docType: string;
  submittedAt: string;
  docImage: string;
  ocr: Record<string, string>;
  declared: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  reason?: string;
}

export interface Flag {
  id: string;
  type: string;
  subject: string;
  detail: string;
  priority: FlagPriority;
  detectedAt: string;
  status: "open" | "dismissed" | "actioned";
}

export interface Payment {
  id: string;
  date: string;
  candidate: string;
  volunteer: string;
  exam: string;
  collected: number;
  payout: number;
  status: "settled" | "pending" | "refunded";
}

export interface Donation {
  id: string;
  date: string;
  donor: string;
  type: "NGO" | "Individual" | "Corporate";
  amount: number;
  cause: string;
  receiptNo: string;
}

export interface Ngo {
  id: string;
  name: string;
  city: string;
  contact: string;
  email: string;
  since: string;
  volunteers: number;
  contributed: number;
  status: "active" | "pending";
}

export interface Person {
  id: string;
  name: string;
  role: "Candidate" | "Volunteer";
  city: string;
  phone: string;
  exams: number;
  status: "verified" | "pending" | "suspended";
  joined: string;
}

export interface Volunteer extends Person {
  points: number;
  level: string;
  badges: string[];
  trustScore: number;
}

export interface Review {
  id: string;
  author: string;
  target: string;
  rating: number;
  text: string;
  date: string;
  hidden: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  published: boolean;
}

export interface AuditEntry {
  id: string;
  admin: string;
  action: string;
  target: string;
  at: string;
}

const iso = (d: string) => new Date(d).toISOString();

const seedTickets: Ticket[] = [
  { id: "TK-1042", raisedBy: "Riya Sharma", role: "Candidate", category: "Ongoing exam", subject: "Scribe has not arrived, exam starts in 20 minutes", detail: "Centre: Pune North. Volunteer unreachable on phone.", priority: "urgent", status: "open", openedAt: iso("2026-08-21T03:10:00Z") },
  { id: "TK-1041", raisedBy: "Amit Patel", role: "Volunteer", category: "Ongoing exam", subject: "Candidate PIN not validating at session start", detail: "OTP entered 3 times, invalid each time.", priority: "urgent", status: "in_progress", openedAt: iso("2026-08-21T02:05:00Z") },
  { id: "TK-1038", raisedBy: "Priya Nair", role: "Candidate", category: "Transport", subject: "Cab did not show up for exam travel", detail: "Had to arrange own auto, requesting reimbursement.", priority: "high", status: "open", openedAt: iso("2026-08-20T09:30:00Z") },
  { id: "TK-1035", raisedBy: "Karan Mehta", role: "Volunteer", category: "Account", subject: "Unable to upload Aadhaar again after rejection", detail: "Upload button greyed out.", priority: "normal", status: "in_progress", openedAt: iso("2026-08-19T11:00:00Z") },
  { id: "TK-1030", raisedBy: "Meera Iyer", role: "Candidate", category: "Feedback", subject: "Suggestion: add Kannada language option", detail: "Would help candidates in Karnataka.", priority: "normal", status: "resolved", openedAt: iso("2026-08-16T07:45:00Z"), note: "Logged into product backlog for Q4." },
  { id: "TK-1024", raisedBy: "Sneha Foundation", role: "Donor", category: "Receipts", subject: "Need 80G receipt for March donation", detail: "Donation ID DN-2203.", priority: "normal", status: "closed", openedAt: iso("2026-08-11T05:20:00Z"), note: "Receipt regenerated and emailed." },
];

const seedVerifications: Verification[] = [
  {
    id: "VF-501", name: "Priya Nair", role: "Candidate", docType: "PwD Certificate", submittedAt: "2026-08-20", status: "pending",
    docImage: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=60",
    ocr: { Name: "PRIYA NAIP", "ID No": "PWD-4482-11", "Date of Birth": "14/07/1999", Disability: "Visual - 80%" },
    declared: { Name: "Priya Nair", "ID No": "PWD-4482-11", "Date of Birth": "14/07/1999", Disability: "Visual - 80%" },
  },
  {
    id: "VF-499", name: "Karan Mehta", role: "Volunteer", docType: "Aadhaar", submittedAt: "2026-08-19", status: "pending",
    docImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=60",
    ocr: { Name: "KARAN M.", "Aadhaar": "XXXX XXXX 8821", "Date of Birth": "02/11/1997", Address: "Kothrud, Pune" },
    declared: { Name: "Karan Mehta", "Aadhaar": "XXXX XXXX 8821", "Date of Birth": "02/11/1997", Address: "Kothrud, Pune" },
  },
  {
    id: "VF-495", name: "Devika Rao", role: "Candidate", docType: "Admit Card", submittedAt: "2026-08-18", status: "pending",
    docImage: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&q=60",
    ocr: { Name: "DEVIKA RAO", Exam: "SSC CGL Tier II", Date: "12/09/2026", Centre: "Hyderabad - 07" },
    declared: { Name: "Devika Rao", Exam: "SSC CGL Tier I", Date: "12/09/2026", Centre: "Hyderabad - 07" },
  },
  {
    id: "VF-488", name: "Arjun Rao", role: "Volunteer", docType: "Aadhaar", submittedAt: "2026-08-14", status: "approved",
    docImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=60",
    ocr: { Name: "ARJUN RAO", "Aadhaar": "XXXX XXXX 1190", "Date of Birth": "23/03/1995", Address: "Indiranagar, Bengaluru" },
    declared: { Name: "Arjun Rao", "Aadhaar": "XXXX XXXX 1190", "Date of Birth": "23/03/1995", Address: "Indiranagar, Bengaluru" },
    reason: "OCR blur on name line, manually matched.",
  },
];

const seedFlags: Flag[] = [
  { id: "FL-88", type: "Repeated no-show", subject: "Volunteer: Nikhil Bose", detail: "3 no-shows in the last 30 days (SSC CGL, RRB NTPC, State PSC).", priority: "high", detectedAt: "2026-08-21", status: "open" },
  { id: "FL-87", type: "Short session", subject: "Session SE-2291 - Riya Sharma / Amit Patel", detail: "Scheduled 180 min, ended after 14 min via end-OTP.", priority: "high", detectedAt: "2026-08-20", status: "open" },
  { id: "FL-85", type: "OTP failures", subject: "Volunteer: Karan Mehta", detail: "7 incorrect start-PIN attempts across 2 sessions.", priority: "medium", detectedAt: "2026-08-19", status: "open" },
  { id: "FL-83", type: "Repeated pairing", subject: "Meera Iyer / Arjun Rao", detail: "Paired 6 times in 8 weeks — possible collusion or off-platform arrangement.", priority: "medium", detectedAt: "2026-08-17", status: "open" },
  { id: "FL-79", type: "Location mismatch", subject: "Volunteer: Sahil Khan", detail: "Check-in GPS 42 km from declared exam centre.", priority: "low", detectedAt: "2026-08-12", status: "dismissed" },
];

const seedPayments: Payment[] = [
  { id: "PY-3301", date: "2026-08-20", candidate: "Riya Sharma", volunteer: "Amit Patel", exam: "SSC CGL Tier I", collected: 0, payout: 750, status: "settled" },
  { id: "PY-3298", date: "2026-08-18", candidate: "Priya Nair", volunteer: "Karan Mehta", exam: "State PSC Prelims", collected: 250, payout: 900, status: "pending" },
  { id: "PY-3290", date: "2026-08-14", candidate: "Devika Rao", volunteer: "Arjun Rao", exam: "RRB NTPC", collected: 0, payout: 750, status: "settled" },
  { id: "PY-3287", date: "2026-08-09", candidate: "Meera Iyer", volunteer: "Nikhil Bose", exam: "IBPS Clerk", collected: 250, payout: 0, status: "refunded" },
];

const seedDonations: Donation[] = [
  { id: "DN-2290", date: "2026-08-19", donor: "Sneha Foundation", type: "NGO", amount: 125000, cause: "Transport Support", receiptNo: "WFM/26-27/0290" },
  { id: "DN-2288", date: "2026-08-15", donor: "Rohit Sethi", type: "Individual", amount: 12000, cause: "General Fund", receiptNo: "WFM/26-27/0288" },
  { id: "DN-2284", date: "2026-08-11", donor: "Aarohi Tech Pvt Ltd", type: "Corporate", amount: 300000, cause: "Scribe Training", receiptNo: "WFM/26-27/0284" },
  { id: "DN-2280", date: "2026-08-04", donor: "Anonymous", type: "Individual", amount: 5000, cause: "General Fund", receiptNo: "WFM/26-27/0280" },
];

const seedNgos: Ngo[] = [
  { id: "NG-11", name: "Sneha Foundation", city: "Pune", contact: "Anita Deshpande", email: "contact@snehafoundation.org", since: "2025-06-01", volunteers: 48, contributed: 425000, status: "active" },
  { id: "NG-12", name: "Drishti Trust", city: "Delhi", contact: "Rakesh Gupta", email: "hello@drishtitrust.in", since: "2025-09-14", volunteers: 31, contributed: 210000, status: "active" },
  { id: "NG-13", name: "Saksham Bengaluru", city: "Bengaluru", contact: "Latha Menon", email: "team@saksham.org", since: "2026-02-20", volunteers: 22, contributed: 96000, status: "active" },
  { id: "NG-14", name: "Roshni Welfare", city: "Lucknow", contact: "Imran Ali", email: "info@roshni.org", since: "2026-07-30", volunteers: 6, contributed: 0, status: "pending" },
];

const seedCandidates: Person[] = [
  { id: "CA-201", name: "Riya Sharma", role: "Candidate", city: "Pune", phone: "+91 98xxxx1122", exams: 4, status: "verified", joined: "2026-01-15" },
  { id: "CA-202", name: "Priya Nair", role: "Candidate", city: "Kochi", phone: "+91 97xxxx4410", exams: 1, status: "pending", joined: "2026-04-10" },
  { id: "CA-203", name: "Devika Rao", role: "Candidate", city: "Hyderabad", phone: "+91 90xxxx7781", exams: 2, status: "verified", joined: "2025-12-02" },
  { id: "CA-204", name: "Meera Iyer", role: "Candidate", city: "Chennai", phone: "+91 96xxxx3390", exams: 6, status: "verified", joined: "2025-08-19" },
];

const seedVolunteers: Volunteer[] = [
  { id: "VO-101", name: "Amit Patel", role: "Volunteer", city: "Pune", phone: "+91 98xxxx5510", exams: 18, status: "verified", joined: "2025-11-03", points: 1840, level: "Gold", badges: ["Punctual", "50 Hours", "Exam Day Hero"], trustScore: 96 },
  { id: "VO-102", name: "Karan Mehta", role: "Volunteer", city: "Pune", phone: "+91 99xxxx2214", exams: 9, status: "verified", joined: "2025-09-18", points: 920, level: "Silver", badges: ["Punctual"], trustScore: 78 },
  { id: "VO-103", name: "Arjun Rao", role: "Volunteer", city: "Bengaluru", phone: "+91 89xxxx6633", exams: 14, status: "verified", joined: "2025-10-11", points: 1360, level: "Gold", badges: ["Neat Handwriting", "25 Hours"], trustScore: 91 },
  { id: "VO-104", name: "Nikhil Bose", role: "Volunteer", city: "Kolkata", phone: "+91 87xxxx9902", exams: 5, status: "suspended", joined: "2026-03-05", points: 310, level: "Bronze", badges: [], trustScore: 44 },
];

const seedReviews: Review[] = [
  { id: "RV-410", author: "Riya Sharma", target: "Amit Patel", rating: 5, text: "Calm, fast and incredibly patient throughout the paper.", date: "2026-08-20", hidden: false },
  { id: "RV-408", author: "Devika Rao", target: "Platform", rating: 5, text: "Booking a scribe used to take weeks. This took a day.", date: "2026-08-18", hidden: false },
  { id: "RV-405", author: "Anonymous", target: "Nikhil Bose", rating: 1, text: "Absolute waste of time, this guy is a **** and should be thrown out.", date: "2026-08-16", hidden: true },
  { id: "RV-402", author: "Meera Iyer", target: "Arjun Rao", rating: 4, text: "Neat handwriting, slightly slow in the last section.", date: "2026-08-12", hidden: false },
];

const seedAnnouncements: Announcement[] = [
  { id: "AN-9", title: "Scribe drive for SSC CGL Tier II", body: "We need 200 more verified volunteers across Maharashtra and Telangana before 12 September. Share the sign-up link within your networks.", date: "2026-08-18", published: true },
  { id: "AN-8", title: "New transport partner in Bengaluru", body: "Subsidised exam-day rides are now available for candidates in Bengaluru, funded by Saksham Bengaluru.", date: "2026-08-05", published: true },
  { id: "AN-7", title: "Draft: festive volunteering campaign", body: "Outline for the October campaign, pending design assets.", date: "2026-08-01", published: false },
];

export const successRateSeries = [
  { month: "Feb", rate: 74, matches: 120 },
  { month: "Mar", rate: 78, matches: 148 },
  { month: "Apr", rate: 81, matches: 173 },
  { month: "May", rate: 79, matches: 190 },
  { month: "Jun", rate: 86, matches: 226 },
  { month: "Jul", rate: 89, matches: 261 },
  { month: "Aug", rate: 92, matches: 288 },
];

interface AdminState {
  authed: boolean;
  adminEmail: string;
  admins: { id: string; email: string; name: string; role: "Super admin" | "Moderator"; added: string }[];
  tickets: Ticket[];
  verifications: Verification[];
  flags: Flag[];
  payments: Payment[];
  donations: Donation[];
  ngos: Ngo[];
  candidates: Person[];
  volunteers: Volunteer[];
  reviews: Review[];
  announcements: Announcement[];
  audit: AuditEntry[];
  leaderboardOn: boolean;
  leaderboardTitle: string;
  leaderboardCount: number;

  login: (email: string) => void;
  logout: () => void;
  log: (action: string, target: string) => void;
  setTicketStatus: (id: string, status: TicketStatus, note?: string) => void;
  decideVerification: (id: string, status: "approved" | "rejected", reason: string) => void;
  setFlagStatus: (id: string, status: Flag["status"]) => void;
  adjustPoints: (id: string, delta: number, reason: string) => void;
  toggleReview: (id: string) => void;
  saveAnnouncement: (a: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  setLeaderboard: (v: Partial<Pick<AdminState, "leaderboardOn" | "leaderboardTitle" | "leaderboardCount">>) => void;
  addAdmin: (name: string, email: string, role: "Super admin" | "Moderator") => void;
  removeAdmin: (id: string) => void;
}

export const useAdmin = create<AdminState>()(
  persist(
    (set, get) => ({
      authed: false,
      adminEmail: "",
      admins: [
        { id: "AD-1", email: "admin@writeforme.org", name: "Aditi Verma", role: "Super admin", added: "2025-05-01" },
        { id: "AD-2", email: "ops@writeforme.org", name: "Sameer Joshi", role: "Moderator", added: "2026-01-12" },
      ],
      tickets: seedTickets,
      verifications: seedVerifications,
      flags: seedFlags,
      payments: seedPayments,
      donations: seedDonations,
      ngos: seedNgos,
      candidates: seedCandidates,
      volunteers: seedVolunteers,
      reviews: seedReviews,
      announcements: seedAnnouncements,
      audit: [
        { id: "AU-1", admin: "ops@writeforme.org", action: "Approved verification VF-488", target: "Arjun Rao", at: iso("2026-08-14T10:12:00Z") },
        { id: "AU-2", admin: "admin@writeforme.org", action: "Hid review RV-405", target: "Review RV-405", at: iso("2026-08-16T14:40:00Z") },
      ],
      leaderboardOn: true,
      leaderboardTitle: "Top scribes this month",
      leaderboardCount: 10,

      login: (adminEmail) => set({ authed: true, adminEmail }),
      logout: () => set({ authed: false, adminEmail: "" }),
      log: (action, target) =>
        set((s) => ({
          audit: [
            { id: `AU-${Math.random().toString(36).slice(2, 8)}`, admin: s.adminEmail || "admin@writeforme.org", action, target, at: new Date().toISOString() },
            ...s.audit,
          ],
        })),
      setTicketStatus: (id, status, note) => {
        set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, status, note: note ?? t.note } : t)) }));
        get().log(`Ticket ${id} → ${status.replace("_", " ")}`, id);
      },
      decideVerification: (id, status, reason) => {
        set((s) => ({ verifications: s.verifications.map((v) => (v.id === id ? { ...v, status, reason } : v)) }));
        get().log(`Verification ${id} ${status}`, id);
      },
      setFlagStatus: (id, status) => {
        set((s) => ({ flags: s.flags.map((f) => (f.id === id ? { ...f, status } : f)) }));
        get().log(`Flag ${id} ${status}`, id);
      },
      adjustPoints: (id, delta, reason) => {
        set((s) => ({ volunteers: s.volunteers.map((v) => (v.id === id ? { ...v, points: Math.max(0, v.points + delta) } : v)) }));
        get().log(`Adjusted points ${delta > 0 ? "+" : ""}${delta} — ${reason}`, id);
      },
      toggleReview: (id) => {
        const r = get().reviews.find((x) => x.id === id);
        set((s) => ({ reviews: s.reviews.map((x) => (x.id === id ? { ...x, hidden: !x.hidden } : x)) }));
        get().log(`${r?.hidden ? "Unhid" : "Hid"} review ${id}`, id);
      },
      saveAnnouncement: (a) => {
        set((s) => ({
          announcements: s.announcements.some((x) => x.id === a.id)
            ? s.announcements.map((x) => (x.id === a.id ? a : x))
            : [a, ...s.announcements],
        }));
        get().log(`Saved announcement "${a.title}"`, a.id);
      },
      deleteAnnouncement: (id) => {
        set((s) => ({ announcements: s.announcements.filter((a) => a.id !== id) }));
        get().log(`Deleted announcement ${id}`, id);
      },
      setLeaderboard: (v) => {
        set(v as never);
        get().log("Updated leaderboard settings", "leaderboard");
      },
      addAdmin: (name, email, role) => {
        set((s) => ({ admins: [...s.admins, { id: `AD-${s.admins.length + 1}`, name, email, role, added: new Date().toISOString().slice(0, 10) }] }));
        get().log(`Created admin account ${email}`, email);
      },
      removeAdmin: (id) => {
        set((s) => ({ admins: s.admins.filter((a) => a.id !== id) }));
        get().log(`Revoked admin ${id}`, id);
      },
    }),
    { name: "wfm-admin" }
  )
);

export const sinceLabel = (isoStr: string) => {
  const ms = Date.now() - new Date(isoStr).getTime();
  const h = Math.floor(ms / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(ms / 60000))}m`;
  if (h < 48) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
