"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/schemes", label: "Schemes" },
  { href: "/#about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-700 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-indigo-900">FINSARTHI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-indigo-700",
                pathname === link.href ? "text-indigo-700" : "text-slate-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/onboarding?demo=true" className="hidden text-sm font-medium text-indigo-700 hover:text-indigo-800 sm:block">
            Try Demo
          </Link>
          <Link href="/onboarding" className="btn-primary !py-2.5 !px-4 !text-sm">
            Check Eligibility
          </Link>
        </div>
      </div>
    </header>
  );
}
