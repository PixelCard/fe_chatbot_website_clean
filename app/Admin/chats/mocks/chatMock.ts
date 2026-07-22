import { ChatMessage, ChatSession, SenderType } from "../types/chat.types";

type Scenario = {
    code: string;
    status: string;
    dangerous: boolean;
    flagged: boolean;
    withTechnician: boolean; // Trường dữ liệu bắt buộc của hệ thống
    flagReason?: string;
    topic: string;
    lastMessage: string;
    pattern: SenderType[];
    snippets: Partial<Record<SenderType, string[]>>;
};

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

const SCENARIOS: Scenario[] = [
    {
        code: "CONSULT_OK",
        status: "AI_CONSULTING",
        dangerous: false,
        flagged: false,
        withTechnician: false,
        topic: "Tư vấn lỗi bo mạch cơ bản",
        lastMessage: "AI đã hướng dẫn các bước kiểm tra điện áp đầu vào.",
        pattern: ["USER", "AI", "USER", "AI"],
        snippets: {
            USER: [
                "Máy giặt Electrolux nhà tôi bật nguồn chỉ nháy đèn đỏ rồi lịm luôn.",
                "Tôi đã thử rút điện ra cắm lại ổ khác bên cạnh nhưng vẫn bị tình trạng cũ.",
                "Bảng điều khiển không hiển thị mã lỗi gì cả, chỉ có đèn start nhấp nháy.",
                "Chi phí sửa bo mạch này khoảng bao nhiêu vậy trợ lý ơi?",
                "Ok vậy hệ thống lưu thông tin giúp tôi để tôi sắp xếp thời gian đặt lịch sau."
            ],
            AI: [
                "Chào anh/chị, hiện tượng nháy đèn đỏ rồi tắt thường do lỗi sụt áp hoặc chạm chập bo mạch nguồn.",
                "Anh/chị vui lòng kiểm tra xem cửa máy giặt đã được đóng khít hoàn toàn chưa ạ?",
                "Dựa trên mô tả, khả năng cao IC nguồn trên bo mạch điều khiển chính đã bị tổn hại.",
                "Thông thường gói định giá sửa bo mạch dao động từ 450k đến 750k tùy mức độ hư hại linh kiện.",
                "Trợ lý AI đã ghi nhận nhu cầu, khi nào cần đặt lịch thợ anh/chị cứ nhấn yêu cầu nhé."
            ],
            SYSTEM: ["Hệ thống AI tiếp nhận thông tin hội thoại."]
        }
    },
    {
        code: "PRICE_DISPUTE",
        status: "IN_PROGRESS",
        dangerous: true,
        flagged: true,
        withTechnician: true, // ĐÃ BỔ SUNG
        flagReason: "Thợ tự ý đòi thêm tiền phụ phí sạc gas ngoài báo giá cứng của ứng dụng.",
        topic: "Tranh chấp báo giá thực địa",
        lastMessage: "Điều phối viên cần can thiệp xử lý vấn đề hét giá của thợ.",
        pattern: ["SYSTEM", "TECHNICIAN", "USER", "TECHNICIAN", "USER"],
        snippets: {
            SYSTEM: [
                "Hệ thống điều phối tự động gán kỹ thuật viên vào ca sửa chữa.",
                "Thợ kỹ thuật đã check-in tại vị trí máy lạnh của khách hàng."
            ],
            TECHNICIAN: [
                "Chị ơi tôi kiểm tra kỹ rồi, máy này ngoài chết tụ còn bị rò rỉ hết sạch gas chân block.",
                "Cái này phải hàn lại ống đồng rồi nạp lại gas mới chạy được, phát sinh thêm 550k nữa.",
                "Giá hiển thị trên ứng dụng chỉ là tiền công sửa bo mạch thôi, không bao gồm gas đâu chị.",
                "Nếu chị không đồng ý chi phí phát sinh này thì tôi không thể tiến hành lắp máy lại được."
            ],
            USER: [
                "Tại sao lại phát sinh nhiều tiền thế anh? Lúc đặt lịch app báo trọn gói gói sửa mạch rồi mà?",
                "Tôi không đồng ý, anh làm việc buồn cười thế, thợ tự ý vẽ thêm bệnh để đòi tiền à?",
                "Tôi đang gọi điện trực tiếp lên tổng đài để khiếu nại hành vi hét giá thực địa này của anh.",
                "Anh dừng ngay thao tác lại, giữ nguyên hiện trạng máy đó cho tôi, không sửa sang gì nữa!"
            ]
        }
    },
    {
        code: "NO_TECH_DISPUTE",
        status: "BROADCASTING",
        dangerous: true,
        flagged: true,
        withTechnician: false, // ĐÃ BỔ SUNG
        flagReason: "Hệ thống treo phát đơn quá lâu (SLA > 45 phút), khách hàng liên tục spam chửi bới.",
        topic: "Bực xúc vì hệ thống chậm gán thợ",
        lastMessage: "Khách đe dọa hủy đơn và đánh giá 1 sao lên kho ứng dụng.",
        pattern: ["USER", "AI", "USER", "AI", "USER"],
        snippets: {
            USER: [
                "Alo hệ thống làm ăn kiểu gì thế? Tôi đặt đơn từ hơn 45 phút trước mà chưa thấy thợ nào gọi?",
                "Thời tiết nóng bức 40 độ C thế này mà bắt người ta ngồi chờ vô thời hạn à?",
                "Nếu trong 10 phút nữa không có thợ xác nhận, tôi sẽ hủy đơn và vote 1 sao app ngay lập tức.",
                "Quá thất vọng với tốc độ điều phối của bên các bạn, tổng đài cũng không ai bắt máy!"
            ],
            AI: [
                "Dạ xin lỗi anh/chị vì trải nghiệm không tốt, hệ thống đang ưu tiên điều phối thợ khu vực gần nhất.",
                "Hệ thống đã tự động đẩy mức độ khẩn cấp của ca máy này lên mức cao nhất (Priority Critical).",
                "Trợ lý AI đang gửi tín hiệu cưỡng chế trực tiếp đến các thợ có định vị trong bán kính 2km."
            ],
            SYSTEM: ["Đơn hàng vượt ngưỡng SLA phản hồi chuẩn của hệ thống."]
        }
    },
    {
        code: "COMPLETED_NEW_MSG",
        status: "COMPLETED",
        dangerous: true,
        flagged: true,
        withTechnician: true, // ĐÃ BỔ SUNG
        flagReason: "Ca máy đã hoàn thành thanh toán nhưng lỗi cũ tái phát lập tức sau 2 ngày.",
        topic: "Khiếu nại sau khi hoàn tất",
        lastMessage: "Yêu cầu thợ quay lại thực hiện nghĩa vụ bảo hành khẩn cấp.",
        pattern: ["SYSTEM", "USER", "AI", "TECHNICIAN", "USER"],
        snippets: {
            SYSTEM: [
                "Ca sửa chữa mã số được thợ đánh giá hoàn tất, hệ thống đóng lệnh di chuyển.",
                "Khách hàng đã thực hiện thanh toán trọn gói qua cổng điện tử."
            ],
            USER: [
                "Anh thợ ơi xem lại giúp tôi với, tủ lạnh vừa sửa xong chạy được 2 hôm giờ lại đóng tuyết đặc cứng.",
                "Đồ ăn bên trong hỏng hết rồi, anh bảo hành kiểu gì vậy? Gọi điện thuê bao không liên lạc được.",
                "Yêu cầu bên công ty cử người quay lại xử lý ngay, tiền thì thu đủ mà sửa không ra gì cả.",
                "Tôi cần lịch hẹn chính xác thợ quay lại bảo hành, không thể cứ bắt tôi chờ đợi thế này được."
            ],
            AI: [
                "Dạ hệ thống đã tiếp nhận yêu cầu bảo hành khẩn cấp của anh/chị và chuyển tới điều phối viên.",
                "Yêu cầu bảo hành đã được phê duyệt tự động và chuyển trạng thái giám sát nội bộ."
            ],
            TECHNICIAN: [
                "Dạ chị ơi hôm nay em đang chạy ca tỉnh, chiều muộn tầm 5h em qua kiểm tra lại miễn phí cho chị nhé.",
                "Chị rút điện tủ ra giúp em trước nhé, em sẽ kiểm tra lại con rơ-le tuyết xem sao."
            ]
        }
    },
    {
        code: "SPAM",
        status: "AI_CONSULTING",
        dangerous: true,
        flagged: true,
        withTechnician: false, // ĐÃ BỔ SUNG
        flagReason: "Spam tin nhắn rác hoặc cố ý phá hoại luồng xử lý của tổng đài AI.",
        topic: "Spam nội dung quấy rối",
        lastMessage: "Hệ thống tự động phát hiện hành vi spam tần suất cao.",
        pattern: ["USER", "USER", "USER", "AI", "SYSTEM"],
        snippets: {
            USER: [
                "Alo alo có ai không? Trả lời đi chứ lị?",
                "Chấm chấm chấm..................",
                "Hahaha app lỗi rồi à sao không thấy ai nói năng gì thế?",
                "Rep ib nhanh lên shop ơi rep ib nhanh lêneeeeeeee",
                "Test hệ thống tí thôi làm gì căng thẳng thế hả robot?"
            ],
            AI: [
                "Chào anh/chị, yêu cầu của anh/chị đã được tiếp nhận. Vui lòng nhập rõ lỗi thiết bị cần hỗ trợ.",
                "Hệ thống đang bận xử lý dữ liệu, xin vui lòng không gửi quá nhiều ký tự trùng lặp."
            ],
            SYSTEM: [
                "Cảnh báo: Phát hiện spam tin nhắn liên tục trong vòng 5 giây.",
                "Hệ thống tự động gắn cờ theo dõi hành vi đối với tài khoản người dùng."
            ]
        }
    },
    {
        code: "NORMAL_PROGRESS",
        status: "IN_PROGRESS",
        dangerous: false,
        flagged: false,
        withTechnician: true,
        topic: "Tiến trình sửa chữa ổn định",
        lastMessage: "Thợ đang tiến hành test áp suất sau khi hàn ống đồng.",
        pattern: ["SYSTEM", "TECHNICIAN", "USER", "TECHNICIAN", "AI"],
        snippets: {
            SYSTEM: [
                "Hệ thống ghi nhận thợ kỹ thuật bắt đầu tiến trình sửa chữa.",
                "Báo giá chính thức đã được hai bên xác nhận qua ứng dụng."
            ],
            TECHNICIAN: [
                "Tôi đã tháo vỏ máy kiểm tra, block vẫn chạy tốt, chỉ bị hỏng tụ đề thôi nhé anh.",
                "Tiến hành thay tụ đề chính hãng Daikin, thời gian thay khoảng 20 phút.",
                "Tôi đã thay xong tụ, máy đang kích dòng chạy thử, hơi lạnh ra đều rồi nhé anh.",
                "Anh kiểm tra lại xem máy lạnh chạy êm chưa để tôi dọn dẹp dụng cụ bàn giao."
            ],
            USER: [
                "Ok anh, cứ kiểm tra kỹ và thay linh kiện chuẩn giúp tôi, cần thiết cứ báo.",
                "Vâng tôi thấy gió thổi ra mát hơn hẳn rồi đấy, tiếng block chạy cũng êm hơn.",
                "Để tôi bật chạy thử 10 phút xem có bị ngắt đột ngột như mọi khi không nhé."
            ],
            AI: [
                "Hệ thống ghi nhận ca sửa chữa đang diễn ra đúng tiến độ SLA chuẩn.",
                "Trợ lý AI chuẩn bị thủ tục xuất hóa đơn điện tử bảo hành."
            ]
        }
    },
    {
        code: "CANCELLED_FOLLOWUP",
        status: "CANCELLED",
        dangerous: false,
        flagged: true,
        withTechnician: true, // ĐÃ BỔ SUNG
        flagReason: "Khách hủy ca máy giữa chừng nhưng đòi hoàn tiền cọc giữ lịch khẩn cấp.",
        topic: "Hủy ca đòi hoàn trả chi phí",
        lastMessage: "Hệ thống ghi nhận khiếu nại hoàn cọc của khách hàng.",
        pattern: ["SYSTEM", "USER", "AI", "USER"],
        snippets: {
            SYSTEM: [
                "Lệnh hủy ca máy sửa chữa được kích hoạt từ phía người dùng.",
                "Hệ thống ghi nhận lý do hủy: Thay đổi kế hoạch cá nhân."
            ],
            USER: [
                "Tôi bấm hủy đơn rồi nhưng sao ví điện tử của tôi vẫn bị trừ 50k phí giữ lịch thợ vậy?",
                "Thợ chưa hề đến nhà tôi cơ mà, yêu cầu hệ thống hoàn lại tiền ngay cho tôi.",
                "Nếu không hoàn tiền tôi sẽ xóa app và phản ánh lên các hội nhóm mạng xã hội về hành vi chiếm đoạt này."
            ],
            AI: [
                "Dạ theo chính sách, lệnh hủy dưới 15 phút trước giờ hẹn sẽ được hoàn 100% phí cọc về ví trong 24 giờ ạ.",
                "Hệ thống đã tự động lập phiếu hoàn toán mã số gửi bộ phận kế toán kiểm duyệt."
            ]
        }
    },
    {
        code: "ESCALATE_SAFETY",
        status: "ARRIVED",
        dangerous: true,
        flagged: true,
        withTechnician: true,
        flagReason: "Khách hàng có thái độ bạo lực, de dọa tấn công thợ kỹ thuật tại hiện trường.",
        topic: "Nguy cơ đe dọa an toàn lao động",
        lastMessage: "Mức độ khẩn cấp Critical - Admin cần gọi điện can thiệp lập tức.",
        pattern: ["USER", "TECHNICIAN", "USER", "AI", "SYSTEM"],
        snippets: {
            USER: [
                "Thằng thợ làm ăn láo nháo, mày bước ra khỏi nhà tao xem có bị đập không?",
                "Đừng để tao nóng mắt, sửa không được tao giữ luôn đồ nghề ở đây không cho về đâu.",
                "Tao đang gọi người đến đây nói chuyện phải trái với mày, làm hỏng máy của tao còn đòi tiền à?"
            ],
            TECHNICIAN: [
                "Anh ơi em kiểm tra đúng quy trình mà, máy anh bị chập cháy mạch từ trước chứ em không hề làm hỏng.",
                "Anh bình tĩnh đừng kích động, có gì mình trao đổi văn minh hoặc gọi công ty giải quyết.",
                "Em xin phép dừng ca sửa chữa ở đây để bảo đảm an toàn, em sẽ lắp lại vỏ máy trả anh."
            ],
            AI: [
                "Hệ thống phát hiện ngôn từ có xu hướng bạo lực cao đe dọa an toàn nhân sự.",
                "Đang kích hoạt quy trình bảo vệ khẩn cấp và chuyển thông tin cho ban chỉ huy trung tâm."
            ],
            SYSTEM: [
                "Tự động khóa tài khoản người dùng tạm thời để điều tra xung đột hiện trường.",
                "Cảnh báo Critical: Đề xuất Admin can thiệp cưỡng chế hoặc liên hệ cơ quan chức năng."
            ]
        }
    }
];

function toIso(baseHour: number, minuteOffset: number) {
    const hour = baseHour + Math.floor(minuteOffset / 60);
    const minute = minuteOffset % 60;
    return `2026-05-28T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`;
}

function buildMessageContent(sender: SenderType, scenario: Scenario, idx: number) {
    const pool = scenario.snippets[sender];
    if (!pool || pool.length === 0) {
        return `${scenario.topic} - Thông điệp ghi nhận diễn biến thứ ${idx + 1}`;
    }
    return pool[idx % pool.length];
}

function buildMessages(sessionId: string, scenario: Scenario, total: number, startHour: number): ChatMessage[] {
    const messages: ChatMessage[] = [];
    for (let i = 0; i < total; i += 1) {
        const senderType = scenario.pattern[i % scenario.pattern.length];
        messages.push({
            id: `MSG-${sessionId}-${String(i + 1).padStart(3, "0")}`,
            sessionId,
            senderType,
            content: buildMessageContent(senderType, scenario, i),
            createdAt: toIso(startHour, i * 4),
        });
    }
    return messages;
}

function buildSession(index: number): ChatSession {
    const sessionNo = 9011 + index;
    const sessionId = `CHAT-${sessionNo}`;
    const scenario = SCENARIOS[index % SCENARIOS.length];
    const customerName = CUSTOMER_NAMES[index % CUSTOMER_NAMES.length];
    const withTechnician = scenario.withTechnician;

    const technicianName = withTechnician ? TECHNICIAN_NAMES[index % TECHNICIAN_NAMES.length] : null;
    const technicianId = withTechnician ? `TECH-${500 + (index % TECHNICIAN_NAMES.length)}` : null;

    const messageCount = 15 + ((index * 9) % 31);
    const startHour = 8 + (index % 12);
    const messages = buildMessages(sessionId, scenario, messageCount, startHour);

    return {
        id: sessionId,
        status: scenario.status,
        userId: `USR-${String(index + 1).padStart(3, "0")}`,
        customerName,
        customerPhone: `09${String(10000000 + index * 1793).slice(0, 8)}`,
        technicianId,
        technicianName,
        isDangerous: scenario.dangerous,
        isFlagged: scenario.flagged,
        flagReason: scenario.flagged ? scenario.flagReason ?? "Hội thoại có dấu hiệu bất thường, được hệ thống gắn cờ tự động." : null,
        lastMessage: messages[messages.length - 1]?.content ?? scenario.lastMessage,
        updatedAt: messages[messages.length - 1]?.createdAt ?? toIso(22, 0),
        address: AREAS[index % AREAS.length],
        messages,
    };
}

export const chatSessionsMock: ChatSession[] = Array.from({ length: 50 }, (_, i) => buildSession(i));