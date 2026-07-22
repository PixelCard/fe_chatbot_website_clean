export default function DeviceInfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--admin-muted-text)]">
        {label}
      </p>

      <p
        title={value}
        className="mt-2 break-words text-base font-bold leading-7 text-[var(--admin-strong-text)]"
      >
        {value}
      </p>
    </div>
  );
}