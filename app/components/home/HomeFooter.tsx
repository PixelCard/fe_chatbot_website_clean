import Link from "next/link";
import { Zap } from "lucide-react";

import { APP_ROUTES } from "@/app/config/routes";

import { footerContacts } from "./data";

export function HomeFooter() {
  return (
    <footer className="border-t border-orange-100 bg-[#fffaf4] px-4 py-16 text-slate-950 dark:border-slate-800 dark:bg-[#05070b] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-4">
            <span className="flex h-13 w-13 h-[52px] w-[52px] items-center justify-center rounded-[20px] bg-orange-500 text-white shadow-[0_16px_36px_rgba(255,122,0,0.24)] dark:bg-blue-700 dark:shadow-[0_16px_36px_rgba(37,99,235,0.24)]">
              <Zap className="h-6 w-6" />
            </span>

            <span className="text-[28px] font-black tracking-[-0.05em]">
              SmartElec
            </span>
          </Link>

          <p className="mt-6 max-w-md text-[17px] font-semibold leading-8 text-slate-600 dark:text-slate-300">
            Nền tảng AI chat hỗ trợ tư vấn lỗi thiết bị, gom thông tin sửa chữa
            và kết nối kỹ thuật viên phù hợp khi cần.
          </p>
        </div>

        <div>
          <h3 className="text-[16px] font-black uppercase tracking-[0.13em] text-slate-950 dark:text-white">
            Liên kết nhanh
          </h3>

          <div className="mt-6 grid gap-4 text-[16px] font-bold text-slate-600 dark:text-slate-300">
            <Link
              href={APP_ROUTES.CLIENT.CHAT_BOT}
              className="transition hover:text-orange-600 dark:hover:text-blue-300"
            >
              AI Chat
            </Link>

            <Link
              href={APP_ROUTES.CLIENT.ORDER_HISTORY}
              className="transition hover:text-orange-600 dark:hover:text-blue-300"
            >
              Lịch sử đơn hàng
            </Link>

            <Link
              href={APP_ROUTES.Auth.LOGIN}
              className="transition hover:text-orange-600 dark:hover:text-blue-300"
            >
              Đăng nhập
            </Link>

            <Link
              href={APP_ROUTES.Auth.REGISTER}
              className="transition hover:text-orange-600 dark:hover:text-blue-300"
            >
              Đăng ký
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-[16px] font-black uppercase tracking-[0.13em] text-slate-950 dark:text-white">
            Liên hệ
          </h3>

          <div className="mt-6 grid gap-4 text-[16px] font-bold text-slate-600 dark:text-slate-300">
            {footerContacts.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-center gap-4">
                  <Icon className="h-5 w-5 shrink-0 text-orange-500 dark:text-blue-300" />
                  <span className="leading-7">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-orange-100 pt-8 text-center text-[14px] font-bold leading-7 text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © 2026 SmartElec. Nền tảng AI tư vấn và hỗ trợ sửa chữa thiết bị.
      </div>
    </footer>
  );
}
