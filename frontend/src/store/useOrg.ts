import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrgApprovalStatus = "pending" | "approved" | "rejected";

export interface BulkMember {
  id: string;
  name: string;
  phone: string;
  gender: string;
  type: "candidate" | "volunteer";
  city: string;
  disability?: string;
  education?: string;
  status: "active" | "pending";
  exams: number;
  rating: number;
  uploadedAt: string;
}

export interface OrgState {
  isRegistered: boolean;
  approvalStatus: OrgApprovalStatus;
  orgName: string;
  orgType: string;
  website: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  licenseFileName: string;
  members: BulkMember[];
  submittedAt: string;

  register: (data: Omit<OrgState, "isRegistered" | "approvalStatus" | "members" | "submittedAt" | keyof OrgActions>) => void;
  addMembers: (members: BulkMember[]) => void;
  removeMember: (id: string) => void;
  updateMemberStatus: (id: string, status: BulkMember["status"]) => void;
  reset: () => void;
}

type OrgActions = Pick<OrgState, "register" | "addMembers" | "removeMember" | "updateMemberStatus" | "reset">;

const seedMembers: BulkMember[] = [
  { id: "BM-001", name: "Arjun Mishra", phone: "+91 98001 11001", gender: "Male", type: "candidate", city: "Pune", disability: "Visual Impairment", education: "12th Pass", status: "active", exams: 3, rating: 4.8, uploadedAt: "2026-08-10" },
  { id: "BM-002", name: "Fatima Shaikh", phone: "+91 98001 11002", gender: "Female", type: "candidate", city: "Pune", disability: "Locomotor Disability", education: "Graduate", status: "active", exams: 1, rating: 5.0, uploadedAt: "2026-08-10" },
  { id: "BM-003", name: "Rohan Kulkarni", phone: "+91 98001 11003", gender: "Male", type: "volunteer", city: "Pune", education: "Graduate", status: "active", exams: 8, rating: 4.7, uploadedAt: "2026-08-15" },
  { id: "BM-004", name: "Pooja Sharma", phone: "+91 98001 11004", gender: "Female", type: "volunteer", city: "Pune", education: "Post Graduate", status: "active", exams: 12, rating: 4.9, uploadedAt: "2026-08-15" },
  { id: "BM-005", name: "Kishore Nair", phone: "+91 98001 11005", gender: "Male", type: "candidate", city: "Pune", disability: "Hearing Impairment", education: "10th Pass", status: "pending", exams: 0, rating: 0, uploadedAt: "2026-09-01" },
];

export const useOrg = create<OrgState>()(
  persist(
    (set) => ({
      isRegistered: true,
      approvalStatus: "approved",
      orgName: "Sneha Foundation",
      orgType: "NGO",
      website: "https://snehafoundation.org",
      contactName: "Anita Deshpande",
      contactPhone: "+91 98765 43210",
      contactEmail: "contact@snehafoundation.org",
      city: "Pune",
      licenseFileName: "sneha_foundation_license.pdf",
      members: seedMembers,
      submittedAt: "2025-06-01",

      register: (data) =>
        set({
          ...data,
          isRegistered: true,
          approvalStatus: "pending",
          members: [],
          submittedAt: new Date().toISOString().slice(0, 10),
        }),

      addMembers: (newMembers) =>
        set((s) => ({ members: [...s.members, ...newMembers] })),

      removeMember: (id) =>
        set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

      updateMemberStatus: (id, status) =>
        set((s) => ({
          members: s.members.map((m) => (m.id === id ? { ...m, status } : m)),
        })),

      reset: () =>
        set({
          isRegistered: false,
          approvalStatus: "pending",
          orgName: "",
          orgType: "",
          website: "",
          contactName: "",
          contactPhone: "",
          contactEmail: "",
          city: "",
          licenseFileName: "",
          members: [],
          submittedAt: "",
        }),
    }),
    { name: "wfm-org" }
  )
);
