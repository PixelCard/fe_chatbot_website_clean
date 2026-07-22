import { SearchX } from "lucide-react";

export default function AccountEmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#1E2A3F] bg-[#101B2E] p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1E2A3F] bg-[#07111F] text-[#64748B]">
        <SearchX className="h-7 w-7" />
      </span>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white">
          Không tìm thấy tài khoản
        </h3>
        <p className="max-w-sm text-sm leading-6 text-[#9CA3AF]">
          Không có tài khoản nào khớp với bộ lọc hiện tại. Thử thay đổi từ khóa hoặc xóa bộ lọc.
        </p>
      </div>
    </div>
  );
}
