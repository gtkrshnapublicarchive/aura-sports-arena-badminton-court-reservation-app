import React from "react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "sage" | "neutral" | "warning" | "danger" | "info";
}

export function Badge({
  className,
  variant = "sage",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    sage: "bg-[#eef2ec] text-[#5a8357] border-[#dbe6d9]",
    neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
