"use client";

import { useMemo, useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import TechnicianKpiGrid from "./components/card/TechnicianKpiGrid";
import TechnicianFilters from "./components/filter/TechnicianFilters";
import TechnicianHeader from "./components/TechnicianHeader";
import TechnicianPagination from "./components/pagination/TechnicianPagination";
import TechnicianTable from "./components/table/TechnicianTable";
import { useTechnicians } from "./hooks";
import type {
  ActiveFilter,
  StatusFilter,
  Technician,
  VerificationFilter,
} from "./types/technician.types";
import { getTechnicianDisplayStatus } from "./utils/technicianStatusMeta";

export default function TechniciansPage() {
  const {
    items,
    isLoading,
    isMutating,
    error,
    refetch,
    verifyTechnician,
    lockTechnician,
    unlockTechnician,
  } = useTechnicians();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("ALL");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const summary = useMemo(
    () => ({
      total: items.length,
      online: items.filter((item) => item.isOnline).length,
      activeJobs: items.reduce((sum, item) => sum + item.activeJobCount, 0),
      unverified: items.filter((item) => !item.isVerified).length,
    }),
    [items],
  );

  const filteredTechnicians = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return items.filter((technician) => {
      const displayStatus = getTechnicianDisplayStatus(technician);

      const matchesSearch =
        !keyword ||
        technician.fullName.toLowerCase().includes(keyword) ||
        technician.phoneNumber.toLowerCase().includes(keyword) ||
        technician.email.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || displayStatus === statusFilter;

      const matchesVerification =
        verificationFilter === "ALL" ||
        (verificationFilter === "VERIFIED" && technician.isVerified) ||
        (verificationFilter === "UNVERIFIED" && !technician.isVerified);

      const matchesActive =
        activeFilter === "ALL" ||
        (activeFilter === "ACTIVE" && technician.isActive) ||
        (activeFilter === "LOCKED" && !technician.isActive);

      return (
        matchesSearch && matchesStatus && matchesVerification && matchesActive
      );
    });
  }, [activeFilter, items, searchTerm, statusFilter, verificationFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTechnicians.length / pageSize),
  );

  const currentRows = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;

    return filteredTechnicians.slice(start, start + pageSize);
  }, [filteredTechnicians, page, pageSize, totalPages]);

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    setExpandedId(null);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
    setExpandedId(null);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId((currentId) => (currentId === id ? null : id));
  };

  const handleVerifyTechnician = async (technician: Technician) => {
    const confirmed = window.confirm(
      `Xác minh tài khoản thợ ${technician.fullName || technician.phoneNumber}?`,
    );
    if (!confirmed) return;

    await verifyTechnician(technician.id, {
      reason: "Admin xác minh thợ từ trang quản lý thợ.",
    });
  };

  const handleToggleTechnicianActive = async (technician: Technician) => {
    const actionLabel = technician.isActive ? "khóa" : "mở khóa";
    const confirmed = window.confirm(
      `Bạn có chắc muốn ${actionLabel} tài khoản thợ ${
        technician.fullName || technician.phoneNumber
      }?`,
    );
    if (!confirmed) return;

    const payload = {
      reason: `Admin ${actionLabel} thợ từ trang quản lý thợ.`,
    };

    if (technician.isActive) {
      await lockTechnician(technician.id, payload);
      return;
    }

    await unlockTechnician(technician.id, payload);
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <TechnicianHeader />

        {error ? (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
            <p className="text-sm font-medium text-red-200">
              Không tải được danh sách thợ.
            </p>
            <p className="mt-1 text-sm text-red-100/90">{error.message}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex h-10 items-center rounded-lg border border-red-300/40 px-4 text-sm font-medium text-red-100 transition-all duration-150 ease-out hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
            >
              Thử lại
            </button>
          </section>
        ) : null}

        {!error && isLoading ? (
          <section className="admin-card rounded-2xl p-4 sm:p-6">
            <p className="text-sm text-[var(--admin-muted-text)]">
              Đang tải dữ liệu thợ...
            </p>
          </section>
        ) : null}

        {!error && !isLoading ? (
          <>
            <TechnicianKpiGrid summary={summary} />

            <TechnicianFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              verificationFilter={verificationFilter}
              activeFilter={activeFilter}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setPage(1);
                setExpandedId(null);
              }}
              onStatusChange={(value) => {
                setStatusFilter(value);
                setPage(1);
                setExpandedId(null);
              }}
              onVerificationChange={(value) => {
                setVerificationFilter(value);
                setPage(1);
                setExpandedId(null);
              }}
              onActiveChange={(value) => {
                setActiveFilter(value);
                setPage(1);
                setExpandedId(null);
              }}
            />

            <TechnicianTable
              rows={currentRows}
              expandedId={expandedId}
              actionLoading={isMutating}
              onToggleExpand={handleToggleExpand}
              onVerifyTechnician={handleVerifyTechnician}
              onToggleTechnicianActive={handleToggleTechnicianActive}
            />

            <TechnicianPagination
              page={page}
              pageSize={pageSize}
              totalItems={filteredTechnicians.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}
