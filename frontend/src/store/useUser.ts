import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "candidate" | "volunteer" | "contributor" | "admin" | null;

export interface SessionReview {
  id: string;
  date: string;
  exam: string;
  counterpart: string;
  speed: number;
  patience: number;
  neatness: number;
  politeness: number;
  status: "completed" | "cancelled";
}

export interface MatchRequest {
  needs: "scribe" | "transport" | "both";
  examName: string;
  examDate: string;
  city: string;
  admitCardName: string | null;
}

interface UserState {
  role: UserRole;
  name: string;
  aadhaarVerified: boolean;
  videoCompleted: boolean;
  quizPassed: boolean;
  request: MatchRequest | null;
  matchFound: boolean;
  sessionStarted: boolean;
  sessionEnded: boolean;
  history: SessionReview[];
  login: (role: Exclude<UserRole, null>, name: string) => void;
  logout: () => void;
  setAadhaarVerified: (v: boolean) => void;
  completeVideo: () => void;
  passQuiz: () => void;
  setRequest: (r: MatchRequest) => void;
  clearRequest: () => void;
  setMatchFound: (v: boolean) => void;
  startSession: () => void;
  endSession: () => void;
  addHistory: (h: SessionReview) => void;
}

const seedHistory: SessionReview[] = [
  {
    id: "s-1",
    date: "2026-05-18",
    exam: "SSC CGL Tier I",
    counterpart: "Meera Iyer",
    speed: 5,
    patience: 5,
    neatness: 4,
    politeness: 5,
    status: "completed",
  },
  {
    id: "s-2",
    date: "2026-03-02",
    exam: "State PSC Prelims",
    counterpart: "Arjun Rao",
    speed: 4,
    patience: 5,
    neatness: 5,
    politeness: 5,
    status: "completed",
  },
];

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      role: null,
      name: "",
      aadhaarVerified: false,
      videoCompleted: false,
      quizPassed: false,
      request: null,
      matchFound: false,
      sessionStarted: false,
      sessionEnded: false,
      history: seedHistory,
      login: (role, name) => set({ role, name }),
      logout: () =>
        set({
          role: null,
          name: "",
          aadhaarVerified: false,
          videoCompleted: false,
          quizPassed: false,
          request: null,
          matchFound: false,
          sessionStarted: false,
          sessionEnded: false,
        }),
      setAadhaarVerified: (aadhaarVerified) => set({ aadhaarVerified }),
      completeVideo: () => set({ videoCompleted: true }),
      passQuiz: () => set({ quizPassed: true }),
      setRequest: (request) => set({ request, matchFound: false }),
      clearRequest: () => set({ request: null, matchFound: false, sessionStarted: false, sessionEnded: false }),
      setMatchFound: (matchFound) => set({ matchFound }),
      startSession: () => set({ sessionStarted: true }),
      endSession: () => set({ sessionEnded: true }),
      addHistory: (h) => set((s) => ({ history: [h, ...s.history] })),
    }),
    { name: "wfm-user" }
  )
);

export const isFullyVerified = (s: UserState) =>
  s.role === "volunteer" ? s.videoCompleted && s.quizPassed : s.videoCompleted;
