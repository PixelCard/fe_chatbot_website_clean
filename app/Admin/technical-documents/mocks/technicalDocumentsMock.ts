import type { TechnicalDocumentItem } from "../types/technicalDocument.types";

export const technicalDocumentsMock: TechnicalDocumentItem[] = [
  {
    id: 1,
    title: "Máy lạnh không mát - Kiểm tra gas",
    content:
      "Khi máy lạnh hoạt động nhưng không mát, kỹ thuật viên cần kiểm tra lưới lọc, dàn lạnh, dàn nóng, áp suất gas và cảm biến nhiệt. Nếu phát hiện rò rỉ gas, cần xử lý điểm rò trước khi nạp gas mới.",
    category: "Máy lạnh",
    source: "Manual Daikin 2024",
    accessLevel: "ADVANCED",
    embeddingStatus: "SYNCED",
    isOutdated: false,
    needsAiCoverage: false,
    createdAt: "2026-05-20T08:30:00.000Z",
    updatedAt: "2026-05-25T09:00:00.000Z",
  },
  {
    id: 2,
    title: "Tủ lạnh không đông đá - Quy trình kiểm tra",
    content:
      "Trường hợp tủ lạnh không đông đá nhưng ngăn mát vẫn hoạt động, cần kiểm tra quạt gió, block, relay khởi động, cảm biến xả đá và lượng gas. Không kết luận hỏng block nếu chưa đo dòng hoạt động.",
    category: "Tủ lạnh",
    source: "Kỹ thuật viên nội bộ",
    accessLevel: "ADVANCED",
    embeddingStatus: "STALE",
    isOutdated: false,
    needsAiCoverage: true,
    createdAt: "2026-05-21T10:10:00.000Z",
    updatedAt: "2026-05-28T14:20:00.000Z",
  },
  {
    id: 3,
    title: "Máy giặt không xả nước",
    content:
      "Máy giặt không xả nước thường liên quan đến bơm xả, ống thoát nước bị nghẹt, cảm biến mực nước hoặc bo mạch điều khiển. Trước khi thay bơm, cần kiểm tra vật cản ở đường thoát.",
    category: "Máy giặt",
    source: "Sổ tay sửa chữa nội bộ",
    accessLevel: "BASIC",
    embeddingStatus: "SYNCED",
    isOutdated: false,
    needsAiCoverage: false,
    createdAt: "2026-05-22T09:00:00.000Z",
    updatedAt: "2026-05-23T11:30:00.000Z",
  },
  {
    id: 4,
    title: "Máy nước nóng rò điện - Cảnh báo an toàn",
    content:
      "Nếu máy nước nóng có dấu hiệu rò điện, chạm điện, nước rò gần dây nguồn hoặc aptomat nhảy liên tục, cần yêu cầu người dùng ngắt điện ngay. Không hướng dẫn người dùng tự tháo máy nếu không có chuyên môn.",
    category: "Máy nước nóng",
    source: "Cảnh báo an toàn nội bộ",
    accessLevel: "BASIC",
    embeddingStatus: "MISSING",
    isOutdated: false,
    needsAiCoverage: true,
    createdAt: "2026-05-24T16:45:00.000Z",
    updatedAt: "2026-05-24T16:45:00.000Z",
  },
  {
    id: 5,
    title: "Bảng lỗi cũ máy lạnh inverter 2020",
    content:
      "Tài liệu mã lỗi đời cũ, nhiều mã không còn khớp với firmware mới. Chỉ dùng để đối chiếu lịch sử, không dùng làm nguồn trả lời chính cho AI.",
    category: "Máy lạnh",
    source: "Archive 2020",
    accessLevel: "ADVANCED",
    embeddingStatus: "STALE",
    isOutdated: true,
    needsAiCoverage: false,
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-10T08:00:00.000Z",
  },
];