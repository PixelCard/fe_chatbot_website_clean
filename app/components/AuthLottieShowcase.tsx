'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type AuthLottieShowcaseProps = {
  title: string;
  subtitle: string;
  badge?: string;
  className?: string;
  compact?: boolean;
};

const AUTH_LOTTIE_SRC = 'https://lottie.host/63e43fb7-61be-486f-aef2-622b144f7fc1/2m8UGcP8KR.json';

export function AuthLottieShowcase({
  title,
  subtitle,
  badge = 'SMART AUTH EXPERIENCE',
  className = '',
  compact = false,
}: AuthLottieShowcaseProps) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] text-white shadow-[0_24px_80px_rgba(4,12,24,0.26)] backdrop-blur-xl',
        compact ? 'p-5' : 'p-6 md:p-8',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,178,0,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.24),transparent_34%),linear-gradient(135deg,#091325_0%,#0f2741_48%,#0ea5e9_100%)]" />
      <div className="absolute -left-12 top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-10 bottom-6 h-32 w-32 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black tracking-[0.26em] text-white/80">
          {badge}
        </span>

        <div className={compact ? 'mt-4 h-44 w-full' : 'mt-5 h-56 w-full md:h-72'}>
          <DotLottieReact
            src={AUTH_LOTTIE_SRC}
            loop
            autoplay
            renderConfig={{ autoResize: true }}
          />
        </div>

        <div className="mt-4 space-y-2">
          <h2 className={compact ? 'text-xl font-black tracking-tight' : 'text-2xl font-black tracking-tight md:text-3xl'}>
            {title}
          </h2>
          <p className="max-w-md text-sm leading-6 text-white/74">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
