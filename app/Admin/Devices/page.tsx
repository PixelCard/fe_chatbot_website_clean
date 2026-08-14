"use client";

import { useState } from "react";

import AdminShell from "../dashboard/components/Action/AdminShell";
import DeviceFilters from "./components/DeviceFilters";
import DeviceHeader from "./components/DeviceHeader";
import DeviceKpiGrid from "./components/DeviceKpiGrid";
import DeviceTable from "./components/DeviceTable";
import { useAdminDevices } from "./hooks/useAdminDevices";
import type {
  MaintenanceFilter,
  WarrantyFilter,
} from "./types/device.types";
import AdminToastStack, {
  type AdminToast,
} from "@/app/components/admin/AdminToastStack";

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [warrantyFilter, setWarrantyFilter] = useState<WarrantyFilter>("ALL");
  const [maintenanceFilter, setMaintenanceFilter] =
    useState<MaintenanceFilter>("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const pushToast = (type: AdminToast["type"], text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const { summary, categories, filteredItems, isLoading, error } =
    useAdminDevices({
      searchTerm,
      categoryFilter,
      warrantyFilter,
      maintenanceFilter,
    });

  const handleToggleExpand = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        <DeviceHeader />

        <DeviceKpiGrid summary={summary} />

        <DeviceFilters
          searchTerm={searchTerm}
          categories={categories}
          categoryFilter={categoryFilter}
          warrantyFilter={warrantyFilter}
          maintenanceFilter={maintenanceFilter}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setExpandedId(null);
          }}
          onCategoryChange={(value) => {
            setCategoryFilter(value);
            setExpandedId(null);
          }}
          onWarrantyChange={(value) => {
            setWarrantyFilter(value);
            setExpandedId(null);
          }}
          onMaintenanceChange={(value) => {
            setMaintenanceFilter(value);
            setExpandedId(null);
          }}
        />

        {error ? (
          <section className="rounded-2xl border border-[var(--admin-error)]/30 bg-red-500/10 p-4 sm:p-6">
            <p className="text-sm font-semibold text-[var(--admin-error)]">
              Không tải được danh sách thiết bị.
            </p>

            <p className="mt-1 text-sm text-[var(--admin-muted-text)]">
              {error.message}
            </p>
          </section>
        ) : null}

        {!error && isLoading ? (
          <section className="admin-card rounded-2xl p-4 sm:p-6">
            <p className="text-sm text-[var(--admin-muted-text)]">
              Đang tải dữ liệu thiết bị...
            </p>
          </section>
        ) : null}

        {!error && !isLoading ? (
          <DeviceTable
            rows={filteredItems}
            expandedId={expandedId}
            onToggleExpand={handleToggleExpand}
          />
        ) : null}
      </div>

      <AdminToastStack
        toasts={toasts}
        onRemove={(id) =>
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </AdminShell>
  );
}