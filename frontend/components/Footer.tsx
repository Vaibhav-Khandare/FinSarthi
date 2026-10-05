import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-indigo-900">FINSARTHI</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Discover. Verify. Understand. Apply.
            </p>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              FinSarthi provides eligibility guidance based on available information and official scheme documents.
              Final eligibility and approval are determined by the respective government authority.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-slate-900">Product</h4>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li><a href="/onboarding" className="hover:text-indigo-700">Check Eligibility</a></li>
                <li><a href="/schemes" className="hover:text-indigo-700">Browse Schemes</a></li>
                <li><a href="/dashboard" className="hover:text-indigo-700">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Legal</h4>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>Demo Dataset</li>
                <li>Not for real-world application</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © 2025 FinSarthi. Demo prototype — Demo Dataset — Not for real-world application.
        </div>
      </div>
    </footer>
  );
}
