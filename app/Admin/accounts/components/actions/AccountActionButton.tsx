import {
  ActionButton,
  type CommonActionTone,
} from "@/app/components/common/action-button/ActionButton";
import type { ComponentType } from "react";

type Props = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  tone?: CommonActionTone;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

export default function AccountActionButton({
  icon,
  label,
  tone = "neutral",
  disabled = false,
  loading = false,
  onClick,
}: Props) {
  return (
    <ActionButton
      icon={icon}
      label={label}
      tone={tone}
      fullWidth
      size="lg"
      disabled={disabled}
      loading={loading}
      loadingLabel="Dang xu ly..."
      onClick={onClick}
    />
  );
}
