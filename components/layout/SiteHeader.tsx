"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export const NAV_ITEMS = [
  { href: "/atlas", label: "Airway atlas" },
  { href: "/navigate", label: "Navigate" },
  { href: "/stations", label: "EBUS stations" },
  { href: "/staging", label: "Nodal staging" },
  { href: "/quiz", label: "Quiz" },
  { href: "/glossary", label: "Glossary" },
  { href: "/about", label: "About & sources" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <LogoMark />
          <span>{siteConfig.name}</span>
        </Link>
        <button
          type="button"
          className="rounded-md border border-line px-3 py-1.5 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
        <nav id="site-nav" aria-label="Main" className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-[5.5rem] z-20 border-b border-line bg-surface px-4 pb-3 lg:static lg:block lg:border-0 lg:p-0`}>
          <ul className="flex flex-col gap-1 lg:flex-row lg:gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-2 text-[0.95rem] hover:bg-surface-2 ${active ? "bg-accent-soft font-semibold text-ink" : "text-muted"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function LogoMark() {
  // Original simplified airway glyph.
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="var(--accent)" />
      <path d="M14 4v9M14 13l-6 6M14 13l6 6M8 19l-2 4M8 19l2 4M20 19l-2 4M20 19l2 4" stroke="var(--on-accent)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
