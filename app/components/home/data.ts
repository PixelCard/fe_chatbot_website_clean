import type { LucideIcon } from "lucide-react";
import {
    Bot,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    Headphones,
    History,
    Laptop,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Smartphone,
    Snowflake,
    Sparkles,
    UserCheck,
    WashingMachine,
    Wrench,
    Zap,
} from "lucide-react";

export type HomeSection = {
    id: string;
    label: string;
};

export type IconItem = {
    title: string;
    desc: string;
    icon: LucideIcon;
};

export type ProcessStep = {
    title: string;
    desc: string;
    icon: LucideIcon;
};

export type FeedbackItem = {
    name: string;
    role: string;
    content: string;
    rating: number;
};

export type ChatMessage = {
    role: "ai" | "user";
    msg: string;
};

export type ServiceCategory = {
    title: string;
    desc: string;
    icon: LucideIcon;
};

export const homeSections: HomeSection[] = [
    { id: "hero", label: "Giới thiệu" },
    { id: "trust", label: "Lợi ích" },
    { id: "process", label: "Quy trình" },
    { id: "ai-preview", label: "AI tư vấn" },
    { id: "feedback", label: "Đánh giá" },
    { id: "assistant", label: "Bắt đầu" },
];

export const heroTrustChips: IconItem[] = [
    {
        title: "AI hỏi từng bước",
        desc: "Không bắt người dùng tự đoán lỗi.",
        icon: Bot,
    },
    {
        title: "Gọi thợ khi cần",
        desc: "Chỉ chuyển ca khi đã đủ thông tin.",
        icon: Wrench,
    },
    {
        title: "Theo dõi rõ ràng",
        desc: "Nắm được báo giá và tiến độ xử lý.",
        icon: History,
    },
];

export const trustItems: IconItem[] = [
    {
        title: "AI hỏi từng bước",
        desc: "Người dùng chỉ cần mô tả hiện tượng, AI sẽ hỏi thêm thông tin cần thiết.",
        icon: Headphones,
    },
    {
        title: "Chẩn đoán sơ bộ",
        desc: "Tổng hợp thiết bị, triệu chứng, mức độ rủi ro và hướng xử lý ban đầu.",
        icon: Sparkles,
    },
    {
        title: "Gọi thợ đúng lúc",
        desc: "Khi cần sửa trực tiếp, hệ thống mới chuyển sang luồng gọi kỹ thuật viên.",
        icon: UserCheck,
    },
    {
        title: "Theo dõi tiến độ",
        desc: "Người dùng theo dõi báo giá, trạng thái xử lý và lịch sử sửa chữa.",
        icon: ShieldCheck,
    },
];

export const processSteps: ProcessStep[] = [
    {
        title: "Mô tả lỗi với AI",
        desc: "Người dùng nhập loại thiết bị, hiện tượng lỗi, hình ảnh hoặc dấu hiệu bất thường.",
        icon: ClipboardCheck,
    },
    {
        title: "AI chẩn đoán sơ bộ",
        desc: "AI hỏi thêm thông tin, tổng hợp tình trạng và gợi ý nguyên nhân có thể xảy ra.",
        icon: Bot,
    },
    {
        title: "Xác nhận gọi thợ",
        desc: "Khi cần sửa trực tiếp, người dùng xác nhận tên, số điện thoại và địa chỉ hỗ trợ.",
        icon: UserCheck,
    },
    {
        title: "Theo dõi sửa chữa",
        desc: "Người dùng theo dõi báo giá, kỹ thuật viên nhận ca và tiến độ hoàn tất.",
        icon: Clock,
    },
];

export const serviceCategories: ServiceCategory[] = [
    {
        title: "Laptop / PC",
        desc: "Lỗi nguồn, màn hình, bàn phím, ổ cứng, phần mềm và hiệu năng.",
        icon: Laptop,
    },
    {
        title: "Điện thoại",
        desc: "Màn hình, pin, sạc, loa, camera và các lỗi sử dụng thường gặp.",
        icon: Smartphone,
    },
    {
        title: "Điện lạnh",
        desc: "Tủ lạnh, máy lạnh, máy giặt và các thiết bị điện lạnh gia đình.",
        icon: Snowflake,
    },
    {
        title: "Điện gia dụng",
        desc: "Thiết bị nhà bếp, máy lọc, quạt, máy bơm và thiết bị dân dụng khác.",
        icon: WashingMachine,
    },
];

export const feedbacks: FeedbackItem[] = [
    {
        name: "Anh Minh Tuấn",
        role: "Sửa tủ lạnh Side-by-Side",
        content:
            "AI hỏi đúng các dấu hiệu cần thiết nên thợ đến kiểm tra nhanh hơn và báo giá rõ ràng.",
        rating: 5,
    },
    {
        name: "Chị Thu Hương",
        role: "Sửa máy giặt Electrolux",
        content:
            "Tôi chỉ cần mô tả lỗi trong chat, hệ thống gợi ý hướng xử lý và hỗ trợ gọi thợ rất tiện.",
        rating: 5,
    },
    {
        name: "Anh Quốc Bảo",
        role: "Sửa điều hòa Daikin",
        content:
            "Phần theo dõi trạng thái đơn hàng rõ ràng, biết được thợ đã nhận ca và khi nào đến.",
        rating: 5,
    },
];

export const chatMessages: ChatMessage[] = [
    { role: "ai", msg: "Xin chào! Thiết bị của bạn gặp vấn đề gì?" },
    { role: "user", msg: "Tủ lạnh không làm lạnh được ạ" },
    { role: "ai", msg: "Bạn nghe thấy tiếng động lạ từ máy nén không?" },
    { role: "user", msg: "Có tiếng rè rè ạ" },
];

export const diagnosisSummary = [
    {
        label: "Thiết bị",
        value: "Tủ lạnh",
    },
    {
        label: "Triệu chứng",
        value: "Không lạnh, có tiếng rè",
    },
    {
        label: "Rủi ro",
        value: "Cần kiểm tra block / rơ-le",
    },
    {
        label: "Đề xuất",
        value: "Nên gọi thợ điện lạnh",
    },
];

export const footerContacts = [
    {
        icon: Phone,
        label: "0909 xxx xxx",
    },
    {
        icon: Mail,
        label: "support@smartelec.vn",
    },
    {
        icon: MapPin,
        label: "TP. Hồ Chí Minh, Việt Nam",
    },
];

export const finalCtaFeatures = [
    {
        title: "Chẩn đoán trước",
        desc: "AI gom thông tin trước khi phát đơn cho kỹ thuật viên.",
        icon: Zap,
    },
    {
        title: "Gọi thợ đúng lúc",
        desc: "Form xác nhận chỉ hiện khi người dùng đã sẵn sàng đặt lịch.",
        icon: CheckCircle2,
    },
];

export const HOME_ANIMATIONS = {
    heroRobot: "/animations/Robot Futuristic Ai animated.lottie",
    manRobot: "/animations/Man_robot_sitting_together.lottie",
    airConditioner: "/animations/Air Conditioner and Heater.lottie",
    success: "/animations/Success.lottie",
    error: "/animations/Error animation.lottie",
    error404: "/animations/Error 404.lottie",
    loading: "/animations/Sandy Loading.lottie",
    skeletonLoading: "/animations/Skeleton frame loading.lottie",
    catLoading: "/animations/cat Mark loading.lottie",
    digitalMarketing: "/animations/Digital marketing social media and data analysis.lottie",
} as const;

export const HERO_LOTTIE_SRC = HOME_ANIMATIONS.heroRobot;

export type HomeAnimationKey = keyof typeof HOME_ANIMATIONS;