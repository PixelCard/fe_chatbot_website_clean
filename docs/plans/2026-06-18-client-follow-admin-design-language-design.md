# Client Follow Admin Design Language Design

**Mục tiêu**

Chuyển toàn bộ `customer + auth` sang cùng design language với `admin/account` cho cả light mode và dark mode, nhưng không bê layout admin sang client và không sửa bất kỳ file admin nào.

**Nguồn mẫu**

- `app/admin/accounts/components/layout/AccountHeader.tsx`
- `app/admin/dashboard/components/Action/AdminTopbar.tsx`
- token admin trong `app/globals.css`

**Thiết kế được chốt**

1. Customer/auth dùng cùng logic màu với admin:
   - `page background`
   - `card/surface`
   - `control/input`
   - `border`
   - `text hierarchy`
   - `focus ring`
   - `primary CTA`
2. Cam vẫn là accent chính của client nhưng sẽ follow cách dùng của admin light/dark:
   - chỉ nổi ở CTA chính
   - active
   - focus
   - highlight nhỏ
3. Header, auth shell, order history, chatbot, faqchat sẽ cùng một visual family với account admin.
4. Không đổi layout admin, không đổi logic customer/auth.

**Cách triển khai**

- Dùng token admin như nguồn tham chiếu để cập nhật `client-theme.css` và `auth-theme.css`.
- Giảm chất landing-page ở auth và customer, tăng chất product-shell.
- Cập nhật các component/header/button/input/card quan trọng để dùng đúng hierarchy như admin.

**Điều không thay đổi**

- route
- auth/session logic
- chatbot/order history flow
- layout admin
