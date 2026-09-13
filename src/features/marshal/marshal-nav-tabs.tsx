"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, MessageSquare, Package, Settings } from "lucide-react";

export function MarshalNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/marshal", label: "Master Schedule", icon: Calendar },
    { href: "/marshal/testimonials", label: "Testimonials", icon: MessageSquare },
    { href: "/marshal/rentals", label: "Equipment", icon: Package },
    { href: "/marshal/settings", label: "Desk Settings", icon: Settings },
  ];

  return (
    <nav aria-label="Marshal Panel Navigation" className="flex items-center gap-1.5 p-1 bg-neutral-100/80 rounded-2xl border border-black/6 w-fit overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isActive
                ? "bg-white text-[#252724] shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-[#252724]"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#5a8357]" : "text-neutral-400"}`} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
