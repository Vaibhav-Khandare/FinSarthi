import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer id="about" className="scroll-mt-24 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] lg:grid-cols-[1.6fr_0.7fr_0.7fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white shadow-sm shadow-indigo-700/30">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-indigo-900">FINSARTHI</span>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">Discover. Verify. Understand. Apply.</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              FinSarthi helps citizens discover government schemes and understand eligibility using
              documented conditions and official sources. Final approval is always determined by the
              issuing authority.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/onboarding" className="transition-colors hover:text-indigo-700">
                  Check eligibility
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="transition-colors hover:text-indigo-700">
                  Browse schemes
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-indigo-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="transition-colors hover:text-indigo-700">
                  How it works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Guidance</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>Eligibility is informational</li>
              <li>Based on published scheme rules</li>
              <li>Authority decision is final</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FinSarthi. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            Guidance only — not an official government application or guarantee of benefits.
          </p>
        </div>
      </div>
    </footer>
  );
}