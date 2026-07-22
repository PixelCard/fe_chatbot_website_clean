# Client Full Theme Scope 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Đồng bộ giao diện toàn bộ client scope `customer + auth + order history + chatbot + faqchat` theo cùng hệ theme sáng neutral với accent cam.

**Architecture:** Giữ nguyên behavior hiện có, chỉ mở rộng token trong `client-theme.css` và thay các class hard-code màu/surface trong 3 trang client còn lại cùng vài điểm ở customer/auth để chúng dùng chung một visual language. Không đổi structure lớn hay state flow.

**Tech Stack:** Next.js App Router, React, TypeScript, TailwindCSS, CSS variables

---

### Task 1: Mở rộng token client chung

**Files:**
- Modify: `app/(client)/client-theme.css`

**Step 1: Thêm token shell và muted surface**

- thêm token cho:
  - shell/sidebar bg
  - muted bg
  - soft hover
  - input border/bg nếu cần

**Step 2: Giữ dark mode tương thích**

- không phá các route đã tối ưu trước đó

### Task 2: Đồng bộ order history

**Files:**
- Modify: `app/(client)/orderhistory/page.tsx`

**Step 1: Đổi nền ngoài và các card/loading/error/empty**

**Step 2: Đổi search input, tab, action button sang token client**

**Step 3: Giữ semantic colors cho badge trạng thái**

### Task 3: Đồng bộ chatbot

**Files:**
- Modify: `app/(client)/chatbot/page.tsx`

**Step 1: Đổi shell, sidebar, current-session box, composer, user bubble**

**Step 2: Đổi booking modal close button và danger CTA cho hợp theme**

**Step 3: Giữ gradient accent cho CTA chính**

### Task 4: Đồng bộ faqchat

**Files:**
- Modify: `app/(client)/faqchat/page.tsx`

**Step 1: Đổi list/sidebar/header/message shell/footer composer**

**Step 2: Đổi quote card, badge unread, active item và aside profile**

**Step 3: Giữ distinction giữa vai trò khách/thợ**

### Task 5: Kiểm tra diff và lint

**Files:**
- Verify only

**Step 1: Kiểm tra diff theo scope**

Run:
```bash
git diff --stat -- app/(client)/client-theme.css app/(client)/orderhistory/page.tsx app/(client)/chatbot/page.tsx app/(client)/faqchat/page.tsx docs/plans/2026-06-18-client-full-theme-scope2-design.md docs/plans/2026-06-18-client-full-theme-scope2.md
git diff --check
```

**Step 2: Chạy lint đúng scope**

Run:
```bash
npm.cmd run lint -- "app/(client)/orderhistory/page.tsx" "app/(client)/chatbot/page.tsx" "app/(client)/faqchat/page.tsx"
```

**Step 3: Ghi rõ phần chưa xác minh**

- Visual QA thực tế trên browser nếu chưa mở preview
