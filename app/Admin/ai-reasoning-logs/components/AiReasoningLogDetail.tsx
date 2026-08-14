"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquareText,
  Phone,
  ShieldAlert,
  User,
  Wrench,
} from "lucide-react";

import { aiReasoningAdminService } from "../services";
import AdminToastStack, {
  type AdminToast,
} from "@/app/components/admin/AdminToastStack";
import type {
  AiFeedback,
  AiReasoningLogItem,
  RiskLevel,
  UpdateAiUsefulnessReviewPayload,
  UsefulnessLabel,
} from "../types/aiReasoning.types";

type ExtendedLog = AiReasoningLogItem & {
  createdAt?: string;
  userId?: string | number | null;
  userName?: string | null;
  userPhone?: string | null;
  sessionId?: string | number | null;
  sessionCode?: string | null;
  deviceCategory?: string | null;

  userQuestion?: string | null;
  question?: string | null;
  questionText?: string | null;
  prompt?: string | null;

  aiAnswer?: string | null;
  answer?: string | null;
  answerText?: string | null;
  response?: string | null;
  responseText?: string | null;

  prevState?: unknown;
  previousState?: unknown;
  beforeState?: unknown;

  nextState?: unknown;
  afterState?: unknown;
};

type StateTab = "before" | "after";

export function AiReasoningLogDetail({ log }: { log: AiReasoningLogItem }) {
  const [activeStateTab, setActiveStateTab] = useState<StateTab>("after");
  const [currentLog, setCurrentLog] = useState(log);
  const [selectedLabel, setSelectedLabel] = useState<Exclude<UsefulnessLabel, null>>(
    log.humanUsefulnessLabel ?? "PARTIAL",
  );
  const [reviewNote, setReviewNote] = useState(log.humanUsefulnessNote ?? "");
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const pushToast = (type: AdminToast["type"], text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const detail = currentLog as ExtendedLog;

  const userQuestion = pickString(detail, [
    "userQuestion",
    "questionText",
    "question",
    "prompt",
  ]);

  const aiAnswer = pickString(detail, [
    "aiAnswer",
    "answerText",
    "answer",
    "responseText",
    "response",
  ]);

  const beforeState = pickValue(detail, [
    "prevState",
    "previousState",
    "beforeState",
  ]);

  const afterState = pickValue(detail, ["nextState", "afterState"]);

  async function handleSubmitReview() {
    const payload: UpdateAiUsefulnessReviewPayload = {
      humanUsefulnessLabel: selectedLabel,
      humanUsefulnessNote: reviewNote.trim() || undefined,
    };

    try {
      setIsSavingReview(true);
      setReviewError("");
      const updatedLog = await aiReasoningAdminService.updateUsefulnessReview(
        currentLog.id,
        payload,
      );
      setCurrentLog(updatedLog);
      setSelectedLabel(updatedLog.humanUsefulnessLabel ?? selectedLabel);
      setReviewNote(updatedLog.humanUsefulnessNote ?? "");
      pushToast("success", "Đã lưu đánh giá thủ công của quản trị viên thành công!");
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Không lưu được đánh giá thủ công.";
      setReviewError(message);
      pushToast("error", message);
    } finally {
      setIsSavingReview(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <main className="min-w-0 space-y-5">
        <Section title="Hội thoại AI" icon={<MessageSquareText />}>
          <div className="space-y-4">
            <ChatMessage
              sender="Người dùng"
              icon={<User className="h-4 w-4" />}
              content={userQuestion || "Chưa có câu hỏi người dùng."}
              tone="user"
            />

            <ChatMessage
              sender="AI tư vấn"
              icon={<Bot className="h-4 w-4" />}
              content={aiAnswer || "Chưa có câu trả lời AI."}
              tone="ai"
            />
          </div>
        </Section>

        <Section title="Trạng thái xử lý" icon={<FileText />}>
          <p className="mb-4 text-sm font-medium leading-6 text-[var(--admin-muted-text)]">
            Tóm tắt những gì AI đã biết tại thời điểm xử lý log này. Phần này
            giúp admin kiểm tra AI đã nhận diện đúng thiết bị, mức rủi ro và
            bước tư vấn hay chưa.
          </p>

          <div className="mb-4 inline-flex rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-1">
            <StateTabButton
              active={activeStateTab === "before"}
              onClick={() => setActiveStateTab("before")}
            >
              Trước khi AI xử lý
            </StateTabButton>

            <StateTabButton
              active={activeStateTab === "after"}
              onClick={() => setActiveStateTab("after")}
            >
              Sau khi AI xử lý
            </StateTabButton>
          </div>

          <ProcessStateSummary
            mode={activeStateTab}
            value={activeStateTab === "before" ? beforeState : afterState}
          />
        </Section>

        <Section title="Kiểm tra chất lượng AI" icon={<ShieldAlert />}>
          <div className="grid gap-4 lg:grid-cols-2">
            <CheckPanel
              tone={isPotentialWrong(currentLog) ? "red" : "green"}
              title="Tư vấn sai"
              result={
                isPotentialWrong(currentLog)
                  ? "Nghi vấn cần kiểm tra"
                  : "Chưa phát hiện dấu hiệu rõ"
              }
              description={
                isPotentialWrong(currentLog)
                  ? "Dựa trên phản hồi không tốt, điểm thấp hoặc mức rủi ro cao. Quản trị viên nên đọc lại câu trả lời AI."
                  : "Chưa có tín hiệu mạnh cho thấy AI tư vấn sai trong log này."
              }
            />

            <CheckPanel
              tone={hasDangerWarning(currentLog) ? "red" : "green"}
              title="Bỏ sót cảnh báo nguy hiểm"
              result={
                hasDangerWarning(currentLog)
                  ? "Có dấu hiệu cần rà soát"
                  : "Chưa phát hiện dấu hiệu rõ"
              }
              description={
                hasDangerWarning(currentLog)
                  ? "Log có mức rủi ro cao hoặc nghiêm trọng. Cần kiểm tra lại trạng thái sau xử lý."
                  : "Không có tín hiệu rủi ro cao trong log hiện tại."
              }
            />
          </div>
        </Section>

        <UsefulnessSection
          log={currentLog}
          selectedLabel={selectedLabel}
          reviewNote={reviewNote}
          reviewError={reviewError}
          isSavingReview={isSavingReview}
          onSelectLabel={setSelectedLabel}
          onChangeNote={setReviewNote}
          onSubmit={handleSubmitReview}
        />
      </main>

      <aside className="min-w-0 space-y-5 xl:sticky xl:top-5 xl:self-start">
        <SummaryCard log={currentLog} detail={detail} />

        <SideSection title="Người dùng liên quan" icon={<User />}>
          <SideInfo label="User ID" value={getSafeText(detail.userId)} />
          <SideInfo
            label="Tên người dùng"
            value={getSafeText(detail.userName, "Không rõ")}
          />
          <SideInfo
            label="Số điện thoại"
            value={getSafeText(detail.userPhone)}
            icon={<Phone className="h-4 w-4" />}
          />
        </SideSection>

        <SideSection title="Phiên sửa chữa" icon={<Wrench />}>
          <SideInfo label="Session ID" value={getSafeText(detail.sessionId)} />
          <SideInfo label="Mã phiên" value={getSafeText(detail.sessionCode)} />
          <SideInfo
            label="Loại thiết bị"
            value={getSafeText(detail.deviceCategory)}
          />
        </SideSection>
      </aside>

      <AdminToastStack
        toasts={toasts}
        onRemove={(id) =>
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </div>
  );
}

function SummaryCard({
  log,
  detail,
}: {
  log: AiReasoningLogItem;
  detail: ExtendedLog;
}) {
  return (
    <section className="admin-card rounded-2xl p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--admin-accent)]">
        Tổng quan log
      </p>

      <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--admin-strong-text)]">
        LOG-{log.id}
      </h1>

      {detail.createdAt ? (
        <p
          suppressHydrationWarning
          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--admin-muted-text)]"
        >
          <Clock className="h-4 w-4" />
          {formatDateTime(detail.createdAt)}
        </p>
      ) : null}

      <div className="mt-5 space-y-3">
        <SummaryRow label="Rủi ro">
          <RiskBadge riskLevel={log.riskLevel} />
        </SummaryRow>

        <SummaryRow label="Phản hồi">
          <FeedbackBadge feedback={log.aiFeedback} isGolden={log.isGolden} />
        </SummaryRow>

        <SummaryRow label="Điểm AI">
          <ScoreBadge score={log.autoUsefulnessScore ?? log.score} />
        </SummaryRow>
      </div>
    </section>
  );
}

function UsefulnessSection({
  log,
  selectedLabel,
  reviewNote,
  reviewError,
  isSavingReview,
  onSelectLabel,
  onChangeNote,
  onSubmit,
}: {
  log: AiReasoningLogItem;
  selectedLabel: Exclude<UsefulnessLabel, null>;
  reviewNote: string;
  reviewError: string;
  isSavingReview: boolean;
  onSelectLabel: (value: Exclude<UsefulnessLabel, null>) => void;
  onChangeNote: (value: string) => void;
  onSubmit: () => void;
}) {
  const autoUsefulnessReasons = Array.isArray(log.autoUsefulnessReasons)
    ? log.autoUsefulnessReasons
    : [];

  return (
    <Section title="Mức độ hữu ích của lượt tư vấn" icon={<CheckCircle2 />}>
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <InfoCard
            label="Điểm tự động"
            value={
              log.autoUsefulnessScore !== null
                ? `${log.autoUsefulnessScore}/10`
                : "Chưa có"
            }
          />
          <InfoCard
            label="Nhãn tự động"
            valueNode={
              <UsefulnessBadge label={log.autoUsefulnessLabel} fallback="Chưa có" />
            }
          />
        </div>

        <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
          <p className="text-sm font-black text-[var(--admin-strong-text)]">
            Lý do chấm điểm tự động
          </p>

          {autoUsefulnessReasons.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm font-medium text-[var(--admin-strong-text)]">
              {autoUsefulnessReasons.map((reason) => (
                <li key={reason} className="rounded-xl bg-[var(--admin-card-bg)] px-3 py-2">
                  {reason}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm font-medium text-[var(--admin-muted-text)]">
              Hệ thống chưa ghi nhận lý do chấm điểm.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[var(--admin-strong-text)]">
                Đánh giá thủ công của quản trị viên
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--admin-muted-text)]">
                {log.humanUsefulnessLabel
                  ? "Nhãn thủ công đang được ưu tiên hiển thị."
                  : "Chưa đánh giá"}
              </p>
            </div>

            <UsefulnessBadge
              label={log.humanUsefulnessLabel}
              fallback="Chưa đánh giá"
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <InfoCard
              label="Người đánh giá"
              value={log.reviewedByName ?? "Chưa có"}
            />
            <InfoCard
              label="Thời điểm đánh giá"
              value={log.reviewedAt ? formatDateTime(log.reviewedAt) : "Chưa có"}
            />
          </div>

          <div className="mt-4">
            <p className="text-sm font-black text-[var(--admin-strong-text)]">
              Ghi chú của quản trị viên
            </p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm font-medium leading-6 text-[var(--admin-muted-text)]">
              {log.humanUsefulnessNote?.trim() || "Chưa có ghi chú."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4">
          <p className="text-sm font-black text-[var(--admin-strong-text)]">
            Chấm lại thủ công
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {USEFULNESS_OPTIONS.map((option) => {
              const active = selectedLabel === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelectLabel(option.value)}
                  className={[
                    "rounded-xl border px-4 py-2 text-sm font-black transition",
                    active
                      ? "border-[#06B6D4]/40 bg-[#06B6D4]/12 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
                      : "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] text-[var(--admin-strong-text)] hover:border-[var(--admin-accent)]",
                  ].join(" ")}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-black text-[var(--admin-strong-text)]">
              Ghi chú của quản trị viên
            </span>
            <textarea
              value={reviewNote}
              onChange={(event) => onChangeNote(event.target.value)}
              rows={4}
              placeholder="Nhập ghi chú để giải thích vì sao lượt tư vấn này hữu ích hoặc chưa hữu ích."
              className="mt-2 w-full rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-4 py-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] focus:border-[var(--admin-accent)]"
            />
          </label>

          {reviewError ? (
            <p className="mt-3 text-sm font-bold text-[var(--admin-error)]">
              {reviewError}
            </p>
          ) : null}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => void onSubmit()}
              disabled={isSavingReview}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[image:var(--admin-cta-bg)] px-4 text-sm font-bold text-[var(--admin-cta-text)] shadow-[var(--admin-cta-shadow)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingReview ? "Đang lưu..." : "Lưu đánh giá thủ công"}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="admin-card rounded-2xl p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [&>svg]:h-5 [&>svg]:w-5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
          {icon}
        </span>

        <h2 className="text-xl font-black text-[var(--admin-strong-text)]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function SideSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="admin-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#06B6D4]/25 bg-[#06B6D4]/10 text-[#0891B2] [&>svg]:h-5 [&>svg]:w-5 [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]">
          {icon}
        </span>

        <h2 className="text-base font-black text-[var(--admin-strong-text)]">
          {title}
        </h2>
      </div>

      <div className="divide-y divide-[var(--admin-card-border)]">
        {children}
      </div>
    </section>
  );
}

function ChatMessage({
  sender,
  icon,
  content,
  tone,
}: {
  sender: string;
  icon: ReactNode;
  content: string;
  tone: "user" | "ai";
}) {
  const isAi = tone === "ai";

  return (
    <article
      className={[
        "rounded-2xl border p-4",
        isAi
          ? "border-[#06B6D4]/25 bg-[#06B6D4]/10"
          : "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)]",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={[
            "grid h-8 w-8 place-items-center rounded-xl border",
            isAi
              ? "border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#0891B2] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#22D3EE]"
              : "border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] text-[var(--admin-muted-text)]",
          ].join(" ")}
        >
          {icon}
        </span>

        <p className="text-sm font-black text-[var(--admin-strong-text)]">
          {sender}
        </p>
      </div>

      <p className="whitespace-pre-wrap break-words text-sm font-medium leading-7 text-[var(--admin-strong-text)]">
        {content}
      </p>
    </article>
  );
}

function StateTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 rounded-xl px-4 text-sm font-black transition",
        active
          ? "bg-[var(--admin-card-bg)] text-[var(--admin-strong-text)] shadow-sm"
          : "text-[var(--admin-muted-text)] hover:text-[var(--admin-strong-text)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CodeBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-[380px] overflow-auto rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4 text-xs sm:text-sm font-mono font-medium leading-6 text-[var(--admin-strong-text)]">
      {formatJson(value)}
    </pre>
  );
}

function ProcessStateSummary({
  mode,
  value,
}: {
  mode: StateTab;
  value: unknown;
}) {
  const state = toRecord(value);
  const flags = getStringList(state.flags);
  const risk = getStateText(state, ["risk", "riskLevel"], "Chưa xác định");
  const phase = getStateText(state, ["phase"], "Chưa xác định");
  const device = getStateText(state, ["device", "deviceName"], "Chưa rõ");
  const symptom = getStateText(state, ["symptom", "problem"], "Chưa ghi nhận");
  const category = getStateText(
    state,
    ["deviceCategory", "category"],
    "Chưa phân loại",
  );
  const questionSet = getStateText(
    state,
    ["contextQuestionSet"],
    "Chưa chọn bộ câu hỏi",
  );
  const followupKey = getStateText(
    state,
    ["askedFollowupKey"],
    "Chưa có câu hỏi tiếp theo",
  );
  const contextAnswers = getStateText(
    state,
    ["contextAnswers"],
    "Chưa có câu trả lời bổ sung",
  );
  const questionsAsked = getBooleanText(state.contextQuestionsAsked);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <StateInfoTile
          label="Mức rủi ro AI nhận định"
          value={getAiStateRiskText(risk)}
          tone={getAiStateRiskTone(risk)}
        />
        <StateInfoTile
          label="Bước tư vấn"
          value={getAiPhaseText(phase)}
          description={mode === "before" ? "Trước lượt trả lời này" : "Sau lượt trả lời này"}
        />
        <StateInfoTile label="Thiết bị" value={device} />
        <StateInfoTile label="Nhóm thiết bị" value={getDeviceCategoryText(category)} />
        <StateInfoTile label="Triệu chứng chính" value={symptom} />
        <StateInfoTile label="Câu hỏi bổ sung" value={questionsAsked} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <StateDetailPanel title="Ngữ cảnh AI đang dùng">
          <StateFact label="Bộ câu hỏi" value={getQuestionSetText(questionSet)} />
          <StateFact label="Câu hỏi tiếp theo" value={followupKey} />
          <StateFact label="Số câu trả lời bổ sung" value={contextAnswers} />
        </StateDetailPanel>

        <StateDetailPanel title="Cờ cảnh báo">
          {flags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {flags.map((flag) => (
                <span
                  key={flag}
                  className="inline-flex min-h-8 items-center rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-3 py-1 text-xs font-black text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]"
                >
                  {flag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-[var(--admin-muted-text)]">
              Không có cờ cảnh báo trong trạng thái này.
            </p>
          )}
        </StateDetailPanel>
      </div>

      <details className="rounded-2xl border border-dashed border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
        <summary className="cursor-pointer text-sm font-black text-[var(--admin-strong-text)]">
          Xem dữ liệu kỹ thuật
        </summary>
        <div className="mt-3">
          <CodeBlock value={value} />
        </div>
      </details>
    </div>
  );
}

function StateInfoTile({
  label,
  value,
  description,
  tone = "neutral",
}: {
  label: string;
  value: string;
  description?: string;
  tone?: "neutral" | "green" | "orange" | "red";
}) {
  return (
    <article
      className={[
        "rounded-2xl border p-4",
        getStateTileClassName(tone),
      ].join(" ")}
    >
      <p className="text-[13px] font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
        {label}
      </p>
      <p className="mt-2 break-words text-base font-black text-[var(--admin-strong-text)]">
        {value}
      </p>
      {description ? (
        <p className="mt-1 text-xs font-semibold text-[var(--admin-muted-text)]">
          {description}
        </p>
      ) : null}
    </article>
  );
}

function StateDetailPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4">
      <h3 className="text-sm font-black text-[var(--admin-strong-text)]">
        {title}
      </h3>
      <div className="mt-3 space-y-3">{children}</div>
    </article>
  );
}

function StateFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm font-bold text-[var(--admin-muted-text)]">
        {label}
      </span>
      <span className="min-w-0 break-words text-sm font-black text-[var(--admin-strong-text)] sm:max-w-[60%] sm:text-right">
        {value}
      </span>
    </div>
  );
}

function CheckPanel({
  tone,
  title,
  result,
  description,
}: {
  tone: "green" | "red";
  title: string;
  result: string;
  description: string;
}) {
  const isRed = tone === "red";

  return (
    <article
      className={[
        "rounded-2xl border p-4",
        isRed
          ? "border-[#EF4444]/35 bg-[#EF4444]/10"
          : "border-[#22C55E]/35 bg-[#22C55E]/10",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-white/40",
            isRed
              ? "border-[#EF4444]/35 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]"
              : "border-[#22C55E]/35 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
          ].join(" ")}
        >
          {isRed ? (
            <ShieldAlert className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
        </span>

        <div className="min-w-0">
          <h3 className="text-base font-black text-[var(--admin-strong-text)]">
            {title}
          </h3>

          <p
            className={[
              "mt-2 text-sm font-black",
              isRed
                ? "text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]"
                : "text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]",
            ].join(" ")}
          >
            {result}
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-[var(--admin-muted-text)]">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

function SideInfo({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="py-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
        {label}
      </p>

      <div className="mt-1 flex min-w-0 items-center gap-2">
        {icon ? (
          <span className="shrink-0 text-[var(--admin-muted-text)]">
            {icon}
          </span>
        ) : null}

        <p className="min-w-0 truncate text-base font-extrabold text-[var(--admin-strong-text)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-base font-extrabold text-[var(--admin-muted-text)]">
        {label}
      </span>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

const USEFULNESS_OPTIONS: Array<{
  value: Exclude<UsefulnessLabel, null>;
  text: string;
}> = [
  { value: "USEFUL", text: "Hữu ích" },
  { value: "PARTIAL", text: "Hữu ích một phần" },
  { value: "NOT_USEFUL", text: "Không hữu ích" },
];

function InfoCard({
  label,
  value,
  valueNode,
}: {
  label: string;
  value?: string;
  valueNode?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--admin-muted-text)]">
        {label}
      </p>
      <div className="mt-2 text-sm font-bold text-[var(--admin-strong-text)]">
        {valueNode ?? value ?? "--"}
      </div>
    </div>
  );
}

function UsefulnessBadge({
  label,
  fallback = "Chưa đánh giá",
}: {
  label: UsefulnessLabel;
  fallback?: string;
}) {
  if (!label) {
    return (
      <span className="inline-flex min-h-8 items-center rounded-full border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] px-3 py-1 text-xs font-black text-[var(--admin-muted-text)]">
        {fallback}
      </span>
    );
  }

  return (
    <span
      className={[
        "inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-black",
        getUsefulnessClassName(label),
      ].join(" ")}
    >
      {getUsefulnessText(label)}
    </span>
  );
}

function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  return (
    <span
      className={[
        "inline-flex h-8 items-center rounded-full border px-3 text-sm font-black shadow-sm",
        getRiskClassName(riskLevel),
      ].join(" ")}
    >
      {getRiskText(riskLevel)}
    </span>
  );
}

function FeedbackBadge({
  feedback,
  isGolden,
}: {
  feedback: AiFeedback;
  isGolden: boolean;
}) {
  if (isGolden) {
    return (
      <span className="inline-flex h-8 items-center rounded-full border border-emerald-600 bg-emerald-600 px-3 text-sm font-black text-white shadow-sm shadow-emerald-600/20">
        Mẫu tốt
      </span>
    );
  }

  if (feedback === "LIKE") {
    return (
      <span className="inline-flex h-8 items-center rounded-full border border-emerald-600 bg-emerald-600 px-3 text-sm font-black text-white shadow-sm shadow-emerald-600/20">
        Tốt
      </span>
    );
  }

  if (feedback === "DISLIKE") {
    return (
      <span className="inline-flex h-8 items-center rounded-full border border-rose-600 bg-rose-600 px-3 text-sm font-black text-white shadow-sm shadow-rose-600/20">
        Không tốt
      </span>
    );
  }

  return (
    <span className="inline-flex h-8 items-center rounded-full border border-slate-500 bg-slate-600 px-3 text-sm font-black text-white shadow-sm shadow-slate-600/20">
      Chưa phản hồi
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const isLow = score <= 4;
  const isGood = score >= 8;

  return (
    <span
      className={[
        "inline-flex h-8 items-center rounded-full border px-3 text-sm font-black shadow-sm",
        isLow
          ? "border-rose-600 bg-rose-600 text-white shadow-rose-600/20"
          : isGood
            ? "border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/20"
            : "border-amber-500 bg-amber-500 text-white shadow-amber-500/20",
      ].join(" ")}
    >
      {score}/10
    </span>
  );
}

function getUsefulnessClassName(label: Exclude<UsefulnessLabel, null>) {
  if (label === "USEFUL") {
    return "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#15803D] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#4ADE80]";
  }

  if (label === "PARTIAL") {
    return "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FBBF24]";
  }

  return "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-[#FCA5A5]";
}

function getUsefulnessText(label: Exclude<UsefulnessLabel, null>) {
  if (label === "USEFUL") return "Hữu ích";
  if (label === "PARTIAL") return "Hữu ích một phần";
  return "Không hữu ích";
}

function getRiskClassName(riskLevel: RiskLevel) {
  if (riskLevel === "CRITICAL" || riskLevel === "HIGH") {
    return "border-rose-600 bg-rose-600 text-white shadow-rose-600/20";
  }

  if (riskLevel === "MEDIUM") {
    return "border-amber-500 bg-amber-500 text-white shadow-amber-500/20";
  }

  if (riskLevel === "LOW") {
    return "border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/20";
  }

  return "border-slate-500 bg-slate-600 text-white shadow-slate-600/20";
}

function getRiskText(riskLevel: RiskLevel) {
  if (riskLevel === "CRITICAL") return "Nghiêm trọng";
  if (riskLevel === "HIGH") return "Rủi ro cao";
  if (riskLevel === "MEDIUM") return "Cần theo dõi";
  if (riskLevel === "LOW") return "Rủi ro thấp";
  return "Chưa xác định";
}

function isPotentialWrong(log: AiReasoningLogItem) {
  return (
    log.aiFeedback === "DISLIKE" ||
    log.score <= 4 ||
    log.riskLevel === "HIGH" ||
    log.riskLevel === "CRITICAL"
  );
}

function hasDangerWarning(log: AiReasoningLogItem) {
  return log.riskLevel === "HIGH" || log.riskLevel === "CRITICAL";
}

function pickString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function pickValue(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }

  return {};
}

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function getStateText(
  source: Record<string, unknown>,
  keys: string[],
  fallback: string,
) {
  for (const key of keys) {
    const value = source[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === "string") {
      return value.trim() || fallback;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.length ? `${value.length}` : fallback;
    }

    if (typeof value === "object") {
      return Object.keys(value).length ? `${Object.keys(value).length}` : fallback;
    }
  }

  return fallback;
}

function getStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function getBooleanText(value: unknown) {
  if (value === true) return "Đã hỏi khách";
  if (value === false) return "Chưa hỏi khách";
  return "Chưa xác định";
}

function getAiStateRiskText(value: string) {
  const normalized = value.toUpperCase();

  if (normalized === "RED" || normalized === "HIGH" || normalized === "CRITICAL") {
    return "Cần kiểm tra kỹ";
  }

  if (normalized === "YELLOW" || normalized === "MEDIUM") {
    return "Cần theo dõi";
  }

  if (normalized === "GREEN" || normalized === "LOW") {
    return "Rủi ro thấp";
  }

  return "Chưa đủ dữ liệu";
}

function getAiStateRiskTone(value: string): "neutral" | "green" | "orange" | "red" {
  const normalized = value.toUpperCase();

  if (normalized === "RED" || normalized === "HIGH" || normalized === "CRITICAL") {
    return "red";
  }

  if (normalized === "YELLOW" || normalized === "MEDIUM") {
    return "orange";
  }

  if (normalized === "GREEN" || normalized === "LOW") {
    return "green";
  }

  return "neutral";
}

function getAiPhaseText(value: string) {
  const normalized = value.toUpperCase();

  if (normalized === "COLLECTING") return "Đang thu thập thông tin";
  if (normalized === "DIAGNOSING") return "Đang chẩn đoán";
  if (normalized === "QUOTING") return "Đang báo giá";
  if (normalized === "BOOKING") return "Đang tạo lịch sửa";
  if (normalized === "DONE" || normalized === "COMPLETED") return "Đã hoàn tất";

  return value;
}

function getDeviceCategoryText(value: string) {
  const normalized = value.toUpperCase();

  if (normalized === "DISPLAY_AUDIO") return "Màn hình / âm thanh";
  if (normalized === "POWER") return "Nguồn điện";
  if (normalized === "COOLING") return "Làm lạnh";
  if (normalized === "WASHING") return "Giặt / xả";
  if (normalized === "GENERIC") return "Thiết bị gia dụng";

  return value;
}

function getQuestionSetText(value: string) {
  if (value.includes(":")) {
    return value.replace(":", " / ");
  }

  return value;
}

function getStateTileClassName(tone: "neutral" | "green" | "orange" | "red") {
  if (tone === "red") {
    return "border-[#EF4444]/35 bg-[#EF4444]/10";
  }

  if (tone === "orange") {
    return "border-[#F59E0B]/35 bg-[#F59E0B]/10";
  }

  if (tone === "green") {
    return "border-[#22C55E]/35 bg-[#22C55E]/10";
  }

  return "border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)]";
}

function formatJson(value: unknown) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

function getSafeText(value?: string | number | null, fallback = "--") {
  if (value === null || value === undefined) return fallback;

  const normalized = String(value).trim();

  return normalized ? normalized : fallback;
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
