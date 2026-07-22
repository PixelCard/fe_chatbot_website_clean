// app/components/home/HomeFinalCtaSection.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, Sparkles } from "lucide-react";

import { APP_ROUTES } from "@/app/config/routes";

import { finalCtaFeatures, HOME_ANIMATIONS } from "./data";
import { fadeUp, stagger } from "./motion";
import { LottiePlayer } from "./ui/LottiePlayer";

const assistantSteps = [
  {
    title: "AI hỏi đúng thông tin lỗi",
    desc: "Người dùng mô tả thiết bị, triệu chứng và tình trạng đang gặp.",
  },
  {
    title: "Gom triệu chứng thành tóm tắt",
    desc: "Hệ thống tự tổng hợp lỗi để tránh thiếu dữ liệu khi phát đơn.",
  },
  {
    title: "Gọi thợ khi đã đủ thông tin",
    desc: "Kỹ thuật viên nhận được bối cảnh rõ hơn trước khi xử lý.",
  },
];

function PrimaryActionButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[17px] bg-orange-500 px-5 text-[14px] font-black text-white shadow-[0_14px_34px_rgba(255,122,0,0.26)] transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_18px_42px_rgba(255,122,0,0.34)] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 dark:bg-blue-700 dark:shadow-[0_14px_34px_rgba(37,99,235,0.28)] dark:hover:bg-blue-800 dark:focus-visible:ring-blue-500/30 sm:min-h-[52px] sm:px-6 sm:text-[15px]"
    >
      {children}
      <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1" />
    </Link>
  );
}

function SecondaryActionButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[17px] border border-orange-200 bg-white/82 px-5 text-[14px] font-black text-slate-900 shadow-[0_10px_28px_rgba(255,122,0,0.07)] backdrop-blur-[12px] transition duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-white hover:shadow-[0_14px_36px_rgba(255,122,0,0.11)] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/18 dark:border-slate-600 dark:bg-slate-900/76 dark:text-white dark:hover:border-blue-500/50 dark:focus-visible:ring-blue-500/25 sm:min-h-[52px] sm:px-6 sm:text-[15px]"
    >
      {children}
      <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1" />
    </Link>
  );
}

export function HomeFinalCtaSection() {
  return (
    <section
      id="assistant"
      className="relative overflow-hidden bg-white px-4 py-10 dark:bg-[#070b12] sm:px-6 sm:py-12 lg:px-8 lg:py-14 xl:py-16"
    >
      <div className="pointer-events-none absolute -left-36 top-20 h-[300px] w-[300px] rounded-full bg-orange-300/12 blur-[90px] dark:bg-blue-600/10 sm:h-[360px] sm:w-[360px]" />
      <div className="pointer-events-none absolute -right-36 bottom-14 h-[300px] w-[300px] rounded-full bg-amber-300/10 blur-[90px] dark:bg-blue-500/8 sm:h-[360px] sm:w-[360px]" />

      <div
        className={[
          "relative mx-auto max-w-[1380px] origin-top transform-gpu transition-transform duration-300",
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
          className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-[0_18px_56px_rgba(255,122,0,0.11)] dark:border-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 dark:shadow-[0_22px_64px_rgba(0,0,0,0.32)] sm:rounded-[32px] sm:p-6 lg:p-7 xl:p-8"
        >
          <div className="pointer-events-none absolute -right-28 -top-28 h-[300px] w-[300px] rounded-full bg-orange-300/18 blur-[90px] dark:bg-blue-600/16" />
          <div className="pointer-events-none absolute -bottom-32 left-10 h-[280px] w-[280px] rounded-full bg-amber-300/12 blur-[90px] dark:bg-blue-500/8" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/65 to-transparent dark:via-blue-400/55" />
          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-300/45 to-transparent dark:via-blue-400/35" />

          <div className="relative grid items-center gap-7 xl:grid-cols-[0.98fr_1.02fr] xl:gap-8">
            <motion.div variants={fadeUp} className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/86 px-3.5 py-2 text-[12px] font-black uppercase tracking-[0.13em] text-orange-600 shadow-[0_8px_22px_rgba(255,122,0,0.07)] backdrop-blur-[12px] dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300 sm:text-[13px]">
                <Bot className="h-4 w-4" />
                AI chat là điểm bắt đầu
              </div>

              <h2 className="mt-4 max-w-4xl text-[clamp(32px,4vw,54px)] font-black leading-[1.04] tracking-[-0.055em] text-slate-950 drop-shadow-[0_10px_24px_rgba(15,23,42,0.07)] dark:text-white dark:drop-shadow-[0_14px_34px_rgba(37,99,235,0.13)] 2xl:text-[clamp(34px,4.4vw,60px)]">
                Bắt đầu sửa chữa bằng AI, gọi thợ khi đã đủ thông tin
              </h2>

              <p className="mt-4 max-w-3xl text-[15px] font-bold leading-7 text-slate-700 dark:text-slate-200 sm:text-[16px] sm:leading-8 2xl:text-[17px]">
                SmartElec giúp người dùng mô tả lỗi dễ hơn, gom triệu chứng rõ
                hơn và hạn chế thiếu dữ liệu trước khi phát đơn cho kỹ thuật
                viên.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {assistantSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    variants={fadeUp}
                    whileHover={{ y: -3 }}
                    className="group min-h-[96px] rounded-[20px] border border-orange-100 bg-white/86 p-3.5 shadow-[0_10px_28px_rgba(255,122,0,0.08)] backdrop-blur-lg transition duration-300 hover:border-orange-200 hover:bg-white hover:shadow-[0_14px_38px_rgba(255,122,0,0.11)] dark:border-blue-500/20 dark:bg-blue-500/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.16)] dark:hover:border-blue-500/45 sm:min-h-[104px] sm:p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[15px] bg-orange-500 text-[14px] font-black text-white shadow-[0_10px_24px_rgba(255,122,0,0.22)] transition group-hover:scale-105 dark:bg-blue-700 dark:shadow-[0_10px_24px_rgba(37,99,235,0.24)]">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[15px] font-black leading-6 text-slate-950 dark:text-white sm:text-[16px]">
                          {step.title}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-[13px] font-bold leading-6 text-slate-600 dark:text-slate-300 sm:text-[14px]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <PrimaryActionButton href={APP_ROUTES.CLIENT.CHAT_BOT}>
                  Mở AI chat ngay
                </PrimaryActionButton>

                <SecondaryActionButton href={APP_ROUTES.Auth.LOGIN}>
                  Đăng nhập để theo dõi đơn
                </SecondaryActionButton>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3.5">
              <div className="relative overflow-hidden rounded-[24px] border border-orange-100 bg-white/86 p-3.5 shadow-[0_14px_44px_rgba(255,122,0,0.08)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/78 dark:shadow-[0_16px_50px_rgba(0,0,0,0.26)] sm:p-4">
                <div className="pointer-events-none absolute inset-x-8 top-8 h-32 rounded-full bg-orange-300/16 blur-[60px] dark:bg-blue-500/16" />

                <div className="relative overflow-hidden rounded-[22px] border border-orange-100 bg-gradient-to-br from-white via-orange-50 to-amber-50 p-3.5 shadow-inner dark:border-blue-500/20 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 sm:rounded-[24px] sm:p-4">
                  <LottiePlayer
                    src={HOME_ANIMATIONS.manRobot}
                    ariaLabel="Người dùng và trợ lý AI SmartElec"
                    className="mx-auto h-[170px] w-full sm:h-[200px] lg:h-[220px] xl:h-[240px] 2xl:h-[255px]"
                  />

                  <div className="mt-3 rounded-[20px] border border-orange-100 bg-white/90 px-4 py-3 text-center shadow-[0_12px_28px_rgba(255,122,0,0.07)] dark:border-blue-500/20 dark:bg-blue-500/10 dark:shadow-[0_12px_28px_rgba(37,99,235,0.10)]">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="h-[18px] w-[18px] text-orange-500 dark:text-blue-300" />

                      <p className="text-[15px] font-black leading-6 text-slate-950 dark:text-white sm:text-[16px] 2xl:text-[17px]">
                        AI tư vấn trước, kỹ thuật viên xử lý sau
                      </p>
                    </div>

                    <p className="mx-auto mt-1.5 max-w-xl text-[13px] font-bold leading-6 text-slate-600 dark:text-slate-300 sm:text-[14px]">
                      Luồng sửa chữa rõ ràng hơn từ bước mô tả lỗi đầu tiên.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {finalCtaFeatures.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      whileHover={{ y: -3 }}
                      className="group rounded-[20px] border border-orange-100 bg-white/86 p-4 shadow-[0_10px_30px_rgba(255,122,0,0.07)] backdrop-blur-lg transition duration-300 hover:border-orange-200 hover:bg-white hover:shadow-[0_14px_40px_rgba(255,122,0,0.11)] dark:border-slate-700 dark:bg-slate-900/74 dark:shadow-[0_10px_34px_rgba(0,0,0,0.20)] dark:hover:border-blue-500/45"
                    >
                      <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[17px] bg-orange-500/10 text-orange-600 ring-1 ring-orange-100 transition group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(255,122,0,0.18)] dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20 dark:group-hover:bg-blue-700">
                        <Icon className="h-6 w-6" />
                      </div>

                      <h3 className="mt-3 text-[17px] font-black leading-7 text-slate-950 dark:text-white sm:text-[18px] 2xl:text-[19px]">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-[14px] font-semibold leading-6 text-slate-700 dark:text-slate-300">
                        {item.desc}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-[13px] font-black text-orange-600 dark:text-blue-300">
                        <CheckCircle2 className="h-[18px] w-[18px]" />
                        <span>Rõ ràng hơn</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}