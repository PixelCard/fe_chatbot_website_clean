import { PackageSearch } from "lucide-react";

export default function EmptyDeviceState() {
  return (
    <section className="admin-card flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-dashed p-8 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[#FF7A00]/25 bg-[#FF7A00]/10 text-[#FF7A00]">
        <PackageSearch className="h-7 w-7" />
      </span>

      <h3 className="mt-4 text-lg font-bold text-[var(--admin-strong-text)]">
        Không tìm thấy thiết bị
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--admin-muted-text)]">
        Không có thiết bị nào khớp với bộ lọc hiện tại.
      </p>
    </section>
  );
}