# Customer Orange Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Normalize all customer-facing pages to the orange/white/gray palette without changing business logic.

**Architecture:** Add route-scoped CSS for `app/(client)` and `app/auth`, then patch only the customer pages and customer shared components that still hardcode green/cyan accents. Reuse the existing structure and preserve auth/session/chat behavior.

**Tech Stack:** Next.js App Router, React, TypeScript, TailwindCSS, route-scoped CSS

---

### Task 1: Add route-scoped customer theme files

**Files:**
- Create: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/(client)/client-theme.css`
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/(client)/layout.tsx`
- Create: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/auth/auth-theme.css`
- Create: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/auth/layout.tsx`

### Task 2: Patch client route pages

**Files:**
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/(client)/page.tsx`
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/(client)/chatbot/page.tsx`
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/(client)/faqchat/page.tsx`
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/(client)/orderhistory/page.tsx`

### Task 3: Patch auth pages

**Files:**
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/auth/login/page.tsx`
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/auth/register/page.tsx`
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/auth/forgot-password/page.tsx`
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/auth/update-profile/page.tsx`

### Task 4: Patch shared customer component

**Files:**
- Modify: `FE/AI_ChatBot_TuVanSuaChuaDien_Website/fe_chatbot_website/app/components/client/booking/TechnicianBookingForm.tsx`

### Task 5: Verify

**Step 1: Search for leftover green/cyan accents**

Run:
`rg -n "#10d481|#05a3f0|emerald-|sky-" app/(client) app/auth app/components/client`

**Step 2: Run targeted lint**

Run:
`npm.cmd run lint -- "app/(client)/layout.tsx" "app/(client)/page.tsx" "app/(client)/chatbot/page.tsx" "app/(client)/faqchat/page.tsx" "app/(client)/orderhistory/page.tsx" "app/auth/login/page.tsx" "app/auth/register/page.tsx" "app/auth/forgot-password/page.tsx" "app/auth/update-profile/page.tsx" "app/auth/layout.tsx" "app/components/client/booking/TechnicianBookingForm.tsx"`
