"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CheckCircle2, Send, Zap } from "lucide-react";

type ChatMessage = {
  role: "ai" | "user";
  msg: string;
};

const FIRST_USER_MESSAGE = "Tủ lạnh không làm lạnh được ạ";
const SECOND_USER_MESSAGE = "Có tiếng rè rè ạ";

const diagnosisSummary = [
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

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 rounded-[18px] rounded-tl-none border border-orange-100 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{
            y: [0, -5, 0],
            opacity: [0.45, 1, 0.45],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: dot * 0.12,
          }}
          className="h-2.5 w-2.5 rounded-full bg-orange-500 dark:bg-blue-400"
        />
      ))}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  isFilled,
  delay,
}: {
  label: string;
  value: string;
  isFilled: boolean;
  delay: number;
}) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        opacity: isFilled ? 1 : 0.72,
        y: isFilled ? 0 : 4,
      }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "relative overflow-hidden rounded-[22px] border px-5 py-4 transition",
        isFilled
          ? "border-orange-100 bg-white/95 dark:border-slate-700 dark:bg-slate-800/86"
          : "border-orange-100/70 bg-white/65 dark:border-slate-700/70 dark:bg-slate-800/46",
      ].join(" ")}
    >
      <p className="text-[14px] font-black uppercase tracking-[0.13em] text-orange-500 dark:text-blue-300">
        {label}
      </p>

      <div className="mt-2 min-h-[28px]">
        <AnimatePresence mode="wait">
          {isFilled ? (
            <motion.p
              key="value"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[16px] font-black leading-7 text-slate-900 dark:text-slate-50"
            >
              {value}
            </motion.p>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-6 w-4/5 rounded-full bg-orange-100 dark:bg-slate-700"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function AiMockupCard() {
  const [cycleId, setCycleId] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      msg: "Xin chào! Thiết bị của bạn gặp vấn đề gì?",
    },
  ]);

  const [typedInput, setTypedInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showSummaryShell, setShowSummaryShell] = useState(false);
  const [summaryStep, setSummaryStep] = useState(0);
  const [showReady, setShowReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const safeSetMessages = (
      updater: (current: ChatMessage[]) => ChatMessage[],
    ) => {
      if (!isCancelled) {
        setMessages(updater);
      }
    };

    const resetDemo = async () => {
      setCycleId((current) => current + 1);
      setMessages([]);
      setTypedInput("");
      setIsAiTyping(false);
      setIsSending(false);
      setShowDiagnosis(false);
      setShowSummaryShell(false);
      setSummaryStep(0);
      setShowReady(false);

      await sleep(260);

      if (isCancelled) return;

      setMessages([
        {
          role: "ai",
          msg: "Xin chào! Thiết bị của bạn gặp vấn đề gì?",
        },
      ]);
    };

    const typeText = async (text: string) => {
      setTypedInput("");

      for (let index = 0; index <= text.length; index += 1) {
        if (isCancelled) return;

        setTypedInput(text.slice(0, index));
        await sleep(32);
      }

      await sleep(360);
    };

    const sendUserMessage = async (text: string) => {
      if (isCancelled) return;

      setIsSending(true);
      await sleep(240);

      safeSetMessages((current) => [
        ...current,
        {
          role: "user",
          msg: text,
        },
      ]);

      setTypedInput("");
      setIsSending(false);
      await sleep(420);
    };

    const aiReply = async (text: string) => {
      if (isCancelled) return;

      setIsAiTyping(true);
      await sleep(760);

      if (isCancelled) return;

      setIsAiTyping(false);

      safeSetMessages((current) => [
        ...current,
        {
          role: "ai",
          msg: text,
        },
      ]);

      await sleep(520);
    };

    const fillSummary = async () => {
      setShowSummaryShell(true);
      setSummaryStep(0);

      for (let index = 1; index <= diagnosisSummary.length; index += 1) {
        if (isCancelled) return;

        await sleep(420);
        setSummaryStep(index);
      }
    };

    const runOneCycle = async () => {
      await resetDemo();

      if (isCancelled) return;

      await sleep(900);

      await typeText(FIRST_USER_MESSAGE);
      await sendUserMessage(FIRST_USER_MESSAGE);

      await aiReply("Bạn nghe thấy tiếng động lạ từ máy nén không?");

      await typeText(SECOND_USER_MESSAGE);
      await sendUserMessage(SECOND_USER_MESSAGE);

      if (isCancelled) return;

      setIsAiTyping(true);
      await sleep(800);
      setIsAiTyping(false);

      setShowDiagnosis(true);
      await sleep(520);

      await fillSummary();

      await sleep(420);
      setShowReady(true);

      await sleep(3200);
    };

    const runLoop = async () => {
      while (!isCancelled) {
        await runOneCycle();
      }
    };

    void runLoop();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <motion.div
      layout
      transition={{
        layout: {
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="mx-auto w-full max-w-[700px] rounded-[40px] border border-orange-100/90 bg-white/90 p-3 shadow-[0_34px_100px_rgba(255,122,0,0.14)] backdrop-blur-[18px] dark:border-slate-700/80 dark:bg-slate-900/84 dark:shadow-[0_34px_100px_rgba(0,0,0,0.36)]"
    >
      <motion.div
        layout
        transition={{
          layout: {
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        className="rounded-[32px] bg-[#fff8ef] p-6 text-left dark:bg-[#0b1220] sm:p-7"
      >
        <div className="mb-5 flex items-center justify-between border-b border-orange-100 pb-5 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70 dark:bg-blue-400" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-orange-500 dark:bg-blue-500" />
            </div>

            <div>
              <h4 className="text-[18px] font-black leading-6 text-slate-950 dark:text-white">
                Trợ lý AI SmartElec
              </h4>

              <p className="mt-1 text-[14px] font-black leading-5 text-orange-600 dark:text-blue-300">
                Đang trực tuyến • Chẩn đoán sơ bộ
              </p>
            </div>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-orange-500/10 text-orange-600 dark:bg-blue-500/10 dark:text-blue-300">
            <Bot className="h-7 w-7" />
          </div>
        </div>

        <motion.div layout className="min-h-[390px] space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <motion.div
                  layout
                  key={`${cycleId}-${message.role}-${message.msg}-${index}`}
                  initial={{
                    opacity: 0,
                    y: 14,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={isUser ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={[
                      "max-w-[88%] rounded-[20px] px-5 py-3.5 text-[16px] font-bold leading-7 shadow-sm sm:text-[17px] sm:leading-8",
                      isUser
                        ? "rounded-tr-none bg-orange-500 text-white dark:bg-blue-700"
                        : "rounded-tl-none border border-orange-100 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100",
                    ].join(" ")}
                  >
                    {message.msg}
                  </div>
                </motion.div>
              );
            })}

            {isAiTyping ? (
              <motion.div
                layout
                key={`${cycleId}-ai-typing`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex justify-start"
              >
                <TypingDots />
              </motion.div>
            ) : null}

            {showDiagnosis ? (
              <motion.div
                layout
                key={`${cycleId}-diagnosis`}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[24px] border border-dashed border-amber-300 bg-amber-50/90 p-5 dark:border-amber-500/35 dark:bg-amber-500/10"
              >
                <div className="flex gap-4">
                  <Zap className="mt-1 h-6 w-6 shrink-0 text-amber-500" />

                  <div>
                    <p className="text-[18px] font-black leading-7 text-slate-950 dark:text-amber-200">
                      AI chẩn đoán sơ bộ
                    </p>

                    <p className="mt-2 text-[16px] font-semibold leading-8 text-slate-700 dark:text-slate-200">
                      Có thể lỗi rơ-le khởi động hoặc block nén cần kiểm tra
                      trực tiếp. Nên gọi thợ điện lạnh để đo dòng và xác nhận
                      nguyên nhân.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {showSummaryShell ? (
              <motion.div
                layout
                key={`${cycleId}-summary`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {diagnosisSummary.map((item, index) => (
                  <SummaryCard
                    key={`${cycleId}-${item.label}`}
                    label={item.label}
                    value={item.value}
                    isFilled={summaryStep > index}
                    delay={index * 0.03}
                  />
                ))}
              </motion.div>
            ) : null}

            {showReady ? (
              <motion.div
                layout
                key={`${cycleId}-ready`}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="flex items-start gap-4 rounded-[22px] border border-orange-100 bg-orange-50 px-5 py-4 dark:border-blue-500/20 dark:bg-blue-500/10"
              >
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-orange-600 dark:text-blue-300" />

                <span className="text-[16px] font-black leading-7 text-orange-700 dark:text-blue-200">
                  Đã đủ thông tin để đề xuất gọi kỹ thuật viên.
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <div className="mt-5 rounded-[24px] border border-orange-100 bg-white/90 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="min-h-[50px] flex-1 rounded-[18px] border border-orange-100 bg-orange-50/70 px-4 py-3 text-[16px] font-bold leading-7 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              {typedInput ? (
                <span>
                  {typedInput}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                    }}
                    className="ml-0.5 inline-block"
                  >
                    |
                  </motion.span>
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">
                  Nhập mô tả lỗi thiết bị...
                </span>
              )}
            </div>

            <motion.div
              animate={{
                scale: isSending ? 0.92 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={[
                "flex h-[50px] w-[58px] shrink-0 items-center justify-center rounded-[18px] text-white shadow-[0_14px_30px_rgba(255,122,0,0.22)] dark:shadow-[0_14px_30px_rgba(37,99,235,0.22)]",
                typedInput || isSending
                  ? "bg-orange-500 dark:bg-blue-700"
                  : "bg-orange-300 dark:bg-blue-900",
              ].join(" ")}
            >
              <Send className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}