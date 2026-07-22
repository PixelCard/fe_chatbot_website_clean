# Client Surface Balance Design

**Mục tiêu**

Cân lại nền và các lớp surface của khu vực customer/auth để đồng bộ với header client vừa được làm sáng hơn. Giữ nguyên layout hiện tại, không đổi luồng đăng nhập, quên mật khẩu, cập nhật hồ sơ hay điều hướng.

**Phạm vi**

- `app/(client)/client-theme.css`
- `app/auth/auth-theme.css`
- `app/(client)/page.tsx`
- `app/auth/login/page.tsx`
- `app/auth/register/page.tsx`
- `app/auth/forgot-password/page.tsx`
- `app/auth/update-profile/page.tsx`

**Thiết kế được chốt**

1. Giữ nguyên bố cục hiện tại.
2. Giảm sắc cam ở nền tổng và surface sáng, chuyển về neutral sáng gần với admin/account.
3. Giữ cam làm accent cho CTA, focus, link nhấn và badge.
4. Hero tối ở trang chủ vẫn được giữ để còn điểm tương phản, nhưng các section sáng phía dưới sẽ đồng nhất hơn.

**Cách triển khai**

- Trong `client-theme.css`, giảm độ ấm của `--client-page-bg`, `--client-page-soft-bg`, `--client-card-shadow` để nền tổng nhẹ hơn.
- Trong `auth-theme.css`, thêm token nền, surface, border và input dùng chung cho auth pages để bớt lệ thuộc vào các mã màu rời.
- Trong `app/(client)/page.tsx`, chỉ thay những nền trắng/slate và shadow sáng đang làm cảm giác mỗi block một tone, không thay cấu trúc section.
- Trong các trang auth, đổi wrapper/card/panel/input sang token auth để login/register/forgot-password/update-profile cùng một họ màu.

**Điều không thay đổi**

- Không đổi route.
- Không đổi logic submit, OTP, session, redirect.
- Không thêm dependency.
- Không chỉnh global CSS.
