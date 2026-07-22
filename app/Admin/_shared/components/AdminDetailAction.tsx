"use client";

import Link from "next/link";
import { createElement, isValidElement } from "react";
import type { ComponentType, MouseEventHandler, ReactNode } from "react";

import { getAdminDetailActionClass } from "../styles/detailAction";

type DetailActionSize = "sm" | "md" | "lg";

type BaseProps = {
  label?: string;
  icon?: ComponentType<{ className?: string }> | ReactNode;
  trailing?: ReactNode;
  active?: boolean;
  fullWidth?: boolean;
  size?: DetailActionSize;
  className?: string;
};

type LinkProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

type Props = LinkProps | ButtonProps;

export function AdminDetailAction({
  label = "Chi tiết",
  icon,
  trailing,
  active = false,
  fullWidth = false,
  size = "sm",
  className = "",
  ...rest
}: Props) {
  const classes = [
    getAdminDetailActionClass({ active, fullWidth, size }),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {renderIcon(icon)}
      <span>{label}</span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={rest.type ?? "button"}
      onClick={rest.onClick}
      className={classes}
    >
      {content}
    </button>
  );
}

function renderIcon(
  icon?: ComponentType<{ className?: string }> | ReactNode,
) {
  if (!icon) return null;
  if (isValidElement(icon)) {
    return icon;
  }

  return createElement(icon as ComponentType<{ className?: string }>, {
    className: "h-4 w-4 shrink-0",
  });
}
