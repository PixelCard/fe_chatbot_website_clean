"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

type DiagnosticInfoPanelProps = {
  isOpen: boolean;
  currentDeviceLabel: string;
  symptom: string;
  risk?: string | null;
  sessionId: number | null;
  chatClosed: boolean;
  showDangerBookingCta: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
};

type RiskLevel = "RED" | "YELLOW" | "GREEN" | null;

type DiagnosticState = {
  hasDevice: boolean;
  hasSymptom: boolean;
  risk: RiskLevel;
  progress: number;
  canBook: boolean;
  statusLabel: string;
  title: string;
  description: string;
  bookingLabel: string;
  tone: "idle" | "collecting" | "ready" | "danger";
};

function isKnownDevice(device: string) {
  const value = device.trim().toLowerCase();

  return (
    value.length > 0 &&
    value !== "chưa xác định" &&
    value !== "chưa cập nhật"
  );
}

function hasUsefulSymptom(symptom: string) {
  return symptom.trim().length >= 3;
}

function hasDetailedSymptom(symptom: string) {
  return symptom.trim().length >= 10;
}

function getCompactSymptom(symptom: string) {
  const value = symptom.trim().replace(/\s+/g, " ");

  if (!value) {
    return "Chưa có mô tả lỗi. Hãy nhập nội dung trong khung chat.";
  }

  const normalized = value.toLowerCase();

  const includesAny = (keywords: string[]) =>
    keywords.some((keyword) => normalized.includes(keyword));

  if (
    includesAny([
      "bốc khói",
      "có khói",
      "mùi khét",
      "có mùi khét",
      "cháy khét",
      "khét",
    ])
  ) {
    return "Có khói hoặc mùi khét";
  }

  if (includesAny(["rò điện", "điện giật", "bị giật điện"])) {
    return "Rò điện";
  }

  if (includesAny(["rò gas", "xì gas", "mùi gas"])) {
    return "Rò gas";
  }

  if (includesAny(["rò nước", "chảy nước", "rỉ nước"])) {
    return "Rò nước";
  }

  if (
    includesAny([
      "không làm nóng",
      "không nóng",
      "ko nóng",
      "kh nóng",
      "vẫn nguội",
      "đồ ăn nguội",
      "đồ ăn vẫn nguội",
      "quay xong vẫn nguội",
    ])
  ) {
    return "Không nóng";
  }

  if (
    includesAny([
      "không làm lạnh",
      "không lạnh",
      "ko lạnh",
      "kh lạnh",
      "không mát",
      "ko mát",
      "kh mát",
      "chẳng thấy mát",
    ])
  ) {
    return "Không lạnh";
  }

  if (
    includesAny([
      "bị nóng",
      "phòng vẫn nóng",
      "phòng nóng",
      "phòng hầm hầm",
      "hầm hầm",
      "nóng mặc dù",
    ])
  ) {
    return "Bị nóng";
  }

  if (
    includesAny([
      "không vắt",
      "ko vắt",
      "kh vắt",
      "không chịu vắt",
      "đồ còn sũng nước",
      "quần áo sũng nước",
      "đồ sũng nước",
    ])
  ) {
    return "Không vắt";
  }

  if (
    includesAny([
      "không lên nguồn",
      "ko lên nguồn",
      "kh lên nguồn",
      "không vào điện",
      "ko vào điện",
      "mất nguồn",
    ])
  ) {
    return "Không lên nguồn";
  }

  if (includesAny(["tự tắt", "tự ngắt", "đang dùng thì tắt"])) {
    return "Tự tắt";
  }

  if (includesAny(["không chạy", "ko chạy", "không hoạt động"])) {
    return "Không hoạt động";
  }

  if (includesAny(["mã lỗi", "báo lỗi", "hiện lỗi"])) {
    return "Báo lỗi";
  }

  if (
    includesAny([
      "kêu rè",
      "rè rè",
      "tiếng kêu lạ",
      "kêu bất thường",
      "phát tiếng lạ",
    ])
  ) {
    return "Kêu bất thường";
  }

  if (includesAny(["không sạc", "ko sạc", "không vào pin"])) {
    return "Không sạc";
  }

  if (includesAny(["chạy yếu", "hoạt động yếu", "lạnh yếu", "gió yếu"])) {
    return "Hoạt động yếu";
  }

  const firstSegment =
    value
      .split(/[\n.!?;]|,\s*(?:nhưng|mặc dù|tuy nhiên|và)\s+/i)[0]
      ?.trim() || value;

  if (firstSegment.length <= 48) {
    return firstSegment;
  }

  return `${firstSegment.slice(0, 45).trimEnd()}...`;
}

function inferRiskFromSymptom(
  symptom: string,
  risk?: string | null,
): RiskLevel {
  if (risk === "RED" || risk === "YELLOW" || risk === "GREEN") {
    return risk;
  }

  const text = symptom.trim().toLowerCase();

  const dangerKeywords = [
    "cháy",
    "khét",
    "bốc khói",
    "nổ",
    "tia lửa",
    "rò điện",
    "điện giật",
    "chập",
    "nóng bất thường",
    "rò gas",
    "rò nước",
    "không ngắt",
  ];

  const warningKeywords = [
    "không lạnh",
    "không chạy",
    "không lên nguồn",
    "kêu",
    "rè",
    "rè rè",
    "tự tắt",
    "báo lỗi",
    "mã lỗi",
    "yếu",
    "chậm",
    "không sạc",
    "không vào điện",
  ];

  if (dangerKeywords.some((keyword) => text.includes(keyword))) {
    return "RED";
  }

  if (warningKeywords.some((keyword) => text.includes(keyword))) {
    return "YELLOW";
  }

  if (text.length >= 24) {
    return "GREEN";
  }

  return null;
}

function getRiskLabel(risk: RiskLevel) {
  if (risk === "RED") return "Rủi ro cao";
  if (risk === "YELLOW") return "Cần kiểm tra thêm";
  if (risk === "GREEN") return "Có thể tư vấn sơ bộ";

  return "Chưa đánh giá";
}

function getRiskClass(risk: RiskLevel) {
  if (risk === "RED") {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300";
  }

  if (risk === "YELLOW") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300";
  }

  if (risk === "GREEN") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  return "border-[var(--client-muted-border)] bg-[var(--client-muted-bg)] text-[var(--client-text-secondary)]";
}

function getDiagnosticState({
  currentDeviceLabel,
  symptom,
  risk,
  chatClosed,
  showDangerBookingCta,
}: {
  currentDeviceLabel: string;
  symptom: string;
  risk?: string | null;
  chatClosed: boolean;
  showDangerBookingCta: boolean;
}): DiagnosticState {
  const hasDevice = isKnownDevice(currentDeviceLabel);
  const hasSymptom = hasUsefulSymptom(symptom);
  const isDetailed = hasDetailedSymptom(symptom);
  const inferredRisk = inferRiskFromSymptom(symptom, risk);

  /*
   * Business rule:
   * Chỉ backend risk RED mới được phép mở booking.
   * Không dùng độ dài symptom hoặc trạng thái đủ dữ liệu để cho gọi thợ.
   */
  const canBook =
    showDangerBookingCta && chatClosed === false;

  if (chatClosed) {
    return {
      hasDevice,
      hasSymptom,
      risk: inferredRisk,
      progress: 100,
      canBook: false,
      statusLabel: "Phiên đã kết thúc",
      title: "Yêu cầu gọi thợ đã được ghi nhận",
      description:
        "Phiên tư vấn AI đã kết thúc sau khi người dùng đặt kỹ thuật viên.",
      bookingLabel: "Đã gọi thợ",
      tone: "ready",
    };
  }

  if (canBook) {
    return {
      hasDevice,
      hasSymptom,
      risk: inferredRisk,
      progress: 100,
      canBook: true,
      statusLabel: "Sẵn sàng đặt thợ",
      title: "Có thể chuyển sang bước đặt thợ",
      description:
        "AI đã ghi nhận đủ thông tin cơ bản và bạn có thể tạo yêu cầu đặt thợ nếu muốn kiểm tra trực tiếp.",
      bookingLabel: "Đặt thợ",
      tone: "ready",
    };
  }

  if (!hasDevice && !hasSymptom) {
    return {
      hasDevice,
      hasSymptom,
      risk: inferredRisk,
      progress: 15,
      canBook: false,
      statusLabel: "Chưa đủ dữ liệu",
      title: "AI chưa thể kết luận",
      description:
        "Hãy mô tả thiết bị và lỗi đang gặp để AI bắt đầu chẩn đoán.",
      bookingLabel: "Chưa thể gọi thợ",
      tone: "idle",
    };
  }

  if (hasDevice && !hasSymptom) {
    return {
      hasDevice,
      hasSymptom,
      risk: inferredRisk,
      progress: 45,
      canBook: false,
      statusLabel: "Đang gom thông tin",
      title: "Đã nhận diện thiết bị",
      description:
        "Cần thêm triệu chứng, thời điểm lỗi hoặc dấu hiệu bất thường để AI đánh giá chính xác hơn.",
      bookingLabel: "Chưa thể gọi thợ",
      tone: "collecting",
    };
  }

  if (!hasDevice && hasSymptom) {
    return {
      hasDevice,
      hasSymptom,
      risk: inferredRisk,
      progress: 55,
      canBook: false,
      statusLabel: "Đang gom thông tin",
      title: "Đã có triệu chứng lỗi",
      description:
        "Cần xác định thiết bị cụ thể để AI đề xuất hướng xử lý phù hợp.",
      bookingLabel: "Chưa thể gọi thợ",
      tone: "collecting",
    };
  }

  if (
    hasDevice &&
    (isDetailed ||
      inferredRisk === "YELLOW" ||
      inferredRisk === "GREEN" ||
      inferredRisk === "RED")
  ) {
    return {
      hasDevice,
      hasSymptom,
      risk: inferredRisk,
      progress: inferredRisk === "YELLOW" ? 90 : 85,
      canBook: false,
      statusLabel: "Đã đủ thông tin",
      title: "AI đã có dữ liệu để tư vấn",
      description:
        "AI đã có thiết bị và triệu chứng chính. Hãy tiếp tục trao đổi để nhận hướng dẫn chẩn đoán sơ bộ.",
      bookingLabel: "Tiếp tục trao đổi",
      tone: "ready",
    };
  }

  return {
    hasDevice,
    hasSymptom,
    risk: inferredRisk,
    progress: 70,
    canBook: false,
    statusLabel: "Cần thêm mô tả",
    title: "Thông tin gần đủ",
    description:
      "Hãy mô tả rõ hơn: lỗi xảy ra khi nào, có âm thanh lạ, mã lỗi hoặc hiện tượng bất thường không.",
    bookingLabel: "Chưa thể gọi thợ",
    tone: "collecting",
  };
}

function getToneClasses(tone: DiagnosticState["tone"]) {
  if (tone === "danger") {
    return {
      badge:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300",
      icon: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
      progress: "from-red-500 to-orange-500",
    };
  }

  if (tone === "ready") {
    return {
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
      icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
      progress: "from-emerald-500 to-cyan-500",
    };
  }

  if (tone === "collecting") {
    return {
      badge:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300",
      icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
      progress: "from-amber-500 to-orange-500",
    };
  }

  return {
    badge:
      "border-[var(--client-muted-border)] bg-[var(--client-muted-bg)] text-[var(--client-text-secondary)]",
    icon: "bg-[var(--client-muted-bg)] text-[var(--client-text-secondary)]",
    progress: "from-slate-400 to-slate-500",
  };
}

function InfoMiniCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[18px] border border-[var(--client-muted-border)] bg-[var(--client-muted-bg)] p-3">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--client-text-muted)]">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="mt-1.5 line-clamp-2 text-[14px] font-black leading-6 text-[var(--client-text-primary)]">
        {value}
      </p>
    </div>
  );
}

function StepCheck({ done, text }: { done: boolean; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={[
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-black",
          done
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "bg-[var(--client-muted-bg)] text-[var(--client-text-muted)]",
        ].join(" ")}
      >
        {done ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Clock3 className="h-3.5 w-3.5" />
        )}
      </div>

      <p
        className={[
          "text-[13px] font-semibold leading-6",
          done
            ? "text-[var(--client-text-primary)]"
            : "text-[var(--client-text-secondary)]",
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
}

function PanelContent({
  currentDeviceLabel,
  symptom,
  risk,
  sessionId,
  chatClosed,
  showDangerBookingCta,
  onOpenBooking,
}: Omit<DiagnosticInfoPanelProps, "isOpen" | "onClose">) {
  const state = getDiagnosticState({
    currentDeviceLabel,
    symptom,
    risk,
    chatClosed,
    showDangerBookingCta,
  });

  if (state.canBook) {
    state.statusLabel = "Sẵn sàng đặt thợ";
    state.title = "Có thể chuyển sang bước đặt thợ";
    state.description =
      "AI đã ghi nhận đủ thông tin cơ bản và bạn có thể tạo yêu cầu đặt thợ nếu muốn kiểm tra trực tiếp.";
    state.bookingLabel = "Đặt thợ";
    state.tone = "ready";
  } else if (!chatClosed && state.tone === "ready") {
    state.bookingLabel = "Tiếp tục trao đổi";
  }

  const toneClasses = getToneClasses(state.tone);
  const symptomText = getCompactSymptom(symptom);

  return (
    <div className="space-y-3">
      <div className="rounded-[26px] border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="client-accent-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px]">
            <Bot className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-black text-[var(--client-text-primary)]">
              AI Diagnostic
            </p>

            <p className="mt-0.5 text-[13px] font-semibold text-[var(--client-text-muted)]">
              Tóm tắt chẩn đoán sơ bộ
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <InfoMiniCard
              icon={Wrench}
              label="Thiết bị"
              value={currentDeviceLabel}
            />

            <div
              className={`rounded-[18px] border p-3 ${getRiskClass(
                state.risk,
              )}`}
            >
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em]">
                <AlertTriangle className="h-4 w-4" />
                Rủi ro
              </div>

              <p className="mt-1.5 text-[14px] font-black leading-6">
                {getRiskLabel(state.risk)}
              </p>
            </div>
          </div>

          <InfoMiniCard
            icon={ClipboardList}
            label="Tình trạng"
            value={symptomText}
          />
        </div>
      </div>

      <div className="rounded-[26px] border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px]",
              toneClasses.icon,
            ].join(" ")}
          >
            {state.canBook ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <Sparkles className="h-6 w-6" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={[
                "inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em]",
                toneClasses.badge,
              ].join(" ")}
            >
              {state.statusLabel}
            </span>

            <h3 className="mt-3 text-[17px] font-black leading-7 text-[var(--client-text-primary)]">
              {state.title}
            </h3>

            <p className="mt-1.5 text-[13px] font-semibold leading-6 text-[var(--client-text-secondary)]">
              {state.description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.12em] text-[var(--client-text-muted)]">
            <span>Độ đủ thông tin</span>
            <span>{state.progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[var(--client-muted-bg)]">
            <div
              className={[
                "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                toneClasses.progress,
              ].join(" ")}
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[26px] border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-5 shadow-sm">
        <p className="mb-3 flex items-center gap-2 text-[15px] font-black text-[var(--client-text-primary)]">
          <ShieldCheck className="h-5 w-5 text-[var(--client-primary)]" />
          Điều kiện gọi thợ
        </p>

        <div className="space-y-2.5">
          <StepCheck
            done={state.hasDevice}
            text="Đã xác định thiết bị cần sửa."
          />

          <StepCheck
            done={state.hasSymptom}
            text="Đã có mô tả lỗi hoặc triệu chứng."
          />

          <StepCheck
            done={state.canBook}
            text={
              state.canBook
                ? "AI đã sẵn sàng chuyển sang bước đặt thợ nếu bạn cần."
                : "AI sẽ mở bước đặt thợ khi cuộc trao đổi đã đủ điều kiện."
            }
          />
        </div>

        <button
          type="button"
          disabled={!state.canBook}
          onClick={state.canBook ? onOpenBooking : undefined}
          className={[
            "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[18px] px-5 text-[15px] font-black transition",
            state.canBook
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98]"
              : "cursor-not-allowed border border-[var(--client-muted-border)] bg-[var(--client-muted-bg)] text-[var(--client-text-muted)] opacity-55",
          ].join(" ")}
        >
          {state.canBook
            ? state.bookingLabel
            : chatClosed
              ? "Đã gọi thợ"
              : "Tiếp tục trao đổi để mở đặt thợ"}

          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-[20px] border border-[var(--client-muted-border)] bg-[var(--client-muted-bg)] p-3 text-[12px] font-semibold leading-5 text-[var(--client-text-muted)]">
        Session: {sessionId ? `#${sessionId}` : "Chưa tạo"} · AI chỉ hỗ trợ
        chẩn đoán sơ bộ, kỹ thuật viên cần kiểm tra thực tế để xác nhận.
      </div>
    </div>
  );
}

export function DiagnosticInfoPanel(props: DiagnosticInfoPanelProps) {
  const {
    isOpen,
    onClose,
    currentDeviceLabel,
    symptom,
    risk,
    sessionId,
    chatClosed,
    showDangerBookingCta,
    onOpenBooking,
  } = props;

  return (
    <>
      <aside className="hidden w-[340px] shrink-0 border-l border-[var(--client-card-border)] bg-[var(--client-shell-soft-bg)] p-3 xl:block 2xl:w-[360px] 2xl:p-4">
        <div className="sticky top-3">
          <PanelContent
            currentDeviceLabel={currentDeviceLabel}
            symptom={symptom}
            risk={risk}
            sessionId={sessionId}
            chatClosed={chatClosed}
            showDangerBookingCta={showDangerBookingCta}
            onOpenBooking={onOpenBooking}
          />
        </div>
      </aside>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Đóng tóm tắt chẩn đoán"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            onClick={onClose}
          />

          <aside className="fixed inset-y-0 right-0 z-50 flex w-[min(390px,92vw)] flex-col border-l border-[var(--client-card-border)] bg-[var(--client-shell-soft-bg)] p-4 shadow-2xl xl:hidden">
            <div className="mb-4 flex h-12 items-center justify-between">
              <p className="text-[16px] font-black text-[var(--client-text-primary)]">
                Tóm tắt AI
              </p>

              <button
                type="button"
                aria-label="Đóng"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-[14px] text-[var(--client-text-muted)] transition hover:bg-[var(--client-control-hover-bg)] hover:text-[var(--client-text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <PanelContent
                currentDeviceLabel={currentDeviceLabel}
                symptom={symptom}
                risk={risk}
                sessionId={sessionId}
                chatClosed={chatClosed}
                showDangerBookingCta={showDangerBookingCta}
                onOpenBooking={onOpenBooking}
              />
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
