# Customer Orange Theme Design

**Date:** 2026-06-18

## Goal

Đồng bộ toàn bộ khu vực customer sang palette cam/trắng/xám:

- `#FF7A00` primary
- `#FFFFFF` background
- `#1F2937` text primary
- `#6B7280` text secondary
- `#9CA3AF` muted
- `#EF4444` error
- `#D1D5DB` idle border

## Scope

- `app/(client)`
- `app/auth`
- `app/components/client`

## Approach

1. Tạo stylesheet scope riêng cho `app/(client)` và `app/auth`.
2. Dùng helper class nhỏ cho accent text, soft background, gradient CTA, input focus.
3. Patch đúng các page/customer component còn hardcode xanh-cyan.
4. Giữ nguyên logic, hook, API, auth flow, route.
