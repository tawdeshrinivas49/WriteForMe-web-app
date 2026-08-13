import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "STUDENT" | "VOLUNTEER" | null;

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  gender: string;
  candidateProfile?: any;
  volunteerProfile?: any;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  aadhaarVerified: boolean;
  // Additional fields for verification flow
  videoCompleted: boolean;
  quizPassed: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setAadhaarVerified: (v: boolean) => void;
  completeVideo: () => void;
  passQuiz: () => void;
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      aadhaarVerified: false,
      videoCompleted: false,
      quizPassed: false,
      setUser: (user, token) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user_data');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setAadhaarVerified: (v) => set({ aadhaarVerified: v }),
      completeVideo: () => set({ videoCompleted: true }),
      passQuiz: () => set({ quizPassed: true }),
    }),
    { name: "wfm-user" }
  )
);

// Helper to retrieve stored user/token
export const getStoredUser = (): User | null => {
  const data = localStorage.getItem('user_data');
  return data ? JSON.parse(data) : null;
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('jwtToken');
};

// ✅ Re‑export the verification function used in Request.tsx
export const isFullyVerified = (state: UserState): boolean => {
  // For volunteers: must have completed video and quiz
  if (state.user?.role === 'VOLUNTEER') {
    return state.videoCompleted && state.quizPassed;
  }
  // For students/candidates: only video completion required (or aadhaar)
  return state.videoCompleted || state.aadhaarVerified;
};