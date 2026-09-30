# Write For Me — Admin Portal Frontend

This folder contains the complete frontend implementation and pages for the Write For Me Admin Portal.

## Architecture & Directory Structure

```text
admin/admin frontend/
├── package.json          # Module descriptor
├── README.md             # Documentation
└── src/
    ├── AdminRoutes.tsx   # React Router route definitions for /admin/*
    ├── index.ts          # Module entry point
    ├── components/       # Admin-specific components
    │   ├── AdminLayout.tsx
    │   ├── AdminPage.tsx
    │   └── AdminSidebar.tsx
    ├── pages/            # Admin portal pages
    │   ├── Accounts.tsx
    │   ├── AdminLogin.tsx
    │   ├── Announcements.tsx
    │   ├── Audit.tsx
    │   ├── Donations.tsx
    │   ├── Flags.tsx
    │   ├── Gamification.tsx
    │   ├── Ngos.tsx
    │   ├── Overview.tsx
    │   ├── Payments.tsx
    │   ├── People.tsx
    │   ├── Reviews.tsx
    │   ├── Tickets.tsx
    │   ├── Verifications.tsx
    │   ├── partner/
    │   │   ├── Dashboard.tsx
    │   │   └── Roster.tsx
    │   └── super/
    │       ├── CustomExams.tsx
    │       ├── Dashboard.tsx
    │       ├── LegacyApprovals.tsx
    │       └── Settings.tsx
    ├── store/            # Admin Zustand store and mock data
    │   └── useAdmin.ts
    └── lib/              # Admin utilities
        └── exportCsv.ts
```

## Accessing the Admin Portal

- The admin portal is segregated from the main public-facing website navigation.
- There are no direct links or buttons on the main website pointing to `/admin`.
- To access and test the admin portal, navigate directly to `/admin` (or `/admin/login`) in the browser.
- Default credentials / 2FA flow can be tested on the login screen.
