import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function AccountActionGroup({
  title,
  description,
  children,
}: Props) {
  return (
    <section className="rounded-2xl border border-[#1E2A3F] bg-[#0D1728] p-3 sm:p-4">
      <div className="mb-3">
        <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-[#7C8AA5]">
          {title}
        </h4>

        {description ? (
          <p className="mt-1 text-sm leading-5 text-[#64748B]">
            {description}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {children}
      </div>
    </section>
  );
}