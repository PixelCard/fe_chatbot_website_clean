// app/components/home/HomeHeroSection.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  MessageSquareText,
  Sparkles,
  Wrench,
} from "lucide-react";

import { APP_ROUTES } from "@/app/config/routes";

import { HOME_ANIMATIONS, heroTrustChips } from "./data";
import { fadeUp, stagger } from "./motion";
import { LottiePlayer } from "./ui/LottiePlayer";
import { SectionBadge } from "./ui/SectionBadge";

function HeroPrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[14px] bg-orange-500 px-4 text-[14px] font-black text-white shadow-[0_10px_26px_rgba(255,122,0,0.22)] transition duration-300 hover:bg-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 dark:bg-blue-700 dark:shadow-[0_10px_26px_rgba(37,99,235,0.24)] dark:hover:bg-blue-800 dark:focus-visible:ring-blue-500/30 sm:min-h-[52px] sm:w-auto sm:gap-2.5 sm:rounded-[18px] sm:px-6 sm:text-[16px]"
    >
      {children}

      <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1 sm:h-5 sm:w-5" />
    </Link>
  );
}

function HeroSecondaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[14px] border border-orange-200 bg-white/86 px-4 text-[14px] font-black text-slate-900 shadow-[0_8px_22px_rgba(255,122,0,0.07)] backdrop-blur-[16px] transition duration-300 hover:border-orange-300 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/18 dark:border-slate-600 dark:bg-slate-900/76 dark:text-white dark:hover:border-blue-500/50 dark:focus-visible:ring-blue-500/25 sm:min-h-[52px] sm:w-auto sm:gap-2.5 sm:rounded-[18px] sm:px-6 sm:text-[16px]"
    >
      {children}

      <ArrowRight className="h-[18px] w-[18px] transition group-hover:translate-x-1 sm:h-5 sm:w-5" />
    </Link>
  );
}

export function HomeHeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative overflow-hidden bg-[#f9f4ec] px-3 pb-7 pt-[82px] text-slate-950 transition-colors dark:bg-[#05070b] dark:text-white sm:px-6 sm:pb-10 sm:pt-[94px] lg:flex lg:min-h-[100svh] lg:items-center lg:px-8 lg:pb-12 lg:pt-[104px]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 28, -16, 0],
            y: [0, -22, 14, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-28 left-[2%] h-[220px] w-[220px] rounded-full bg-orange-300/20 blur-[70px] dark:bg-blue-600/16 sm:-top-44 sm:left-[8%] sm:h-[420px] sm:w-[420px] sm:blur-[90px]"
        />

        <motion.div
          animate={{
            x: [0, -22, 18, 0],
            y: [0, 20, -14, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute -bottom-24 right-[2%] h-[220px] w-[220px] rounded-full bg-amber-300/16 blur-[70px] dark:bg-cyan-500/10 sm:-bottom-40 sm:right-[8%] sm:h-[420px] sm:w-[420px] sm:blur-[90px]"
        />

        <div
          className="absolute inset-0 opacity-[0.18] dark:opacity-[0.045] sm:opacity-[0.24] sm:dark:opacity-[0.055]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <motion.div
        style={{
          y: heroY,
          opacity: heroOpacity,
        }}
        className="relative z-10 mx-auto grid w-full max-w-[1480px] items-center gap-7 sm:gap-9 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.85fr)] lg:gap-8 xl:gap-10 2xl:grid-cols-[minmax(0,1fr)_minmax(500px,0.9fr)]"
      >
        {/* LEFT CONTENT */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="min-w-0 text-center lg:text-left"
        >
          <motion.div variants={fadeUp}>
            <SectionBadge icon={Sparkles}>
              Nền tảng AI tư vấn sửa chữa
            </SectionBadge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mx-auto mt-3 max-w-4xl text-[clamp(31px,10vw,40px)] font-black leading-[1.02] tracking-[-0.05em] text-slate-950 drop-shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:text-white dark:drop-shadow-[0_14px_34px_rgba(37,99,235,0.16)] sm:mt-5 sm:text-[clamp(42px,7vw,64px)] sm:leading-[0.98] sm:tracking-[-0.06em] lg:mx-0 lg:text-[clamp(46px,4.8vw,74px)] xl:text-[clamp(50px,4.9vw,82px)]"
          >
            Hỏi AI trước,{" "}
            <span className="text-orange-500 dark:text-blue-300">
              gọi thợ sau
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-3 max-w-3xl text-[14px] font-bold leading-6 text-slate-700 dark:text-slate-200 sm:mt-5 sm:text-[17px] sm:leading-8 lg:mx-0 xl:text-[18px]"
          >
            SmartElec giúp bạn mô tả lỗi thiết bị, nhận chẩn đoán sơ bộ từ AI và
            gọi kỹ thuật viên phù hợp khi cần sửa trực tiếp.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-5 flex flex-col justify-center gap-2.5 min-[420px]:flex-row sm:mt-7 sm:gap-3 lg:justify-start"
          >
            <HeroPrimaryButton href={APP_ROUTES.CLIENT.CHAT_BOT}>
              Bắt đầu chẩn đoán với AI
            </HeroPrimaryButton>

            <HeroSecondaryButton href="#process">
              Xem quy trình
            </HeroSecondaryButton>
          </motion.div>

          {/* MOBILE COMPACT TRUST CARDS */}
          <motion.div
            variants={fadeUp}
            className="mt-5 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-3 lg:gap-3 xl:gap-4"
          >
            {heroTrustChips.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -3 }}
                  className="group relative min-w-0 rounded-[14px] border border-orange-200 bg-white/90 px-2 py-2.5 text-center shadow-[0_8px_22px_rgba(255,122,0,0.08)] backdrop-blur-lg transition duration-300 hover:border-orange-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/74 dark:shadow-[0_10px_26px_rgba(0,0,0,0.20)] dark:hover:border-blue-500/40 sm:min-h-[112px] sm:rounded-[22px] sm:p-4 sm:text-left xl:min-h-[120px]"
                >
                  <div className="flex items-start justify-between gap-1.5 sm:gap-3">
                    <div className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-orange-500/10 text-orange-600 ring-1 ring-orange-100 transition group-hover:bg-orange-500 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20 dark:group-hover:bg-blue-700 sm:mx-0 sm:h-[44px] sm:w-[44px] sm:rounded-[17px]">
                      <Icon className="h-[18px] w-[18px] sm:h-6 sm:w-6" />
                    </div>

                    <div className="absolute right-1.5 top-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white shadow-[0_6px_16px_rgba(255,122,0,0.18)] dark:bg-blue-700 sm:static sm:h-7 sm:w-7 sm:text-[13px] sm:shadow-[0_10px_24px_rgba(255,122,0,0.22)]">
                      {index + 1}
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 text-[11px] font-black leading-4 text-slate-950 dark:text-white sm:mt-4 sm:text-[16px] sm:leading-6">
                    {item.title}
                  </p>

                  <p className="mt-2 hidden text-[14px] font-bold leading-6 text-slate-600 dark:text-slate-300 sm:block">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* RIGHT ROBOT PREVIEW */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative mx-auto w-full max-w-[420px] sm:max-w-[540px] lg:max-w-none"
        >
          <div className="absolute -inset-3 rounded-full bg-orange-400/14 blur-[42px] dark:bg-blue-500/16 sm:-inset-5 sm:blur-[60px]" />

          <div className="relative overflow-hidden rounded-[22px] border border-orange-200/90 bg-white/90 p-2.5 shadow-[0_18px_50px_rgba(255,122,0,0.13)] backdrop-blur-[18px] dark:border-slate-700 dark:bg-slate-900/82 dark:shadow-[0_22px_58px_rgba(0,0,0,0.34)] sm:rounded-[34px] sm:p-4 sm:shadow-[0_26px_76px_rgba(255,122,0,0.16)]"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-300/20 blur-[55px] dark:bg-blue-500/16 sm:h-52 sm:w-52 sm:blur-[70px]" />

            <div className="absolute -bottom-24 left-8 h-40 w-40 rounded-full bg-amber-300/12 blur-[55px] dark:bg-cyan-500/8 sm:h-52 sm:w-52 sm:blur-[70px]" />

            <div className="absolute right-2.5 top-2.5 z-10 max-w-[52%] rounded-[12px] border border-orange-100 bg-white/90 px-2 py-1.5 shadow-[0_8px_20px_rgba(255,122,0,0.08)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/90 sm:right-4 sm:top-4 sm:max-w-[48%] sm:rounded-[16px] sm:px-3 sm:py-2.5 sm:shadow-[0_12px_28px_rgba(255,122,0,0.10)]">
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70 dark:bg-blue-400" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500 dark:bg-blue-500 sm:h-3 sm:w-3" />
                </span>

                <span className="truncate text-[10px] font-black text-slate-800 dark:text-white sm:text-[14px]">
                  AI đang chẩn đoán
                </span>
              </div>
            </div>

            <div className="relative min-h-[268px] rounded-[18px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-2.5 shadow-inner dark:border-blue-500/20 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 sm:min-h-[380px] sm:rounded-[30px] sm:p-4 lg:min-h-[390px] xl:min-h-[430px]">
              <div className="absolute left-2.5 top-2.5 z-10 max-w-[44%] rounded-[12px] border border-orange-100 bg-white/90 px-2 py-1.5 shadow-[0_8px_20px_rgba(255,122,0,0.08)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/90 sm:left-4 sm:top-4 sm:max-w-[48%] sm:rounded-[16px] sm:px-3 sm:py-2.5 sm:shadow-[0_12px_28px_rgba(255,122,0,0.10)]">
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <Bot className="h-3.5 w-3.5 shrink-0 text-orange-500 dark:text-blue-300 sm:h-5 sm:w-5" />

                  <span className="truncate text-[10px] font-black text-slate-800 dark:text-white sm:text-[14px]">
                    SmartElec AI
                  </span>
                </div>
              </div>

              <LottiePlayer
                src={HOME_ANIMATIONS.heroRobot}
                ariaLabel="Robot AI SmartElec đang tư vấn sửa chữa"
                className="mx-auto h-[180px] w-full max-w-[290px] sm:h-[300px] sm:max-w-[440px] lg:h-[310px] xl:h-[350px] xl:max-w-[480px]"
              />

              <div className="absolute bottom-2.5 left-2.5 right-2.5 grid grid-cols-2 gap-2 sm:bottom-4 sm:left-4 sm:right-4 sm:gap-3">
                <div className="min-w-0 rounded-[13px] border border-orange-100 bg-white/92 p-2.5 shadow-[0_8px_22px_rgba(255,122,0,0.08)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/90 sm:rounded-[20px] sm:p-3.5 sm:shadow-[0_12px_30px_rgba(255,122,0,0.10)]">
                  <div className="flex items-center gap-1.5 sm:gap-2.5">
                    <MessageSquareText className="h-4 w-4 shrink-0 text-orange-500 dark:text-blue-300 sm:h-5 sm:w-5" />

                    <p className="truncate text-[8px] font-black uppercase tracking-[0.08em] text-orange-500 dark:text-blue-300 sm:text-[12px] sm:tracking-[0.13em]">
                      Bước tiếp theo
                    </p>
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-[11px] font-black leading-4 text-slate-950 dark:text-white sm:mt-2 sm:text-[17px] sm:leading-7">
                    Xác nhận gọi thợ
                  </p>
                </div>

                <div className="min-w-0 rounded-[13px] border border-orange-100 bg-white/92 p-2.5 shadow-[0_8px_22px_rgba(255,122,0,0.08)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/90 sm:rounded-[20px] sm:p-3.5 sm:shadow-[0_12px_30px_rgba(255,122,0,0.10)]">
                  <div className="flex items-center gap-1.5 sm:gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500 dark:text-blue-300 sm:h-5 sm:w-5" />

                    <p className="truncate text-[8px] font-black uppercase tracking-[0.08em] text-orange-500 dark:text-blue-300 sm:text-[12px] sm:tracking-[0.13em]">
                      Trạng thái
                    </p>
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-[11px] font-black leading-4 text-slate-950 dark:text-white sm:mt-2 sm:text-[17px] sm:leading-7">
                    Đủ dữ liệu sơ bộ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL BENEFIT CARDS */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
            <div className="min-w-0 rounded-[15px] border border-orange-100 bg-white/78 p-3 shadow-[0_8px_24px_rgba(255,122,0,0.07)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/72 sm:rounded-[22px] sm:p-4 sm:shadow-[0_12px_34px_rgba(255,122,0,0.08)]">
              <Wrench className="h-5 w-5 text-orange-500 dark:text-blue-300 sm:h-6 sm:w-6" />

              <p className="mt-2 text-[13px] font-black leading-5 text-slate-950 dark:text-white sm:mt-3 sm:text-[17px]">
                Gọi thợ khi cần
              </p>

              <p className="mt-2 hidden text-[14px] font-bold leading-6 text-slate-600 dark:text-slate-300 sm:block">
                Chỉ chuyển ca khi người dùng đã sẵn sàng đặt lịch.
              </p>
            </div>

            <div className="min-w-0 rounded-[15px] border border-orange-100 bg-white/78 p-3 shadow-[0_8px_24px_rgba(255,122,0,0.07)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/72 sm:rounded-[22px] sm:p-4 sm:shadow-[0_12px_34px_rgba(255,122,0,0.08)]">
              <CheckCircle2 className="h-5 w-5 text-orange-500 dark:text-blue-300 sm:h-6 sm:w-6" />

              <p className="mt-2 text-[13px] font-black leading-5 text-slate-950 dark:text-white sm:mt-3 sm:text-[17px]">
                Theo dõi rõ ràng
              </p>

              <p className="mt-2 hidden text-[14px] font-bold leading-6 text-slate-600 dark:text-slate-300 sm:block">
                Nắm được báo giá, trạng thái và tiến độ xử lý.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}