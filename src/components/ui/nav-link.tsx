"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  activeIndicator?: boolean;
}

export function NavLink({ href, children, activeIndicator = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`transition-colors font-medium flex items-center gap-1.5 ${
        isActive
          ? "text-[#252724] font-semibold"
          : "text-neutral-600 hover:text-[#252724]"
      }`}
    >
      {activeIndicator && isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#5a8357] animate-pulse" />
      )}
      {children}
    </Link>
  );
}
