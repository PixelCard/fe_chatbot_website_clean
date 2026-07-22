export function DispatchReasonFields({
  reason,
  note,
  reasons,
  onReasonChange,
  onNoteChange,
}: {
  reason: string;
  note: string;
  reasons: readonly string[];
  onReasonChange: (value: string) => void;
  onNoteChange: (value: string) => void;
}) {
  return (
    <>
      <label className="block">
        <span className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
          Lý do
        </span>
        <select
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] px-3 text-sm font-semibold text-[var(--admin-strong-text)] outline-none transition hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#26364F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
        >
          {reasons.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-[var(--admin-strong-text)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white">
          Ghi chú nội bộ
        </span>
        <textarea
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Nhập thêm ghi chú nếu cần..."
          className="mt-2 min-h-24 w-full resize-y rounded-xl border border-[var(--admin-soft-panel-border)] bg-[var(--admin-control-bg)] p-3 text-sm font-medium text-[var(--admin-strong-text)] outline-none transition placeholder:text-[var(--admin-muted-text)] hover:border-[var(--admin-control-hover-border)] focus:border-[var(--admin-control-hover-border)] focus:ring-2 focus:ring-[var(--admin-focus-ring)] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:border-[#26364F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:bg-[#07111F] [.admin-ripple-theme-shell[data-admin-theme=dark]_&]:text-white"
        />
      </label>
    </>
  );
}
