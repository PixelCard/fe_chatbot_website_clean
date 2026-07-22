# Client Header Light Balance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Làm header phía client/customer bớt nặng màu cam, sáng và rõ hơn trên nền trang, nhưng vẫn giữ cam làm accent chính.

**Architecture:** Giữ nguyên cấu trúc và logic hiện tại của header. Chỉ tinh chỉnh token trong `client-theme.css` và cập nhật class ở đúng các component con của header để tăng độ tương phản, giảm shadow/gradient nặng, và đồng bộ với visual kiểu admin/account light.

**Tech Stack:** Next.js App Router, React, TypeScript, TailwindCSS, CSS variables trong `client-theme.css`

---

### Task 1: Cân lại token cho header client

**Files:**
- Modify: `app/(client)/client-theme.css`

**Step 1: Xác định các biến đang làm header quá đậm màu**

Kiểm tra:
- `--client-header-bg`
- `--client-header-shadow`
- `--client-primary-soft`
- `--client-control-hover-bg`
- `--client-cta-shadow`

**Step 2: Chỉnh token theo hướng light neutral**

- Tăng độ trắng và border tách nền
- Giảm shadow nặng
- Giảm độ đậm của nền cam mềm
- Giữ `--client-primary` làm màu nhấn chính

**Step 3: Rà lại dark mode token**

- Đảm bảo không phá theme tối
- Chỉ chỉnh khi cần để giữ tương phản hover/active

### Task 2: Tinh chỉnh cụm header desktop/mobile

**Files:**
- Modify: `app/components/client/header/navigation/ClientHeader.tsx`
- Modify: `app/components/client/header/button/ThemeToggleButton.tsx`
- Modify: `app/components/client/header/navigation/UserMenu.tsx`

**Step 1: Giảm độ “cam kín” ở desktop nav**

- Active nav dùng nền sáng trung tính + text cam
- Nav shell rõ border hơn

**Step 2: Giảm độ nặng của CTA và control**

- CTA vẫn là primary nhưng shadow/gradient nhẹ hơn
- Theme toggle, menu button, login, user menu chuyển về control sáng trung tính

**Step 3: Đồng bộ mobile menu**

- Active state, CTA và nút logout/login/register giữ cùng hệ màu
- Không đổi logic mở/đóng menu

### Task 3: Kiểm tra diff và lint

**Files:**
- Verify only

**Step 1: Kiểm tra diff**

Run:
```bash
git diff --stat
git diff --check
git diff -- app/(client)/client-theme.css app/components/client/header/navigation/ClientHeader.tsx app/components/client/header/button/ThemeToggleButton.tsx app/components/client/header/navigation/UserMenu.tsx
```

**Step 2: Chạy lint đúng scope**

Run:
```bash
npm run lint -- "app/components/client/header/navigation/ClientHeader.tsx" "app/components/client/header/button/ThemeToggleButton.tsx" "app/components/client/header/navigation/UserMenu.tsx"
```

**Step 3: Ghi rõ phần chưa xác minh**

- Visual QA trong browser nếu chưa mở preview
