export default function AiConsultingLoadingCard() {
  return (
    <section className="admin-card rounded-2xl p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)]"
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)]"
            />
          ))}
        </div>

        <div className="h-[520px] animate-pulse rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)]" />
      </div>
    </section>
  );
}