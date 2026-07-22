// app/components/home/HomeTrustStrip.tsx
import { CheckCircle2, Sparkles } from "lucide-react";

import { trustItems } from "./data";
import { SectionBadge } from "./ui/SectionBadge";

const benefitResults = [
  "Không bỏ sót thông tin lỗi",
  "Hiểu tình trạng trước khi gọi thợ",
  "Chỉ đặt lịch khi thật sự cần",
  "Theo dõi báo giá và tiến độ rõ hơn",
];

export function HomeTrustStrip() {
  return (
    <section
      id="trust"
      className="relative overflow-hidden border-y border-orange-100 bg-[#fffaf4] px-4 py-14 dark:border-slate-800 dark:bg-[#05070b] sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="pointer-events-none absolute -left-32 top-10 h-[320px] w-[320px] rounded-full bg-orange-300/14 blur-[96px] dark:bg-blue-600/10 sm:h-[380px] sm:w-[380px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[320px] w-[320px] rounded-full bg-amber-300/12 blur-[96px] dark:bg-blue-500/8 sm:h-[380px] sm:w-[380px]" />

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
        <div className="mb-8 grid gap-6 lg:mb-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <SectionBadge icon={Sparkles}>Lợi ích chính</SectionBadge>

            <h2 className="mt-5 max-w-4xl text-[clamp(32px,4vw,52px)] font-black leading-[1.06] tracking-[-0.055em] text-slate-950 drop-shadow-[0_12px_28px_rgba(15,23,42,0.07)] dark:text-white dark:drop-shadow-[0_16px_38px_rgba(37,99,235,0.12)] 2xl:text-[clamp(34px,4.4vw,58px)]">
              Người dùng không cần tự đoán lỗi thiết bị
            </h2>
          </div>

          <div className="rounded-[26px] border border-orange-100 bg-white/82 p-5 shadow-[0_16px_46px_rgba(255,122,0,0.08)] backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/74 dark:shadow-[0_16px_46px_rgba(0,0,0,0.22)] sm:p-6">
            <p className="text-[16px] font-bold leading-8 text-slate-700 dark:text-slate-200 sm:text-[17px] sm:leading-8 2xl:text-[18px] 2xl:leading-9">
              SmartElec dùng AI để hỏi đúng thông tin, gom triệu chứng và chỉ
              chuyển sang gọi thợ khi thật sự cần. Nhờ vậy người dùng hiểu lỗi
              rõ hơn trước khi đặt lịch sửa chữa.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            const result = benefitResults[index] ?? "Quy trình rõ ràng hơn";

            return (
              <article
                key={item.title}
                className="group relative min-h-[230px] overflow-hidden rounded-[26px] border border-orange-100 bg-white/88 p-5 shadow-[0_16px_46px_rgba(255,122,0,0.08)] backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-[0_22px_60px_rgba(255,122,0,0.12)] dark:border-slate-700 dark:bg-slate-900/78 dark:shadow-[0_16px_46px_rgba(0,0,0,0.24)] dark:hover:border-blue-500/40 dark:hover:shadow-[0_22px_60px_rgba(37,99,235,0.12)] sm:min-h-[250px] sm:p-6 xl:min-h-[270px] 2xl:min-h-[290px]"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-orange-300/14 blur-[50px] transition group-hover:bg-orange-400/20 dark:bg-blue-500/12 dark:group-hover:bg-blue-500/20" />
                <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/65 to-transparent dark:via-blue-400/50" />
                <div className="pointer-events-none absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-300/45 to-transparent dark:via-blue-400/35" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[20px] bg-orange-500/10 text-orange-600 ring-1 ring-orange-100 transition duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_14px_30px_rgba(255,122,0,0.20)] dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20 dark:group-hover:bg-blue-700 sm:h-[56px] sm:w-[56px] 2xl:h-[60px] 2xl:w-[60px]">
                    <Icon className="h-6 w-6 2xl:h-7 2xl:w-7" />
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[14px] font-black text-white shadow-[0_12px_26px_rgba(255,122,0,0.22)] dark:bg-blue-700 dark:shadow-[0_12px_26px_rgba(37,99,235,0.22)]">
                    {index + 1}
                  </div>
                </div>

                <h3 className="relative mt-5 text-[20px] font-black leading-7 tracking-[-0.03em] text-slate-950 dark:text-white sm:text-[21px] 2xl:text-[22px]">
                  {item.title}
                </h3>

                <p className="relative mt-3 text-[15px] font-semibold leading-7 text-slate-700 dark:text-slate-300 sm:text-[16px] sm:leading-8">
                  {item.desc}
                </p>

                <div className="relative mt-5 rounded-[20px] border border-orange-100 bg-orange-50/80 p-4 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 2xl:mt-6 2xl:rounded-[22px]">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600 dark:text-blue-300" />

                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.13em] text-orange-600 dark:text-blue-300">
                        Kết quả
                      </p>

                      <p className="mt-1.5 text-[15px] font-black leading-7 text-slate-800 dark:text-slate-100">
                        {result}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}