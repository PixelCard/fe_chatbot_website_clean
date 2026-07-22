import { QuoteItem, QuoteLifecycleStatus } from "../types/quote.types";

// CẤU TRÚC KỊCH BẢN PHÂN BỔ THEO ĐẶC TẢ BA MỤC 14
interface QuoteScenario {
  status: QuoteLifecycleStatus;
  sessionStatus: string;
  isOverdueLv1: boolean;
  isOverdueLv2: boolean;
  isStateMismatch: boolean;
  isAbnormalAmount: boolean;
  issueSummary: string;
  deviceName: string;
}

const CUSTOMER_NAMES = [
  "Nguyễn Văn Hùng", "Trần Thị Lan", "Lê Quốc Bảo", "Phạm Minh Châu", "Đoàn Thu Hà",
  "Nguyễn Hoàng Nam", "Bùi Thị Yến", "Võ Quang Huy", "Đặng Mỹ Linh", "Đinh Gia Huy",
  "Hoàng Trọng Nghĩa", "Nguyễn Bích Thủy", "Phan Thanh Tùng", "Vũ Mai Phương", "Lý Hải Đăng"
];

const TECHNICIAN_NAMES = [
  "Lê Minh Tuấn", "Nguyễn Đức Khoa", "Phạm Văn Long", "Hoàng Gia Bảo", "Trần Quốc Đạt",
  "Võ Tuấn Kiệt", "Đỗ Xuân Trường", "Bùi Vĩnh Hưng", "Nguyễn Văn Tâm", "Trịnh Đình Quang"
];

const AREAS = [
  "Quận 1, TP. Hồ Chí Minh", "Quận 3, TP. Hồ Chí Minh", "Quận 10, TP. Hồ Chí Minh",
  "Quận Tân Bình, TP. Hồ Chí Minh", "Quận Bình Thạnh, TP. Hồ Chí Minh", "Quận 7, TP. Hồ Chí Minh",
  "Thành phố Thủ Đức, TP. Hồ Chí Minh", "Quận Gò Vấp, TP. Hồ Chí Minh", "Quận Phú Nhuận, TP. Hồ Chí Minh"
];

// Hàm phụ trợ tạo chuỗi thời gian ISO tĩnh dịch chuyển theo phút
function getPastIsoTime(minutesAgo: number): string {
  const baseTime = new Date("2026-05-29T17:30:00.000Z"); // Fix cứng mốc thời gian hiện tại
  baseTime.setMinutes(baseTime.getMinutes() - minutesAgo);
  return baseTime.toISOString();
}

// KHỞI TẠO MẠNG LƯỚI TÌNH HUỐNG THỰC TẾ (EDGE CASES MỤC 14.2)
const SCENARIOS_POOL: QuoteScenario[] = [
  {
    status: "PENDING",
    sessionStatus: "ARRIVED",
    isOverdueLv1: true,
    isOverdueLv2: true, // Ca treo nặng quá 2 giờ
    isStateMismatch: false,
    isAbnormalAmount: false,
    deviceName: "Máy lạnh Daikin Inverter 1.5 HP",
    issueSummary: "Thay tụ đề block chính + Hàn ống đồng rò rỉ gas gói thực địa"
  },
  {
    status: "ACCEPTED",
    sessionStatus: "ARRIVED", // Khách Accepted nhưng ca máy vẫn ở ARRIVED -> Lỗi lệch trạng thái
    isOverdueLv1: false,
    isOverdueLv2: false,
    isStateMismatch: true,
    isAbnormalAmount: false,
    deviceName: "Tủ lạnh Panasonic 400L",
    issueSummary: "Thay rơ-le xả đá cảm biến nhiệt độ âm tủ"
  },
  {
    status: "PENDING",
    sessionStatus: "MATCHED",
    isOverdueLv1: true,
    isOverdueLv2: false, // Treo nhẹ quá 30 phút
    isStateMismatch: false,
    isAbnormalAmount: false,
    deviceName: "Máy giặt Electrolux cửa ngang 9kg",
    issueSummary: "Thay dây curoa truyền động chính hãng + Vệ sinh lồng giặt"
  },
  {
    status: "PENDING",
    sessionStatus: "ARRIVED",
    isOverdueLv1: false,
    isOverdueLv2: false,
    isStateMismatch: false,
    isAbnormalAmount: true, // Tiền bất thường vượt ngưỡng vận hành
    deviceName: "Máy nước nóng Ariston 30L",
    issueSummary: "Sửa bo mạch chống giật ELCB phát sinh (Báo khống giá trần)"
  },
  {
    status: "REJECTED",
    sessionStatus: "MATCHED",
    isOverdueLv1: false,
    isOverdueLv2: false,
    isStateMismatch: false,
    isAbnormalAmount: false,
    deviceName: "Máy lọc nước Kangaroo 9 lõi",
    issueSummary: "Thay thế toàn bộ 3 lõi lọc thô + Van áp cao phát sinh"
  },
  {
    status: "ACCEPTED",
    sessionStatus: "IN_PROGRESS", // Ca máy chạy ổn định chuẩn flow
    isOverdueLv1: false,
    isOverdueLv2: false,
    isStateMismatch: false,
    isAbnormalAmount: false,
    deviceName: "Lò vi sóng Sharp 25L",
    issueSummary: "Thay bóng đèn viba phát sóng viba chính hãng"
  }
];

function generateMockQuotes(): QuoteItem[] {
  const list: QuoteItem[] = [];

  // Sinh chính xác 60 bản ghi phân bổ đều tính huống theo DoD mục 14.1
  for (let i = 0; i < 60; i++) {
    const scenarioIndex = i % SCENARIOS_POOL.length;
    const scenario = SCENARIOS_POOL[scenarioIndex];

    const quoteNo = 1001 + i;
    const sessionNo = 9011 + (i % 15); // Cố tình trùng lặp sessionId để test case 1 ca có nhiều quote (Mục 14.2)

    const id = `Q-20260529-${String(quoteNo).padStart(4, "0")}`;
    const sessionId = `CHAT-${sessionNo}`;

    // Tính toán số phút chờ dựa trên kịch bản để đồng bộ logic phái sinh
    let waitingMinutes = 0;
    if (scenario.status === "PENDING") {
      if (scenario.isOverdueLv2) waitingMinutes = 145; // Quá 2 giờ
      else if (scenario.isOverdueLv1) waitingMinutes = 42;  // Quá 30 phút
      else waitingMinutes = 12;
    }

    // Tính toán số tiền thực tế (Bao gồm cả case bất thường khống giá)
    let totalAmount = 250000 + ((i * 135000) % 950000);
    if (scenario.isAbnormalAmount) {
      totalAmount = i % 2 === 0 ? 0 : 9500000; // Tiền = 0đ hoặc vọt lên 9.5 triệu
    }

    // Gán nhãn trạng thái chính xác dựa trên phân bổ mục 14.1
    let finalStatus: QuoteLifecycleStatus = scenario.status;
    if (i >= 0 && i < 25) finalStatus = "PENDING";
    else if (i >= 25 && i < 47) finalStatus = "ACCEPTED";
    else finalStatus = "REJECTED";

    list.push({
      id,
      sessionId,
      technicianId: `TECH-${500 + (i % TECHNICIAN_NAMES.length)}`,
      customerName: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
      customerPhone: `09${String(10000000 + i * 2357).slice(0, 8)}`,
      technicianName: TECHNICIAN_NAMES[i % TECHNICIAN_NAMES.length],
      deviceName: scenario.deviceName,
      issueSummary: scenario.issueSummary,
      totalAmount,
      currency: "VND",
      status: finalStatus,
      createdAt: getPastIsoTime(waitingMinutes === 0 ? 60 + i : waitingMinutes),
      updatedAt: getPastIsoTime(i),
      sessionStatus: finalStatus === "ACCEPTED" && !scenario.isStateMismatch ? "IN_PROGRESS" : scenario.sessionStatus,
      waitingMinutes,
      isOverdueLv1: waitingMinutes > 30,
      isOverdueLv2: waitingMinutes > 120,
      isStateMismatch: finalStatus === "ACCEPTED" && scenario.isStateMismatch,
      isCurrentQuote: i % 4 !== 0, // Đánh dấu ngẫu nhiên để audit nhiều quote cùng session (Mục 8.4)
      isAbnormalAmount: scenario.isAbnormalAmount,
      address: AREAS[i % AREAS.length],
      history: [
        { id: `H-${i}-1`, action: "Đã khởi tạo báo giá chi tiết kỹ thuật", actor: "TECHNICIAN", at: "14:30", note: "Khảo sát thực địa block máy" },
        ...(finalStatus === "ACCEPTED" ? [{ id: `H-${i}-2`, action: "Khách hàng xác nhận đồng ý dòng tiền", actor: "USER", at: "14:40" }] : []),
        ...(finalStatus === "REJECTED" ? [{ id: `H-${i}-2`, action: "Khách hàng từ chối đàm phán giá thành", actor: "USER", at: "14:52", note: "Giá linh kiện quá cao so với thị trường" }] : [])
      ],
      machineShifts: []
    });
  }

  return list;
}

export const quotesMockData: QuoteItem[] = generateMockQuotes();