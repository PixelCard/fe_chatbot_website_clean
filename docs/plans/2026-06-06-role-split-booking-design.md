# Role-Split Booking Design

**Date:** 2026-06-06

**Objective:** Add two customer entry flows for booking a technician, then split technician UI from admin UI while reusing shared API/services and selected layout patterns.

## Confirmed Scope

- Customer flow 1: `home` consultation form -> book technician directly.
- Customer flow 2: `chatbot` AI consultation -> when AI returns `is_booking_triggered`, show booking form -> book technician.
- Technician UI must be separated from admin UI by route and role intent.
- Admin UI remains admin/dispatch/oversight only.

## Behavioral Rules

- Both customer entry flows must end at the same backend action: `POST /api/chats/:id/book`.
- AI chat continues to create/update `ChatSession` in `AI_CONSULTING`.
- Only `bookTechnician(...)` moves a session to `BROADCASTING`.
- Technician accepts broadcast jobs from technician routes only.
- No API contract invention. Existing `ChatSession`, `BookTechnicianPayload`, `BroadcastJobItem`, `JobStatus` are reused.

## Route Design

- Customer routes stay under `app/(client)/*`.
- New technician routes are separated under `app/technician/*`.
- Admin routes stay under `app/Admin/*` or existing admin structure.

## UI Design

### Customer

- Add one shared booking form component for contact/address/device summary.
- Home page uses the form as a direct consultation-to-book section.
- Chatbot page shows the same form only after a valid `sessionId` exists and AI recommends booking, or after the user explicitly chooses booking.

### Technician

- Build a technician shell separate from admin shell.
- Reuse admin visual density and table/card structure where safe.
- First technician page should cover:
  - broadcast jobs list
  - accept job action
  - active jobs list for current technician
  - status actions: start moving, arrived, complete, cancel

## Data Flow

### Home direct booking

1. Customer fills form.
2. FE creates or reuses a lightweight session.
3. FE calls `bookTechnician(sessionId, payload)`.
4. Backend moves session to `BROADCASTING`.
5. Technician UI can see the job in broadcast queue.

### AI-assisted booking

1. Customer chats with AI.
2. AI returns `sessionId` and optionally `is_booking_triggered = true`.
3. FE stores `sessionId`.
4. FE opens booking form.
5. FE calls `bookTechnician(sessionId, payload)`.
6. Backend moves session to `BROADCASTING`.

## Reuse Strategy

- Reuse existing common chat services and hooks:
  - `app/services/common/chats.service.ts`
  - `app/hooks/common/useChatsApi.ts`
  - `app/services/common/types.ts`
- Reuse admin technician visual patterns selectively:
  - cards
  - table density
  - shell spacing
- Do not point technician UI to admin-only services.

## Risks

- Customer home flow currently lacks a guaranteed `sessionId`, so it needs a minimal safe way to create one before booking.
- Customer order history is still mock-based and backend inbox filtering currently excludes `BROADCASTING` sessions without technician assignment.
- Admin shell currently lives in a feature path; technician UI should not depend on admin-only route semantics.

## Verification Targets

- Customer can book from home.
- Customer can book from chatbot after AI trigger.
- Technician can see broadcast jobs.
- Technician can accept a job and see it move to active state.
- No admin route is required for technician booking flow.
