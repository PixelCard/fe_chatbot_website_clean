import {
  ActionButton,
  type CommonActionTone,
} from "@/app/components/common/action-button/ActionButton";
import type { ComponentType } from "react";

export type AccountActionTone = CommonActionTone;

type Props = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  tone?: AccountActionTone;
  target?: "_blank" | "_self";
  disabled?: boolean;
};

export default function AccountActionLink({
  href,
  icon,
  label,
  tone = "neutral",
  target = "_self",
  disabled = false,
}: Props) {
  return (
    <ActionButton
      href={href}
      target={target}
      icon={icon}
      label={label}
      tone={tone}
      fullWidth
      size="lg"
      disabled={disabled}
    />
  );
}
