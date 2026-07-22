// "use client";

// import { ChevronLeft, ChevronRight } from "lucide-react";

// type AdminPaginationProps = {
//   page: number;
//   pageSize: number;
//   totalItems: number;
//   pageSizeOptions?: number[];
//   onPageChange: (page: number) => void;
//   onPageSizeChange?: (pageSize: number) => void;
// };

// const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];

// export default function AdminPagination({
//   page,
//   pageSize,
//   totalItems,
//   pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
//   onPageChange,
//   onPageSizeChange,
// }: AdminPaginationProps) {
//   const safeTotalItems = Number.isFinite(totalItems) ? totalItems : 0;
//   const safePageSize =
//     Number.isFinite(pageSize) && pageSize > 0
//       ? pageSize
//       : DEFAULT_PAGE_SIZE_OPTIONS[0];

//   const totalPages = Math.max(1, Math.ceil(safeTotalItems / safePageSize));
//   const currentPage = clamp(
//     Number.isFinite(page) && page > 0 ? page : 1,
//     1,
//     totalPages,
//   );

//   const startItem =
//     safeTotalItems === 0 ? 0 : (currentPage - 1) * safePageSize + 1;

//   const endItem =
//     safeTotalItems === 0
//       ? 0
//       : Math.min(currentPage * safePageSize, safeTotalItems);

//   const canGoPrev = currentPage > 1;
//   const canGoNext = currentPage < totalPages;

//   const visiblePages = getVisiblePages(currentPage, totalPages);

//   return (
//     <section className="rounded-3xl border border-[#26364F] bg-[#101B2E] p-4 shadow-[0_18px_60px_-55px_rgba(6,182,212,0.45)]">
//       <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//         <div className="min-w-0">
//           <p className="text-sm font-semibold text-white">
//             Hiển thị{" "}
//             <span className="text-[#22D3EE]">
//               {startItem}–{endItem}
//             </span>{" "}
//             / <span className="text-[#CBD5E1]">{safeTotalItems}</span> bản ghi
//           </p>

//           <p className="mt-1 text-xs font-medium text-[#94A3B8]">
//             Trang{" "}
//             <span className="font-semibold text-[#CBD5E1]">{currentPage}</span>{" "}
//             trong tổng{" "}
//             <span className="font-semibold text-[#CBD5E1]">{totalPages}</span>{" "}
//             trang
//           </p>
//         </div>

//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
//           {onPageSizeChange ? (
//             <label className="flex h-11 items-center justify-between gap-3 rounded-2xl border border-[#26364F] bg-[#07111F] px-3 sm:min-w-[170px]">
//               <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] text-[#94A3B8]">
//                 Dòng/trang
//               </span>

//               <select
//                 value={safePageSize}
//                 onChange={(event) => {
//                   onPageSizeChange(Number(event.target.value));
//                 }}
//                 className="h-8 rounded-xl border border-[#26364F] bg-[#101B2E] px-2 text-sm font-bold text-white outline-none transition hover:border-[#06B6D4]/50 focus:border-[#06B6D4]/70 focus:ring-2 focus:ring-[#06B6D4]/25"
//               >
//                 {pageSizeOptions.map((size) => (
//                   <option key={size} value={size}>
//                     {size}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           ) : null}

//           <nav
//             aria-label="Phân trang"
//             className="flex min-w-0 items-center gap-2"
//           >
//             <button
//               type="button"
//               onClick={() => onPageChange(currentPage - 1)}
//               disabled={!canGoPrev}
//               className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#26364F] bg-[#07111F] px-3 text-sm font-bold text-[#CBD5E1] transition hover:border-[#06B6D4]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               <ChevronLeft className="h-4 w-4" />
//               <span className="hidden sm:inline">Trước</span>
//             </button>

//             <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
//               {visiblePages.map((item, index) => {
//                 if (item === "dots") {
//                   return (
//                     <span
//                       key={`dots-${index}`}
//                       className="inline-flex h-11 min-w-9 items-center justify-center text-sm font-bold text-[#64748B]"
//                     >
//                       ...
//                     </span>
//                   );
//                 }

//                 const isActive = item === currentPage;

//                 return (
//                   <button
//                     key={item}
//                     type="button"
//                     onClick={() => onPageChange(item)}
//                     aria-current={isActive ? "page" : undefined}
//                     className={[
//                       "inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40",
//                       isActive
//                         ? "border-[#06B6D4] bg-[#063044] text-[#22D3EE] shadow-[0_0_0_1px_rgba(34,211,238,0.25)]"
//                         : "border-[#26364F] bg-[#07111F] text-[#CBD5E1] hover:border-[#06B6D4]/50 hover:text-white",
//                     ].join(" ")}
//                   >
//                     {item}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               type="button"
//               onClick={() => onPageChange(currentPage + 1)}
//               disabled={!canGoNext}
//               className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#26364F] bg-[#07111F] px-3 text-sm font-bold text-[#CBD5E1] transition hover:border-[#06B6D4]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]/40 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               <span className="hidden sm:inline">Sau</span>
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </nav>
//         </div>
//       </div>
//     </section>
//   );
// }

// function getVisiblePages(
//   currentPage: number,
//   totalPages: number,
// ): Array<number | "dots"> {
//   if (totalPages <= 7) {
//     return Array.from({ length: totalPages }, (_, index) => index + 1);
//   }

//   if (currentPage <= 4) {
//     return [1, 2, 3, 4, 5, "dots", totalPages];
//   }

//   if (currentPage >= totalPages - 3) {
//     return [
//       1,
//       "dots",
//       totalPages - 4,
//       totalPages - 3,
//       totalPages - 2,
//       totalPages - 1,
//       totalPages,
//     ];
//   }

//   return [
//     1,
//     "dots",
//     currentPage - 1,
//     currentPage,
//     currentPage + 1,
//     "dots",
//     totalPages,
//   ];
// }

// function clamp(value: number, min: number, max: number) {
//   return Math.min(Math.max(value, min), max);
// }