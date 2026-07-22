// app/components/home/HomeFeedbackSection.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star, Wrench } from "lucide-react";

import { fadeUp, stagger } from "./motion";

type FeedbackItem = {
  id: string;
  name: string;
  device: string;
  content: string;
  rating: number;
};

const feedbackItems: FeedbackItem[] = [
  {
    id: "fb-001",
    name: "Chị Ngọc Anh",
    device: "Máy giặt cửa trước",
    content:
      "AI hỏi từng bước nên tôi biết cần mô tả gì, không phải tự đoán nguyên nhân lỗi như trước.",
    rating: 5,
  },
  {
    id: "fb-002",
    name: "Anh Hoàng Nam",
    device: "Laptop Dell",
    content:
      "Phần tóm tắt triệu chứng rõ ràng, giúp tôi hiểu tình trạng máy trước khi quyết định gọi thợ.",
    rating: 5,
  },
  {
    id: "fb-003",
    name: "Cô Thanh Mai",
    device: "Tủ lạnh gia đình",
    content:
      "Hệ thống hỏi thêm dấu hiệu bất thường rồi mới đề xuất gọi kỹ thuật viên, nên tôi thấy yên tâm hơn.",
    rating: 5,
  },
  {
    id: "fb-004",
    name: "Anh Đức Huy",
    device: "Máy lạnh treo tường",
    content:
      "Quy trình dễ hiểu, có ghi lại tình trạng lỗi nên khi đặt lịch không cần giải thích lại quá nhiều.",
    rating: 5,
  },
  {
    id: "fb-005",
    name: "Chị Bảo Trân",
    device: "Lò vi sóng",
    content:
      "Tôi chỉ cần mô tả lỗi trong phần chat, AI tự gom thông tin và gợi ý bước xử lý tiếp theo.",
    rating: 5,
  },
  {
    id: "fb-006",
    name: "Anh Minh Tuấn",
    device: "Tủ lạnh Side-by-Side",
    content:
      "AI gom triệu chứng thành một bản tóm tắt rõ ràng, thợ đến kiểm tra nhanh hơn.",
    rating: 5,
  },
  {
    id: "fb-007",
    name: "Chị Hà Vy",
    device: "Nồi chiên không dầu",
    content:
      "Tôi biết được lỗi nào nên gọi thợ ngay, lỗi nào cần kiểm tra thêm trước khi đặt lịch.",
    rating: 5,
  },
  {
    id: "fb-008",
    name: "Anh Quốc Bảo",
    device: "Máy lạnh âm trần",
    content:
      "Các bước đặt lịch dễ hiểu, thông tin lỗi được lưu lại đầy đủ nên quá trình xử lý rõ ràng hơn.",
    rating: 5,
  },
  {
    id: "fb-009",
    name: "Chị Phương Linh",
    device: "Máy rửa chén",
    content:
      "Tôi thích cách AI hỏi đúng trọng tâm, không làm người dùng bị rối khi mô tả lỗi thiết bị.",
    rating: 5,
  },
  {
    id: "fb-010",
    name: "Anh Thành Đạt",
    device: "PC gaming",
    content:
      "Sau khi mô tả tình trạng máy bị tắt đột ngột, hệ thống tóm tắt lỗi khá dễ hiểu.",
    rating: 5,
  },
];

function getNameInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "KH";

  return words
    .slice(-2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function FeedbackCard({
  item,
  index,
  shouldFloat = true,
}: {
  item: FeedbackItem;
  index: number;
  shouldFloat?: boolean;
}) {
  const initials = getNameInitials(item.name);
  const waveOffset = index % 2 === 0 ? -6 : 6;

  return (
    <motion.article
      animate={
        shouldFloat
          ? {
            y: [waveOffset, waveOffset * -0.45, waveOffset],
          }
          : undefined
      }
      transition={
        shouldFloat
          ? {
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (index % 5) * 0.25,
          }
          : undefined
      }
      className="group relative w-[320px] shrink-0 overflow-hidden rounded-[28px] border border-orange-100 bg-white/88 p-5 text-left shadow-[0_18px_54px_rgba(255,122,0,0.08)] backdrop-blur-[22px] transition hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-[0_24px_66px_rgba(255,122,0,0.12)] dark:border-slate-700 dark:bg-slate-900/78 dark:shadow-[0_20px_60px_rgba(0,0,0,0.24)] dark:hover:border-blue-500/40 sm:w-[360px] xl:w-[380px]"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-orange-300/16 blur-[50px] transition group-hover:bg-orange-400/22 dark:bg-blue-500/14 dark:group-hover:bg-blue-500/20" />

      <div className="relative flex items-center gap-1.5 text-amber-400">
        {Array.from({ length: item.rating }).map((_, starIndex) => (
          <Star
            key={`${item.id}-${starIndex}`}
            className="h-[18px] w-[18px] fill-current sm:h-5 sm:w-5"
          />
        ))}
      </div>

      <p className="relative mt-5 min-h-[112px] text-[15px] font-bold leading-8 text-slate-700 dark:text-slate-200 sm:text-[16px] sm:leading-8 xl:min-h-[124px] xl:text-[17px] xl:leading-9">
        “{item.content}”
      </p>

      <div className="relative mt-6 border-t border-orange-100 pt-5 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex h-13 w-13 h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[20px] bg-orange-500 text-[14px] font-black text-white shadow-[0_14px_30px_rgba(255,122,0,0.22)] dark:bg-blue-700 dark:shadow-[0_14px_30px_rgba(37,99,235,0.24)] sm:h-14 sm:w-14 sm:rounded-[22px] sm:text-[15px]">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-black leading-7 text-slate-950 dark:text-white sm:text-[18px]">
              {item.name}
            </h3>

            <div className="mt-1 flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
              <Wrench className="h-4 w-4 shrink-0 text-orange-500 dark:text-blue-300" />
              <p className="truncate text-[14px] font-semibold leading-6 sm:text-[15px]">
                {item.device}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function FeedbackMarqueeRow({
  items,
  reverse = false,
  duration = 38,
}: {
  items: FeedbackItem[];
  reverse?: boolean;
  duration?: number;
}) {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#fffaf4] to-transparent dark:from-[#05070b] sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#fffaf4] to-transparent dark:from-[#05070b] sm:w-32" />

      <motion.div
        className="flex w-max gap-4 sm:gap-5"
        animate={{
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedItems.map((item, index) => (
          <FeedbackCard
            key={`${item.id}-${index}`}
            item={item}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function HomeFeedbackSection() {
  const shouldReduceMotion = useReducedMotion();

  const firstRow = feedbackItems.slice(
    0,
    Math.ceil(feedbackItems.length / 2),
  );
  const secondRow = feedbackItems.slice(Math.ceil(feedbackItems.length / 2));

  return (
    <section
      id="feedback"
      className="relative overflow-hidden bg-[#fffaf4] px-4 py-16 text-slate-950 dark:bg-[#05070b] dark:text-white sm:px-6 sm:py-18 lg:px-8 lg:py-20 xl:py-22"
    >
      <div className="pointer-events-none absolute -left-32 top-16 h-[320px] w-[320px] rounded-full bg-orange-300/14 blur-[96px] dark:bg-blue-600/12 sm:h-[380px] sm:w-[380px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-[320px] w-[320px] rounded-full bg-amber-300/12 blur-[96px] dark:bg-blue-500/10 sm:h-[380px] sm:w-[380px]" />

      <div
        className={[
          "relative mx-auto max-w-[1560px] origin-top transform-gpu transition-transform duration-300",
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
          className="flex w-full flex-col items-start text-left"
        >
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-3 rounded-full border border-orange-100 bg-white/78 px-4 py-2.5 text-[14px] font-black uppercase tracking-[0.13em] text-orange-600 shadow-sm backdrop-blur-[18px] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300 sm:px-5 sm:py-3 sm:text-[15px]">
              <Star className="h-5 w-5 fill-current" />
              Phản hồi từ người dùng
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-5 max-w-[1100px] text-left text-[clamp(34px,4.6vw,58px)] font-black leading-[1.04] tracking-[-0.055em] text-slate-950 dark:text-white 2xl:text-[clamp(40px,5vw,66px)]"
          >
            Người dùng hiểu lỗi hơn trước khi quyết định gọi thợ
          </motion.h2>
        </motion.div>

        {shouldReduceMotion ? (
          <div className="mt-10 grid justify-items-center gap-5 md:grid-cols-2 xl:grid-cols-3">
            {feedbackItems.slice(0, 6).map((item, index) => (
              <FeedbackCard
                key={item.id}
                item={item}
                index={index}
                shouldFloat={false}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-1 sm:mt-11">
            <FeedbackMarqueeRow items={firstRow} duration={44} />
            <FeedbackMarqueeRow items={secondRow} reverse duration={50} />
          </div>
        )}
      </div>
    </section>
  );
}