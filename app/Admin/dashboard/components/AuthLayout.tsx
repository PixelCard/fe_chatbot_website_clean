import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  contentClassName?: string;
};

export default function AuthLayout({ children, contentClassName = "" }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(6,182,212,0.24),transparent_38%),radial-gradient(circle_at_72%_85%,rgba(34,197,94,0.16),transparent_35%)]"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          className={`w-full rounded-[28px] border border-[#1E2A3F] bg-[#0D1728]/95 p-4 shadow-[0_24px_54px_-30px_rgba(6,182,212,0.65)] backdrop-blur-sm sm:p-6 ${contentClassName}`}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
