# Client Surface Balance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Làm nền và surface của customer/auth đồng bộ hơn với header client sáng mới, nhưng không đổi layout hay logic.

**Architecture:** Dùng token cục bộ ở `client-theme.css` và `auth-theme.css` để gom màu nền, border, shadow, input. Sau đó thay các class nền/surface rời trong trang customer và auth bằng các token đó, giữ nguyên component structure và hành vi.

**Tech Stack:** Next.js App Router, React, TypeScript, TailwindCSS, CSS variables

---

### Task 1: Cân lại token nền customer và auth

**Files:**
- Modify: `app/(client)/client-theme.css`
- Modify: `app/auth/auth-theme.css`

**Step 1: Điều chỉnh token customer**

- Giảm độ cam của `--client-page-bg`
- Làm `--client-page-soft-bg` trung tính hơn
- Giảm shadow sáng đậm

**Step 2: Thêm token auth dùng chung**

- Thêm token cho:
  - nền trang
  - card auth
  - panel form
  - border
  - input/background readonly

**Step 3: Rà lại token dark mode**

- Đảm bảo hover, focus, text, border vẫn đủ contrast

### Task 2: Đồng bộ nền/surface của customer landing

**Files:**
- Modify: `app/(client)/page.tsx`

**Step 1: Giữ hero tối**

- Không thay cấu trúc hero
- Chỉ thay những button/card sáng nếu lệch tone

**Step 2: Đồng bộ các section sáng**

- Card process
- Card feedback
- Assistant panel
- Section navigator tooltip/dot shell
- About section surface

**Step 3: Giảm shadow và nền slate rời**

- Ưu tiên tone trung tính sáng
- Giữ accent cam cho icon/CTA

### Task 3: Đồng bộ nền/surface auth pages

**Files:**
- Modify: `app/auth/login/page.tsx`
- Modify: `app/auth/register/page.tsx`
- Modify: `app/auth/forgot-password/page.tsx`
- Modify: `app/auth/update-profile/page.tsx`

**Step 1: Thay wrapper/card/panel bằng token auth**

- Nền ngoài
- Auth card chính
- Panel form

**Step 2: Thay input/read-only/success surface**

- Input trắng trung tính hơn
- Read-only box đồng bộ
- Success box bớt xanh chói nếu cần

**Step 3: Giữ nguyên logic và DOM structure**

- Không đổi handler, redirect, request flow

### Task 4: Kiểm tra diff và lint

**Files:**
- Verify only

**Step 1: Kiểm tra diff theo scope**

Run:
```bash
git diff --stat -- app/(client)/client-theme.css app/auth/auth-theme.css app/(client)/page.tsx app/auth/login/page.tsx app/auth/register/page.tsx app/auth/forgot-password/page.tsx app/auth/update-profile/page.tsx
git diff --check
```

**Step 2: Chạy lint đúng scope**

Run:
```bash
npm.cmd run lint -- "app/(client)/page.tsx" "app/auth/login/page.tsx" "app/auth/register/page.tsx" "app/auth/forgot-password/page.tsx" "app/auth/update-profile/page.tsx"
```

**Step 3: Ghi rõ phần chưa xác minh**

- Visual QA thực tế trên browser nếu chưa mở preview
