# Client Full Theme Scope 2 Design

**Mục tiêu**

Đồng bộ giao diện toàn bộ khu vực client trong scope `customer + auth + order history + chatbot + faqchat` theo cùng một visual family sáng, trung tính và dùng cam làm accent. Không thay đổi layout chính, route, API hay logic state.

**Phạm vi**

- `app/(client)/client-theme.css`
- `app/auth/auth-theme.css`
- `app/(client)/page.tsx`
- `app/(client)/orderhistory/page.tsx`
- `app/(client)/chatbot/page.tsx`
- `app/(client)/faqchat/page.tsx`
- các trang auth đã chỉnh ở bước trước để giữ cùng hệ token

**Thiết kế được chốt**

1. Giữ nguyên flow và cấu trúc từng trang.
2. Dùng nền sáng neutral, border rõ, shadow nhẹ cho toàn bộ surface client.
3. Sidebar, chat shell, input shell, card lịch sử đơn và các panel FAQ chat cùng dùng một hệ surface.
4. Cam chỉ dùng cho:
   - CTA chính
   - active state
   - focus
   - điểm nhấn icon/trạng thái quan trọng
5. Các trạng thái màu nghiệp vụ như đỏ, xanh lá, vàng vẫn giữ vai trò semantic nhưng nền card/surface phía sau phải đồng bộ với theme mới.

**Chiến lược triển khai**

- Mở rộng token `client-theme.css` để đủ dùng cho shell, sidebar, muted surface và soft hover.
- Thay các class hard-code `bg-white`, `bg-gray-100`, `dark:bg-[#151E32]`, `border-gray-200`, `shadow-sm` trong order history/chatbot/faqchat bằng token client hoặc class đã có.
- Giữ nguyên hero tối của landing page và các vùng semantic color.
- Không chỉnh `globals.css`, không chạm admin.

**Điều không thay đổi**

- Không đổi logic chat, booking, order history, OTP, login/register/update-profile
- Không đổi route
- Không thêm dependency
