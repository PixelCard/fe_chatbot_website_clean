import Image from "next/image";
import logoImage from "../../../../logo.png";

type LogoHeaderProps = {
  align?: "left" | "center";
  subtitle?: string;
};

export default function LogoHeader({ align = "center", subtitle = "AI Diagnostic System" }: LogoHeaderProps) {
  const isLeft = align === "left";

  return (
    <header className={`space-y-4 ${isLeft ? "text-left" : "text-center"}`}>
      <div className={`${isLeft ? "" : "mx-auto"} flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border border-[#1E2A3F] bg-[#101B2E] p-2 shadow-[0_0_32px_rgba(6,182,212,0.35)]`}>
        <Image src={logoImage} alt="SMARTELEC logo" className="h-full w-full object-contain" priority />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-[0.24em] text-white">SMARTELEC</h1>
        <p
          className={`${isLeft ? "" : "mx-auto"} inline-flex rounded-full border border-[#22C55E]/70 bg-[#07111F] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#22C55E]`}
        >
          {subtitle}
        </p>
      </div>
    </header>
  );
}
