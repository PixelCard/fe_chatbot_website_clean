// app/components/home/HomeProcessSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { CheckCircle2, ClipboardCheck } from "lucide-react";

import { processSteps } from "./data";
import { fadeUp, stagger } from "./motion";
import { SectionBadge } from "./ui/SectionBadge";

const AUTO_STEP_DELAY = 2600;
const RESET_DELAY = 520;

export function HomeProcessSection() {
  const shouldReduceMotion = useReducedMotion();

  const [activeStep, setActiveStep] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const activeStepRef = useRef(0);
  const fillPercent = useMotionValue(0);
  const fillWidth = useTransform(fillPercent, (value) => `${value}%`);

  useEffect(() => {
    if (shouldReduceMotion) {
      fillPercent.set(0);
      setActiveStep(0);
      return;
    }

    let frameId = 0;
    let resetTimer: number | undefined;

    const stepCount = processSteps.length;
    const maxSegment = Math.max(stepCount - 1, 1);
    const fullCycleDuration = stepCount * AUTO_STEP_DELAY + RESET_DELAY;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const totalElapsed = now - startedAt;
      const cycleElapsed = totalElapsed % fullCycleDuration;

      const isResetPhase = cycleElapsed >= stepCount * AUTO_STEP_DELAY;

      if (isResetPhase) {
        fillPercent.set(100);

        if (activeStepRef.current !== stepCount - 1) {
          activeStepRef.current = stepCount - 1;
          setActiveStep(stepCount - 1);
        }

        frameId = window.requestAnimationFrame(tick);
        return;
      }

      const rawStep = cycleElapsed / AUTO_STEP_DELAY;
      const currentStep = Math.min(Math.floor(rawStep), stepCount - 1);
      const localProgress = rawStep - currentStep;

      const nextFillPercent =
        currentStep >= maxSegment
          ? 100
          : ((currentStep + localProgress) / maxSegment) * 100;

      fillPercent.set(Math.min(100, Math.max(0, nextFillPercent)));

      if (currentStep !== activeStepRef.current) {
        activeStepRef.current = currentStep;
        setActiveStep(currentStep);
      }

      if (currentStep === 0 && cycleElapsed < 80) {
        setCycleKey((current) => current + 1);
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);

      if (resetTimer) {
        window.clearTimeout(resetTimer);
      }
    };
  }, [fillPercent, shouldReduceMotion]);

  return (
    <section
      id="process"
      className="relative overflow-hidden bg-[#f9f4ec] px-4 py-16 text-slate-950 dark:bg-[#05070b] dark:text-white sm:px-6 sm:py-18 lg:px-8 lg:py-20 xl:py-22"
    >
      <div className="pointer-events-none absolute left-1/2 top-16 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-orange-300/14 blur-[100px] dark:bg-blue-600/12 sm:h-[400px] sm:w-[400px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-amber-300/10 blur-[100px] dark:bg-blue-500/8 sm:h-[340px] sm:w-[340px]" />

      <div
        className={[
          "relative mx-auto max-w-[1480px] origin-top transform-gpu transition-transform duration-300",
          "max-[1800px]:scale-[0.96]",
          "max-[1700px]:scale-[0.93]",
          "max-[1600px]:scale-[0.9]",
          "max-[1450px]:scale-[0.87]",
          "max-lg:scale-100",
        ].join(" ")}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp}>
            <SectionBadge icon={ClipboardCheck}>Từng bước xử lý</SectionBadge>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-5 text-[clamp(32px,4.2vw,54px)] font-black leading-[1.05] tracking-[-0.055em] text-slate-950 dark:text-white"
          >
            Một luồng rõ ràng từ AI chat đến thợ sửa chữa
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-3xl text-[16px] font-bold leading-8 text-slate-700 dark:text-slate-200 sm:text-[17px] sm:leading-8 xl:text-[18px] xl:leading-9"
          >
            Người dùng mô tả lỗi, AI hỏi thêm thông tin và chỉ chuyển sang gọi
            thợ khi thật sự cần thiết.
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-10 overflow-hidden rounded-[30px] border border-orange-200 bg-white/94 p-4 shadow-[0_24px_70px_rgba(255,122,0,0.11)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-5 lg:p-6 xl:mt-11 xl:p-6"
        >
          <div className="overflow-x-auto overscroll-x-contain pb-4">
            <div className="min-w-[760px] lg:min-w-[820px] xl:min-w-[860px] 2xl:min-w-[900px]">
              <div className="relative px-4 pt-5">
                <div className="absolute left-[9%] right-[9%] top-[42px] z-0 h-[5px] overflow-hidden rounded-full bg-orange-100 dark:bg-slate-700">
                  <motion.div
                    key={cycleKey}
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 shadow-[0_0_22px_rgba(255,122,0,0.34)] dark:from-blue-600 dark:via-cyan-400 dark:to-blue-400 dark:shadow-[0_0_24px_rgba(37,99,235,0.42)]"
                    style={{ width: fillWidth }}
                  />
                </div>

                <div className="relative z-10 grid grid-cols-4 gap-5 xl:gap-6">
                  {processSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === activeStep;
                    const isDone = index < activeStep;

                    return (
                      <div
                        key={step.title}
                        className="relative isolate flex flex-col items-center text-center"
                      >
                        <div className="relative z-20 flex items-center justify-center">
                          <span className="absolute h-[88px] w-[88px] rounded-full bg-white dark:bg-slate-900 xl:h-[94px] xl:w-[94px]" />

                          <AnimatePresence>
                            {isActive ? (
                              <motion.span
                                key={`ring-${index}`}
                                initial={{ scale: 0.88, opacity: 0 }}
                                animate={{ scale: 1.08, opacity: 1 }}
                                exit={{ scale: 0.96, opacity: 0 }}
                                transition={{
                                  duration: 0.42,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="absolute h-[78px] w-[78px] rounded-full border border-orange-400/55 bg-orange-500/10 dark:border-blue-400/55 dark:bg-blue-500/12 xl:h-[84px] xl:w-[84px]"
                              />
                            ) : null}
                          </AnimatePresence>

                          <motion.div
                            animate={{
                              scale: isActive ? 1.06 : 1,
                              opacity: isActive ? 1 : isDone ? 0.86 : 0.7,
                            }}
                            transition={{
                              duration: 0.35,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className={[
                              "relative z-30 flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 transition xl:h-[64px] xl:w-[64px]",
                              isActive
                                ? "border-orange-500 bg-orange-500 text-white shadow-[0_0_0_7px_rgba(255,122,0,0.14),0_14px_32px_rgba(255,122,0,0.24)] dark:border-blue-500 dark:bg-blue-700 dark:shadow-[0_0_0_7px_rgba(37,99,235,0.18),0_14px_32px_rgba(37,99,235,0.24)]"
                                : isDone
                                  ? "border-orange-300 bg-orange-100 text-orange-700 dark:border-blue-500/60 dark:bg-blue-500/18 dark:text-blue-200"
                                  : "border-orange-100 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
                            ].join(" ")}
                          >
                            <Icon className="h-6 w-6 xl:h-7 xl:w-7" />
                          </motion.div>
                        </div>

                        <motion.p
                          animate={{
                            opacity: isActive ? 1 : isDone ? 0.86 : 0.76,
                          }}
                          className={[
                            "mt-4 text-[13px] font-black uppercase tracking-[0.12em] xl:text-[14px]",
                            isActive
                              ? "text-orange-600 dark:text-blue-300"
                              : "text-slate-700 dark:text-slate-300",
                          ].join(" ")}
                        >
                          Bước {String(index + 1).padStart(2, "0")}
                        </motion.p>

                        <motion.h3
                          animate={{
                            opacity: isActive ? 1 : isDone ? 0.9 : 0.8,
                          }}
                          className={[
                            "mt-2 text-[18px] font-black leading-7 xl:text-[19px]",
                            isActive
                              ? "text-slate-950 dark:text-white"
                              : "text-slate-800 dark:text-slate-100",
                          ].join(" ")}
                        >
                          {step.title}
                        </motion.h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isDone = index < activeStep;

              const statusText = isActive
                ? "Đang xử lý"
                : isDone
                  ? "Đã qua"
                  : "Chưa tới";

              return (
                <motion.article
                  key={step.title}
                  animate={{
                    y: isActive ? -5 : 0,
                    scale: isActive ? 1.012 : 1,
                    opacity: isActive ? 1 : isDone ? 0.94 : 0.86,
                  }}
                  transition={{
                    duration: 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={[
                    "relative min-h-[220px] select-none overflow-hidden rounded-[24px] border p-5 text-left transition xl:min-h-[235px]",
                    isActive
                      ? "border-orange-400 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-[0_22px_58px_rgba(255,122,0,0.18)] ring-2 ring-orange-400/20 dark:border-blue-500/80 dark:from-blue-950/75 dark:via-slate-900 dark:to-slate-950 dark:shadow-[0_22px_58px_rgba(37,99,235,0.22)] dark:ring-blue-400/20"
                      : isDone
                        ? "border-orange-200 bg-white/88 shadow-[0_12px_34px_rgba(255,122,0,0.06)] dark:border-blue-500/25 dark:bg-blue-500/10"
                        : "border-orange-200 bg-white/90 shadow-[0_10px_30px_rgba(255,122,0,0.08)] dark:border-slate-700 dark:bg-slate-900/76",
                  ].join(" ")}
                >
                  {isActive ? (
                    <motion.div
                      aria-hidden="true"
                      initial={{ x: "-140%" }}
                      animate={{ x: "160%" }}
                      transition={{
                        duration: 1.25,
                        repeat: Infinity,
                        repeatDelay: 0.75,
                        ease: "easeInOut",
                      }}
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/24 to-transparent dark:via-blue-200/10"
                    />
                  ) : null}

                  <div className="relative flex items-start justify-between gap-4">
                    <div
                      className={[
                        "flex h-[52px] w-[52px] items-center justify-center rounded-[19px] transition xl:h-14 xl:w-14 xl:rounded-[20px]",
                        isActive
                          ? "bg-orange-500 text-white shadow-[0_12px_28px_rgba(255,122,0,0.22)] dark:bg-blue-700 dark:shadow-[0_12px_28px_rgba(37,99,235,0.24)]"
                          : isDone
                            ? "bg-orange-100 text-orange-600 dark:bg-blue-500/14 dark:text-blue-300"
                            : "bg-orange-50 text-orange-400 dark:bg-slate-800 dark:text-slate-300",
                      ].join(" ")}
                    >
                      <Icon className="h-6 w-6 xl:h-7 xl:w-7" />
                    </div>

                    <span
                      className={[
                        "rounded-full px-3 py-1.5 text-[12px] font-black uppercase tracking-[0.12em]",
                        isActive
                          ? "bg-orange-500 text-white dark:bg-blue-700"
                          : isDone
                            ? "bg-orange-100 text-orange-700 dark:bg-blue-500/14 dark:text-blue-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                      ].join(" ")}
                    >
                      {statusText}
                    </span>
                  </div>

                  <p
                    className={[
                      "relative mt-5 text-[13px] font-black uppercase tracking-[0.13em]",
                      isActive
                        ? "text-orange-600 dark:text-blue-300"
                        : isDone
                          ? "text-orange-500 dark:text-blue-300"
                          : "text-slate-500 dark:text-slate-300",
                    ].join(" ")}
                  >
                    Bước {String(index + 1).padStart(2, "0")}
                  </p>

                  <h4
                    className={[
                      "relative mt-3 text-[20px] font-black leading-8 xl:text-[21px]",
                      isActive
                        ? "text-slate-950 dark:text-white"
                        : isDone
                          ? "text-slate-800 dark:text-slate-100"
                          : "text-slate-700 dark:text-slate-200",
                    ].join(" ")}
                  >
                    {step.title}
                  </h4>

                  <p
                    className={[
                      "relative mt-3 text-[15px] font-bold leading-7 xl:text-[16px] xl:leading-8",
                      isActive
                        ? "text-slate-700 dark:text-slate-200"
                        : isDone
                          ? "text-slate-600 dark:text-slate-300"
                          : "text-slate-500 dark:text-slate-300",
                    ].join(" ")}
                  >
                    {step.desc}
                  </p>

                  {isDone ? (
                    <div className="relative mt-5 flex items-center gap-2 text-[14px] font-black text-orange-600 dark:text-blue-300">
                      <CheckCircle2 className="h-5 w-5" />
                      Đã hoàn tất bước này
                    </div>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}