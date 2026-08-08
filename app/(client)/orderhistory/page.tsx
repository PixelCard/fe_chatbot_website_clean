"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Wrench,
  CheckCircle2,
  XCircle,
  MapPin,
  ChevronRight,
  FileText,
  Loader2,
  ClipboardList,
  Radio,
  PackageCheck,
  Plus,
} from "lucide-react";

import type { ApiError } from "@/app/services/apiClient";
import {
  chatsService,
  type ChatSessionItem,
  type JobStatus,
} from "@/app/services/common";
import { APP_ROUTES } from "@/app/config/routes";

type OrderHistoryTab =
  | "ALL"
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

type OrderHistoryItem = {
  id: number;
  code: string;
  device: string;
  symptom: string;
  status: JobStatus;
  date: string;
  techName: string | null;
  address: string;
  canChat: boolean;
};

const ORDER_HISTORY_STATUSES: JobStatus[] = [
  "BROADCASTING",
  "MATCHED",
  "EN_ROUTE",
  "ARRIVED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const filterTabs: Array<{ id: OrderHistoryTab; label: string }> = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING", label: "Đang tìm thợ" },
  { id: "ACTIVE", label: "Đang xử lý" },
  { id: "COMPLETED", label: "Hoàn thành" },
  { id: "CANCELLED", label: "Đã hủy" },
];

function formatSessionDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function mapSessionToOrder(session: ChatSessionItem): OrderHistoryItem {
  return {
    id: session.id,
    code: `ORD-${String(session.id).padStart(4, "0")}`,
    device: session.deviceType?.trim() || "Chưa cập nhật thiết bị",
    symptom:
      session.symptom?.trim() ||
      session.aiSummary?.trim() ||
      "Chưa cập nhật mô tả lỗi",
    status: session.status,
    date: formatSessionDate(session.updatedAt || session.createdAt),
    techName: session.technician?.fullName?.trim() || null,
    address: session.address?.trim() || "Chưa cập nhật địa chỉ",
    canChat: ["MATCHED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(
      session.status,
    ),
  };
}

function getStatusInfo(status: JobStatus) {
  switch (status) {
    case "BROADCASTING":
      return {
        label: "Đang tìm thợ",
        bg: "bg-amber-100 dark:bg-amber-400/15",
        text: "text-amber-700 dark:text-amber-300",
        iconBg: "bg-amber-500",
        Icon: Radio,
      };

    case "MATCHED":
    case "EN_ROUTE":
    case "ARRIVED":
    case "IN_PROGRESS":
      return {
        label: "Đang xử lý",
        bg: "bg-[var(--client-primary-soft)]",
        text: "text-[var(--client-primary)]",
        iconBg: "bg-[var(--client-primary)]",
        Icon: Wrench,
      };

    case "COMPLETED":
    case "DONE":
      return {
        label: "Hoàn thành",
        bg: "bg-emerald-100 dark:bg-emerald-400/15",
        text: "text-emerald-700 dark:text-emerald-300",
        iconBg: "bg-emerald-500",
        Icon: CheckCircle2,
      };

    case "CANCELLED":
      return {
        label: "Đã hủy",
        bg: "bg-red-100 dark:bg-red-400/15",
        text: "text-red-700 dark:text-red-300",
        iconBg: "bg-red-500",
        Icon: XCircle,
      };

    default:
      return {
        label: "Không rõ",
        bg: "bg-gray-100 dark:bg-gray-500/15",
        text: "text-gray-700 dark:text-gray-300",
        iconBg: "bg-gray-500",
        Icon: FileText,
      };
  }
}

function matchesTab(status: JobStatus, activeTab: OrderHistoryTab) {
  if (activeTab === "ALL") {
    return true;
  }

  if (activeTab === "PENDING") {
    return status === "BROADCASTING";
  }

  if (activeTab === "ACTIVE") {
    return ["MATCHED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(status);
  }

  return status === activeTab;
}

function getTabCount(
  tab: OrderHistoryTab,
  stats: {
    total: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
  },
) {
  if (tab === "ALL") {
    return stats.total;
  }

  if (tab === "PENDING") {
    return stats.pending;
  }

  if (tab === "ACTIVE") {
    return stats.active;
  }

  if (tab === "COMPLETED") {
    return stats.completed;
  }

  return stats.cancelled;
}

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState<OrderHistoryTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const sessions = await chatsService.getSessions();

        if (!isMounted) {
          return;
        }

        const nextOrders = sessions
          .filter((session) => ORDER_HISTORY_STATUSES.includes(session.status))
          .map(mapSessionToOrder)
          .sort((left, right) => right.id - left.id);

        setOrders(nextOrders);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError as ApiError);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const keyword = searchQuery.trim().toLowerCase();
        const tabMatched = matchesTab(order.status, activeTab);

        const searchMatched =
          keyword.length === 0 ||
          order.code.toLowerCase().includes(keyword) ||
          order.device.toLowerCase().includes(keyword) ||
          order.symptom.toLowerCase().includes(keyword);

        return tabMatched && searchMatched;
      }),
    [activeTab, orders, searchQuery],
  );

  const historyStats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "BROADCASTING").length,
      active: orders.filter((order) =>
        ["MATCHED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(
          order.status,
        ),
      ).length,
      completed: orders.filter(
        (order) =>
          order.status === "COMPLETED" || order.status === "DONE",
      ).length,
      cancelled: orders.filter((order) => order.status === "CANCELLED").length,
    }),
    [orders],
  );

  const statCards = [
    {
      label: "Tổng đơn",
      value: historyStats.total,
      icon: ClipboardList,
      color: "bg-blue-500",
    },
    {
      label: "Đang tìm thợ",
      value: historyStats.pending,
      icon: Radio,
      color: "bg-amber-500",
    },
    {
      label: "Đang xử lý",
      value: historyStats.active,
      icon: Wrench,
      color: "bg-[var(--client-primary)]",
    },
    {
      label: "Hoàn thành",
      value: historyStats.completed,
      icon: PackageCheck,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="client-theme relative min-h-screen bg-[var(--client-page-bg)] font-sans text-[var(--client-text-primary)]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #fffaf3 55%, #fff5e9 100%)",
          }}
        />

        <div
          className="absolute inset-0 hidden dark:block"
          style={{ background: "#0a0a0f" }}
        />
      </div>

      <main className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-10">
        {/* HERO + SEARCH + STATS */}
        <section className="client-card relative overflow-hidden rounded-xl border border-[var(--client-muted-border)] p-4 shadow-sm sm:rounded-2xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="min-w-0 max-w-3xl">
              <h1 className="text-2xl font-extrabold tracking-tight text-[var(--client-text-primary)] sm:text-3xl lg:text-4xl">
                Lịch sử đơn hàng
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--client-text-primary)] sm:mt-3 sm:text-base sm:leading-7">
                Theo dõi trạng thái, kỹ thuật viên phụ trách và toàn bộ yêu cầu
                sửa chữa đã tạo trong hệ thống SmartElec.
              </p>
            </div>

            <div className="relative w-full lg:w-[390px] xl:w-[420px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search
                  className="h-5 w-5 text-[var(--client-text-primary)]"
                  strokeWidth={2.5}
                />
              </div>

              <input
                type="text"
                placeholder="Tìm theo mã đơn, thiết bị, lỗi..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-lg border-2 border-[var(--client-control-border)] bg-[var(--client-control-bg)] pl-11 pr-4 text-sm font-semibold text-[var(--client-text-primary)] outline-none transition-colors duration-200 placeholder:text-[var(--client-text-primary)] placeholder:opacity-50 focus:border-[var(--client-primary)] sm:h-12 sm:rounded-xl sm:text-base"
              />
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="group flex min-w-0 items-center gap-2.5 rounded-lg border border-[var(--client-muted-border)] bg-[var(--client-card-soft-bg)] p-3 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--client-primary-soft-border)] hover:shadow-md sm:gap-3 sm:rounded-xl sm:p-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.color} text-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-105 sm:h-12 sm:w-12 sm:rounded-xl`}
                  >
                    <Icon
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      strokeWidth={2.5}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="min-h-8 text-xs font-bold leading-4 text-[var(--client-text-primary)] sm:min-h-0 sm:text-sm sm:leading-5">
                      {stat.label}
                    </p>

                    <p className="mt-0.5 text-2xl font-extrabold leading-none tracking-tight text-[var(--client-text-primary)] sm:mt-1 sm:text-3xl">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FILTER TABS */}
        <section className="client-card mt-4 overflow-hidden rounded-xl border border-[var(--client-muted-border)] p-3 shadow-sm sm:mt-5 sm:rounded-2xl sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold tracking-tight text-[var(--client-text-primary)] sm:text-lg">
              Trạng thái đơn
            </h2>
          </div>

          <div className="-mx-1 mt-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">
              {filterTabs.map((tab) => {
                const count = getTabCount(tab.id, historyStats);
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      "flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-sm font-bold transition-all duration-200 ease-out sm:h-11 sm:gap-2 sm:px-5 sm:text-base",
                      isActive
                        ? "client-accent-gradient client-accent-shadow text-[var(--client-cta-text)]"
                        : "border-2 border-[var(--client-control-border)] bg-[var(--client-control-bg)] text-[var(--client-text-primary)] hover:border-[var(--client-primary-soft-border)] hover:bg-[var(--client-control-hover-bg)]",
                    ].join(" ")}
                  >
                    <span>{tab.label}</span>

                    <span
                      className={[
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-extrabold sm:h-6 sm:min-w-6 sm:px-2 sm:text-sm",
                        isActive
                          ? "bg-white/30 text-white"
                          : "bg-[var(--client-muted-bg)] text-[var(--client-text-primary)]",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ORDERS LIST */}
        {isLoading ? (
          <section className="client-card mt-4 flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-[var(--client-muted-border)] p-5 text-center shadow-sm sm:mt-5 sm:min-h-[280px] sm:rounded-2xl sm:p-8">
            <Loader2
              className="h-9 w-9 animate-spin text-[var(--client-primary)] sm:h-11 sm:w-11"
              strokeWidth={2.5}
            />

            <p className="mt-4 text-lg font-bold text-[var(--client-text-primary)] sm:text-xl">
              Đang tải lịch sử đơn hàng...
            </p>

            <p className="mt-1.5 max-w-md text-sm font-semibold leading-6 text-[var(--client-text-primary)] opacity-70 sm:mt-2 sm:text-base">
              Hệ thống đang lấy danh sách yêu cầu sửa chữa của bạn.
            </p>
          </section>
        ) : error ? (
          <section className="client-card mt-4 rounded-xl border-2 border-red-300 bg-red-50 p-4 dark:border-red-500/40 dark:bg-red-500/10 sm:mt-5 sm:rounded-2xl sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white shadow-md sm:h-14 sm:w-14 sm:rounded-xl">
                <XCircle
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  strokeWidth={2.5}
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-red-700 dark:text-red-300 sm:text-xl">
                  Không tải được lịch sử đơn
                </h2>

                <p className="mt-1 break-words text-sm font-semibold leading-6 text-red-600 dark:text-red-200/90 sm:text-base">
                  {error.message}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.Icon;

                return (
                  <article
                    key={order.id}
                    className="client-card group rounded-xl border border-[var(--client-muted-border)] bg-[var(--client-card-soft-bg)] p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--client-primary-soft-border)] hover:shadow-lg sm:rounded-2xl sm:p-5 lg:p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                      {/* LEFT */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md border-2 border-[var(--client-control-border)] bg-[var(--client-control-bg)] px-2.5 py-1 font-mono text-xs font-extrabold tracking-wider text-[var(--client-text-primary)] sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-sm">
                            {order.code}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-sm ${statusInfo.bg} ${statusInfo.text}`}
                          >
                            <StatusIcon
                              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                              strokeWidth={2.5}
                            />
                            {statusInfo.label}
                          </span>
                        </div>

                        <h3 className="mt-2.5 break-words text-xl font-extrabold tracking-tight text-[var(--client-text-primary)] sm:mt-3 sm:text-2xl lg:text-3xl">
                          {order.device}
                        </h3>

                        <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-[var(--client-text-primary)] opacity-90 sm:mt-2 sm:text-base sm:leading-7">
                          <span className="font-extrabold text-[var(--client-primary)]">
                            Lỗi:
                          </span>{" "}
                          {order.symptom}
                        </p>

                        <div className="mt-3 flex flex-col gap-2 text-xs font-bold text-[var(--client-text-primary)] sm:mt-4 sm:flex-row sm:flex-wrap sm:text-sm">
                          <div className="flex w-full items-center gap-2 rounded-lg border border-[var(--client-muted-border)] bg-[var(--client-control-bg)] px-3 py-2 sm:w-auto">
                            <Clock
                              className="h-4 w-4 shrink-0 text-[var(--client-primary)]"
                              strokeWidth={2.5}
                            />
                            <span>{order.date}</span>
                          </div>

                          <div className="flex min-w-0 items-start gap-2 rounded-lg border border-[var(--client-muted-border)] bg-[var(--client-control-bg)] px-3 py-2 sm:flex-1">
                            <MapPin
                              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--client-primary)]"
                              strokeWidth={2.5}
                            />

                            <span className="min-w-0 break-words">
                              {order.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex min-w-0 flex-col gap-3 border-t border-[var(--client-muted-border)] pt-4 lg:min-w-[280px] lg:border-none lg:pt-0">
                        {order.techName ? (
                          <div className="flex min-w-0 items-center gap-3 text-sm font-bold text-[var(--client-text-primary)] sm:text-base">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--client-primary)] text-white shadow-md sm:h-12 sm:w-12 sm:rounded-xl">
                              <Wrench
                                className="h-5 w-5"
                                strokeWidth={2.5}
                              />
                            </span>

                            <span className="min-w-0 break-words">
                              <span className="block text-[11px] font-bold uppercase tracking-wide text-[var(--client-text-primary)] opacity-60 sm:text-xs">
                                Kỹ thuật viên
                              </span>

                              {order.techName}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-[var(--client-muted-border)] bg-[var(--client-control-bg)] px-3 py-2.5 text-sm font-bold text-[var(--client-text-primary)] opacity-70">
                            <Clock
                              className="h-5 w-5 shrink-0 text-amber-500"
                              strokeWidth={2.5}
                            />
                            Chưa có thợ nhận đơn
                          </div>
                        )}

                        <div className="flex flex-col gap-2 min-[390px]:flex-row">
                          <button
                            type="button"
                            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-[var(--client-control-border)] bg-[var(--client-control-bg)] px-4 text-sm font-extrabold text-[var(--client-text-primary)] transition-all duration-200 ease-out hover:border-[var(--client-primary-soft-border)] hover:bg-[var(--client-control-hover-bg)] active:scale-[0.98] sm:rounded-xl sm:text-base lg:flex-none"
                          >
                            Chi tiết
                            <ChevronRight
                              className="h-4.5 w-4.5 sm:h-5 sm:w-5"
                              strokeWidth={2.5}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="client-card relative overflow-hidden rounded-xl border-2 border-dashed border-[var(--client-muted-border)] bg-[var(--client-card-soft-bg)] p-6 text-center shadow-sm sm:rounded-2xl sm:p-8 md:py-10">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--client-muted-bg)] sm:h-16 sm:w-16 sm:rounded-2xl">
                  <FileText
                    className="h-7 w-7 text-[var(--client-text-primary)] opacity-60 sm:h-8 sm:w-8"
                    strokeWidth={2}
                  />
                </div>

                <h3 className="relative mt-4 text-xl font-extrabold tracking-tight text-[var(--client-text-primary)] sm:text-2xl">
                  Không tìm thấy đơn hàng
                </h3>

                <p className="relative mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-[var(--client-text-primary)] opacity-70 sm:mt-3 sm:text-base sm:leading-7">
                  Bạn chưa có đơn phù hợp với bộ lọc hiện tại. Hãy thử đổi trạng
                  thái, tìm theo thiết bị khác hoặc tạo yêu cầu sửa chữa mới.
                </p>

                <div className="relative mt-5 flex flex-col justify-center gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
                  <Link
                    href={APP_ROUTES.CLIENT.CHAT_BOT}
                    className="client-accent-gradient client-accent-shadow inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-extrabold text-[var(--client-cta-text)] transition-all duration-200 ease-out hover:opacity-90 sm:rounded-xl sm:px-6 sm:text-base"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                    Tạo yêu cầu sửa chữa
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("ALL");
                    }}
                    className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-[var(--client-control-border)] bg-[var(--client-control-bg)] px-5 text-sm font-extrabold text-[var(--client-text-primary)] transition-all duration-200 ease-out hover:border-[var(--client-primary-soft-border)] hover:bg-[var(--client-control-hover-bg)] sm:rounded-xl sm:px-6 sm:text-base"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
