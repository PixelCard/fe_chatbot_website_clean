export default function DeviceHeader() {
  return (
    <section className="admin-card rounded-2xl px-5 py-5 sm:px-6 lg:px-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--admin-muted-text)]">
            <span className="text-[var(--admin-accent)]">▰</span>
            <span>Vận hành</span>
            <span>/</span>
            <span className="text-[var(--admin-strong-text)]">Thiết bị</span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--admin-strong-text)] sm:text-3xl">
            Thiết bị
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--admin-muted-text)] sm:text-[15px]">
            Theo dõi danh mục thiết bị, trạng thái bảo hành, lịch bảo trì và
            lịch sử sửa chữa của khách hàng.
          </p>
        </div>

      </div>
    </section>
  );
}
