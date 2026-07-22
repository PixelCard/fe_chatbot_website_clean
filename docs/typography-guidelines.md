# Typography Guidelines

Tài liệu này định nghĩa chuẩn typography chung cho FE để giữ giao diện đồng bộ, dễ đọc và dễ bảo trì.

## 1) Nguồn font hiện tại

- `font-sans` đang map về `Montserrat` trong `app/globals.css`.
- `body` đang dùng `font-sans`, nên phần chữ mặc định của hệ thống là `Montserrat`.
- `font-mono` được dùng nhiều hơn trong UI kỹ thuật, ID, log và các khối dữ liệu cần nhấn mạnh.

## 2) Quy ước sử dụng

### Sans

Dùng cho hầu hết nội dung giao diện:

- tiêu đề;
- đoạn văn;
- label;
- button text;
- menu;
- card content;
- mô tả trạng thái;
- text admin / dashboard.

Quy tắc:

- ưu tiên `font-sans`;
- không tự thêm font family khác cho từng component;
- không dùng inline style để đổi font nếu không có yêu cầu đặc biệt.

### Mono

Dùng cho dữ liệu cần đọc theo cột và giữ khoảng cách ký tự ổn định:

- mã đơn;
- ID;
- code;
- token;
- JSON;
- log kỹ thuật;
- timestamp dạng kỹ thuật;
- giá trị debug.

Quy tắc:

- ưu tiên `font-mono` cho ID, code, log, nhãn kỹ thuật và dữ liệu bảng;
- giữ `font-sans` cho nội dung mô tả, tiêu đề, button text và text giao diện chung;
- không thêm font family khác vào từng component nếu không có lý do rõ ràng.

## 3) Cấu trúc hierarchy khuyến nghị

- `text-xs` - metadata, label phụ, note nhỏ.
- `text-sm` - mô tả ngắn, helper text, phụ đề.
- `text-base` - nội dung mặc định.
- `text-lg` - section title nhỏ, nhấn nhẹ.
- `text-xl` - title khối.
- `text-2xl` trở lên - tiêu đề trang hoặc dashboard header.

## 4) Font weight khuyến nghị

- `300` - text phụ rất nhẹ.
- `400` - nội dung bình thường.
- `500` - label, action text, trạng thái trung tính.
- `600` - tiêu đề khối, nhấn vừa.
- `700` - heading chính.
- `800` - chỉ dùng khi thật sự cần nhấn mạnh.

## 5) Nguyên tắc đồng bộ

- Một màn hình chỉ nên có một family chính cho text thông thường.
- Chỉ dùng thêm family phụ khi có lý do rõ ràng.
- Không mix quá nhiều weight trong cùng một khối UI.
- Code, ID, log và bảng dữ liệu kỹ thuật phải dùng mono một cách nhất quán.

## 6) Không nên làm

- Không đặt `font-family` trực tiếp từng component nếu có thể dùng token chung.
- Không thêm font family riêng cho từng khu vực UI.
- Không pha trộn nhiều font ngẫu nhiên giữa các page.
- Không thay font chỉ để “trông khác” nếu không có chuẩn thiết kế đi kèm.

## 7) Checklist trước khi merge

- `body` vẫn dùng `font-sans`.
- `font-sans` map về đúng font hệ thống.
- `font-mono` vẫn là class được dùng rộng nhất cho text kỹ thuật.
- Không có component nào tự ý override font không cần thiết.
- Heading, body, label và table text dùng nhất quán theo cùng một hệ.

## 8) Ghi chú hiện tại của dự án

Hiện FE vẫn dùng `Montserrat` làm font nền tảng, nhưng các khu vực kỹ thuật đang ưu tiên `font-mono` để giữ nhịp hiển thị nhất quán.
