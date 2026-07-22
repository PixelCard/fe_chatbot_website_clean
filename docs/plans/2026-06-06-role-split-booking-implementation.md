# Role-Split Booking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build two customer booking entry flows and a separated technician UI that both rely on the existing booking/chat backend.

**Architecture:** Keep customer, technician, and admin separated by route. Reuse existing common chat services and shared types, then add a small shared booking form layer used by `home` and `chatbot`. Build the first technician screens on top of existing technician job endpoints, using admin-inspired layout only at the presentation level.

**Tech Stack:** Next.js App Router, React, TypeScript, TailwindCSS, existing app services/hooks.

---

### Task 1: Add Planning Docs

**Files:**
- Create: `docs/plans/2026-06-06-role-split-booking-design.md`
- Create: `docs/plans/2026-06-06-role-split-booking-implementation.md`

**Step 1: Confirm the design content is saved**

Run: no command required
Expected: both docs exist with the agreed route split and dual booking entry flow.

### Task 2: Add Shared Customer Booking Form Contract

**Files:**
- Create: `app/components/client/booking/TechnicianBookingForm.tsx`
- Create: `app/components/client/booking/booking.types.ts`
- Modify: `app/services/common/types.ts`

**Step 1: Write the failing type usage**

Target behavior:
- form payload matches `BookTechnicianPayload`
- local UI can carry optional device/symptom summary without changing backend payload

**Step 2: Run lint**

Run: `npm run lint`
Expected: fail until new imports/components are wired correctly.

**Step 3: Implement minimal shared form**

Include:
- contact name
- phone
- address
- optional readonly summary block
- submit/loading/error UI

**Step 4: Run lint**

Run: `npm run lint`
Expected: shared form compiles cleanly.

### Task 3: Add Home Direct Booking Flow

**Files:**
- Modify: `app/(client)/page.tsx`
- Create: `app/hooks/useCustomerBooking.ts`
- Modify: `app/services/chatbot.service.ts` or create a small helper only if needed for session bootstrap

**Step 1: Write failing integration path**

Target behavior:
- home page can submit customer info
- FE obtains a `sessionId`
- FE calls `bookTechnician(sessionId, payload)`

**Step 2: Run lint**

Run: `npm run lint`
Expected: fail because hook/component flow is incomplete.

**Step 3: Implement minimal hook**

Hook responsibilities:
- create or reuse session safely
- call `bookTechnician`
- expose loading/error/success state

**Step 4: Wire home page UI**

Place the form in the consultation section without disturbing unrelated landing sections.

**Step 5: Run lint**

Run: `npm run lint`
Expected: pass for this slice.

### Task 4: Add Chatbot Booking Flow

**Files:**
- Modify: `app/hooks/useChatbotApi.ts`
- Modify: `app/(client)/chatbot/page.tsx`

**Step 1: Write failing integration path**

Target behavior:
- chatbot stores `sessionId`
- chatbot exposes AI booking trigger state
- booking form appears only when booking is possible

**Step 2: Run lint**

Run: `npm run lint`
Expected: fail until new state/UI is connected.

**Step 3: Implement minimal chatbot state additions**

Add:
- `bookingTriggered`
- optional last AI state summary
- reset behavior on new chat

**Step 4: Reuse shared booking form in chatbot page**

Requirements:
- do not rewrite the full chat page
- append booking block below messages/input area
- call the shared booking hook using existing `sessionId`

**Step 5: Run lint**

Run: `npm run lint`
Expected: pass for chatbot changes.

### Task 5: Create Technician Route Shell

**Files:**
- Create: `app/technician/layout.tsx`
- Create: `app/technician/page.tsx`
- Create: `app/technician/_components/TechnicianShell.tsx`

**Step 1: Write failing route composition**

Target behavior:
- technician area has separate shell from admin
- route is reachable without importing admin route modules directly

**Step 2: Run lint**

Run: `npm run lint`
Expected: fail until shell/components exist.

**Step 3: Implement minimal shell**

Requirements:
- full-width operational layout
- compact header
- navigation for broadcast/active jobs
- preserve mobile usability

**Step 4: Run lint**

Run: `npm run lint`
Expected: pass for route shell.

### Task 6: Create Technician Job Board

**Files:**
- Create: `app/technician/hooks/useTechnicianJobs.ts`
- Create: `app/technician/components/TechnicianBroadcastList.tsx`
- Create: `app/technician/components/TechnicianActiveJobs.tsx`
- Modify: `app/technician/page.tsx`

**Step 1: Write failing data flow**

Target behavior:
- technician loads broadcast jobs from `getBroadcastJobs()`
- technician accepts with `acceptJob(sessionId, version)`
- active sessions load from `getSessions()`

**Step 2: Run lint**

Run: `npm run lint`
Expected: fail until components/hooks are complete.

**Step 3: Implement minimal hook and components**

Requirements:
- use only common chat services/hooks
- separate broadcast list from active job list
- show loading, empty, error
- accept action with disabled/loading state

**Step 4: Run lint**

Run: `npm run lint`
Expected: pass for technician job board.

### Task 7: Add Technician Job Status Actions

**Files:**
- Modify: `app/technician/hooks/useTechnicianJobs.ts`
- Modify: `app/technician/components/TechnicianActiveJobs.tsx`

**Step 1: Write failing action flow**

Target behavior:
- technician can start moving
- technician can confirm arrival
- technician can complete job
- technician can cancel job

**Step 2: Run lint**

Run: `npm run lint`
Expected: fail until actions are connected.

**Step 3: Implement minimal action panel**

Requirements:
- action visibility follows current session status
- buttons use existing endpoints only
- refresh lists after mutation

**Step 4: Run lint**

Run: `npm run lint`
Expected: pass for technician actions.

### Task 8: Final Verification

**Files:**
- Modify only if verification exposes real defects

**Step 1: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 2: Run build**

Run: `npm run build`
Expected: PASS, or report unrelated pre-existing failures precisely.

**Step 3: Manual QA**

Check:
- home direct booking form
- chatbot-triggered booking form
- technician broadcast list
- technician accept flow
- technician status actions

**Step 4: Diff review**

Run:
- `git diff --stat`
- `git diff --check`

Expected:
- no unrelated file churn
- no accidental formatting rewrite
- no debug code left behind
