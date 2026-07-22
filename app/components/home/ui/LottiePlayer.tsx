"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useReducedMotion } from "framer-motion";

import { cn } from "./GlassCard";

type LottiePlayerProps = {
    src: string;
    className?: string;
    ariaLabel?: string;
};

export function LottiePlayer({
    src,
    className,
    ariaLabel = "SmartElec animation",
}: LottiePlayerProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div
            className={cn(
                "relative flex items-center justify-center overflow-hidden",
                className,
            )}
            aria-label={ariaLabel}
            role="img"
        >
            <DotLottieReact
                src={src}
                loop={!shouldReduceMotion}
                autoplay={!shouldReduceMotion}
                className="h-full w-full"
            />
        </div>
    );
}