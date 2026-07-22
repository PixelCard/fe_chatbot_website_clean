# Client Follow Admin Design Language Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Đồng bộ `customer + auth` theo design language của `admin/account` cho cả light/dark mà không sửa layout admin.

**Architecture:** Lấy token admin trong `app/globals.css` làm nguồn tham chiếu, rồi cập nhật `client-theme.css` và `auth-theme.css` để tạo một bộ token tương đương cho client/auth. Sau đó sửa các page/component trọng điểm để bỏ phần visual lệch hệ và dùng đúng hierarchy của admin.

**Tech Stack:** Next.js App Router, React, TypeScript, TailwindCSS, CSS variables

---

### Task 1: Map token admin sang client/auth

**Files:**
- Modify: `app/(client)/client-theme.css`
- Modify: `app/auth/auth-theme.css`
- Inspect reference: `app/globals.css`

**Step 1: Map light tokens**

- page bg
- card bg
- control bg
- border
- text hierarchy
- focus ring
- cta shadow

**Step 2: Map dark tokens**

- page bg
- card bg
- control bg
- border
- text hierarchy

**Step 3: Thêm helper class nếu cần**

- client/auth card
- control
- subtle panel

### Task 2: Đồng bộ header client theo hierarchy admin/account

**Files:**
- Modify: `app/components/client/header/navigation/ClientHeader.tsx`
- Modify: `app/components/client/header/button/ThemeToggleButton.tsx`
- Modify: `app/components/client/header/navigation/UserMenu.tsx`

**Step 1: Hạ đúng visual weight utility/auth**

**Step 2: Giữ CTA duy nhất nổi mạnh**

**Step 3: Đồng bộ dropdown/user button theo admin topbar**

### Task 3: Đồng bộ auth shell theo account admin

**Files:**
- Modify: `app/auth/login/page.tsx`
- Modify: `app/auth/register/page.tsx`
- Modify: `app/auth/forgot-password/page.tsx`
- Modify: `app/auth/update-profile/page.tsx`

**Step 1: Card/panel/input theo admin light/dark**

**Step 2: Button hierarchy theo admin**

**Step 3: Giảm chất poster/landing nếu đang quá lệch**

### Task 4: Đồng bộ client pages theo account/admin surfaces

**Files:**
- Modify: `app/(client)/page.tsx`
- Modify: `app/(client)/orderhistory/page.tsx`
- Modify: `app/(client)/chatbot/page.tsx`
- Modify: `app/(client)/faqchat/page.tsx`

**Step 1: Card shell và muted surfaces**

**Step 2: Toolbar/input/filter/button**

**Step 3: Chat shell và panels**

### Task 5: Kiểm tra diff và lint

**Files:**
- Verify only

**Step 1: Kiểm tra diff đúng scope**

Run:
```bash
git diff --stat
git diff --check
```

**Step 2: Chạy lint đúng scope client/auth**

Run:
```bash
npm.cmd run lint -- "app/components/client/header/navigation/ClientHeader.tsx" "app/components/client/header/button/ThemeToggleButton.tsx" "app/components/client/header/navigation/UserMenu.tsx" "app/auth/login/page.tsx" "app/auth/register/page.tsx" "app/auth/forgot-password/page.tsx" "app/auth/update-profile/page.tsx" "app/(client)/page.tsx" "app/(client)/orderhistory/page.tsx" "app/(client)/chatbot/page.tsx" "app/(client)/faqchat/page.tsx"
```

**Step 3: Ghi rõ phần chưa xác minh**

- Visual QA thực tế trên browser nếu chưa mở preview
