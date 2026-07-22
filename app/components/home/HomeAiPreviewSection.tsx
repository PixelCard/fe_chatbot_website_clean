// app/components/home/HomeAiPreviewSection.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CheckCircle2 } from "lucide-react";

import { APP_ROUTES } from "@/app/config/routes";

import { serviceCategories } from "./data";
import { fadeUp, stagger } from "./motion";
import { AiMockupCard } from "./ui/AiMockupCard";
import { GradientButton } from "./ui/GradientButton";
import { SectionBadge } from "./ui/SectionBadge";

type ServiceCategoryItem = (typeof serviceCategories)[number];

function getDisplayTitle(title: string) {
  return title === "Laptop / PC" ? "Máy tính / Laptop" : title;
}

function ServiceCategoryButton({
  item,
  isActive,
  onSelect,
}: {
  item: ServiceCategoryItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={[
        "group relative min-h-[116px] overflow-hidden rounded-[22px] border p-4 text-left transition duration-300 sm:min-h-[124px] sm:p-5 xl:min-h-[128px]",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 dark:focus-visible:ring-blue-500/25",
        isActive
          ? "border-orange-400 bg-orange-50 shadow-[0_14px_38px_rgba(255,122,0,0.12)] ring-2 ring-orange-400/20 dark:border-blue-500/70 dark:bg-blue-500/14 dark:shadow-[0_14px_38px_rgba(37,99,235,0.16)] dark:ring-blue-400/20"
          : "border-orange-200 bg-white/90 shadow-[0_10px_30px_rgba(255,122,0,0.09)] hover:-translate-y-0.5 hover:border-orange-300 hover:bg-white hover:shadow-[0_14px_34px_rgba(255,122,0,0.12)] dark:border-slate-700 dark:bg-slate-900/72 dark:hover:border-blue-500/40 dark:hover:bg-slate-900",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-orange-300/12 blur-[44px] transition group-hover:bg-orange-400/18 dark:bg-blue-500/12 dark:group-hover:bg-blue-500/18" />

      <div className="relative flex items-start gap-4">
        <div
          className={[
            "flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[18px] transition duration-300 sm:h-[50px] sm:w-[50px]",
            isActive
              ? "bg-orange-500 text-white shadow-[0_12px_28px_rgba(255,122,0,0.20)] dark:bg-blue-700 dark:shadow-[0_12px_28px_rgba(37,99,235,0.22)]"
              : "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white dark:bg-blue-500/12 dark:text-blue-300 dark:group-hover:bg-blue-700",
          ].join(" ")}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <h3 className="text-[17px] font-black leading-7 text-slate-950 dark:text-white sm:text-[18px]">
            {getDisplayTitle(item.title)}
          </h3>

          <p className="mt-1.5 text-[14px] font-semibold leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
            {item.desc}
          </p>
        </div>
      </div>

      {isActive ? (
        <div className="absolute inset-x-5 bottom-0 h-1 rounded-full bg-orange-500 dark:bg-blue-500" />
      ) : null}
    </button>
  );
}

function SelectedDevicePanel({ item }: { item: ServiceCategoryItem }) {
  const Icon = item.icon;
  const title = getDisplayTitle(item.title);

  return (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[26px] border border-orange-200 bg-white/92 p-5 shadow-[0_18px_48px_rgba(255,122,0,0.11)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/78 dark:shadow-[0_18px_48px_rgba(0,0,0,0.24)] sm:rounded-[28px] sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-300/14 blur-[54px] dark:bg-blue-500/14" />

      <div className="relative grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[26px] bg-orange-500 text-white shadow-[0_16px_36px_rgba(255,122,0,0.20)] dark:bg-blue-700 dark:shadow-[0_16px_36px_rgba(37,99,235,0.22)] sm:h-[80px] sm:w-[80px]">
          <Icon className="h-9 w-9 sm:h-10 sm:w-10" />
        </div>

        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-[13px] font-black uppercase tracking-[0.12em] text-orange-600 dark:bg-blue-500/12 dark:text-blue-300">
            <CheckCircle2 className="h-4 w-4" />
            Nhóm thiết bị đang chọn
          </div>

          <h3 className="mt-4 text-[23px] font-black leading-8 tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[26px] sm:leading-9">
            {title}
          </h3>

          <p className="mt-3 max-w-3xl text-[16px] font-semibold leading-8 text-slate-700 dark:text-slate-200">
            AI sẽ hỏi thêm triệu chứng, thời điểm lỗi xuất hiện và mức độ khẩn
            cấp để gom thông tin trước khi đề xuất gọi kỹ thuật viên.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Mô tả lỗi", "AI hỏi thêm", "Gọi thợ khi cần"].map((label) => (
              <div
                key={label}
                className="rounded-[18px] border border-orange-100 bg-orange-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/10"
              >
                <p className="text-[14px] font-black leading-6 text-slate-800 dark:text-slate-100">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HomeAiPreviewSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedCategory =
    serviceCategories[selectedIndex] ?? serviceCategories[0];

  return (
    <section
      id="ai-preview"
      className="relative overflow-hidden bg-[#f7f1e8] px-4 py-14 text-slate-950 dark:bg-[#070b12] dark:text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:py-22"
    >
      <div className="pointer-events-none absolute -left-28 top-20 h-[320px] w-[320px] rounded-full bg-orange-300/14 blur-[90px] dark:bg-blue-600/10 sm:h-[380px] sm:w-[380px]" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-[320px] w-[320px] rounded-full bg-amber-300/10 blur-[90px] dark:bg-blue-500/8 sm:h-[380px] sm:w-[380px]" />

      <div
        className={[
          "relative mx-auto grid max-w-[1480px] origin-top transform-gpu items-center gap-8 transition-transform duration-300",
          "xl:grid-cols-[minmax(440px,0.86fr)_minmax(0,1.14fr)] xl:gap-10",
          "2xl:grid-cols-[minmax(480px,0.9fr)_minmax(620px,1.1fr)]",
          "max-[1800px]:scale-[0.96]",
          "max-[1700px]:scale-[0.93]",
          "max-[1600px]:scale-[0.9]",
          "max-[1450px]:scale-[0.87]",
          "max-xl:scale-100",
        ].join(" ")}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto w-full max-w-[560px] xl:max-w-[580px] 2xl:max-w-[620px]"
        >
          <AiMockupCard />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="w-full min-w-0"
        >
          <motion.div variants={fadeUp}>
            <SectionBadge icon={Bot}>AI tư vấn trước</SectionBadge>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-5 max-w-4xl text-[clamp(32px,4vw,52px)] font-black leading-[1.06] tracking-[-0.055em] text-slate-950 dark:text-white 2xl:text-[clamp(34px,4.4vw,56px)]"
          >
            AI gom thông tin lỗi trước khi chuyển sang gọi thợ
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-4xl text-[16px] font-bold leading-8 text-slate-700 dark:text-slate-200 sm:text-[17px] sm:leading-8 2xl:text-[18px] 2xl:leading-9"
          >
            Thay vì để người dùng tự chọn dịch vụ, SmartElec để AI hỏi theo từng
            bước: thiết bị gì, lỗi xảy ra khi nào, có âm thanh, mã lỗi, hình ảnh
            không và mức độ khẩn cấp ra sao.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            {serviceCategories.map((item, index) => (
              <ServiceCategoryButton
                key={item.title}
                item={item}
                isActive={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
              />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5">
            <AnimatePresence mode="wait">
              {selectedCategory ? (
                <SelectedDevicePanel item={selectedCategory} />
              ) : null}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <GradientButton href={APP_ROUTES.CLIENT.CHAT_BOT}>
              Thử chẩn đoán ngay với AI
            </GradientButton>

            <p className="text-[15px] font-bold leading-7 text-slate-600 dark:text-slate-300">
              Chọn nhóm thiết bị để xem cách AI gom thông tin trước khi gọi thợ.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}