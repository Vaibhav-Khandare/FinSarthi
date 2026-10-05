import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import EligibilityBadge from "./EligibilityBadge";
import { SchemeResult } from "@/lib/api";

export default function SchemeCard({ result }: { result: SchemeResult }) {
  const { evaluation } = result;
  const totalConditions = evaluation.passed.length + evaluation.failed.length + evaluation.needs_review.length;
  const satisfied = evaluation.passed.length;

  return (
    <div className="card group hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{result.icon}</span>
        <EligibilityBadge status={evaluation.status} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
        {result.scheme_name}
      </h3>
      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{result.short_description}</p>

      <p className="mt-4 text-xl font-bold text-indigo-700">{result.benefit}</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{satisfied} of {totalConditions || 1} conditions satisfied</span>
            <span>{evaluation.match_score}% profile match</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${evaluation.match_score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        {evaluation.passed.slice(0, 3).map((c) => (
          <p key={c.label} className="text-xs text-emerald-600 flex items-center gap-1">
            ✓ {c.label}
          </p>
        ))}
        {evaluation.missing_documents.slice(0, 1).map((doc) => (
          <p key={doc} className="text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> {doc} required
          </p>
        ))}
      </div>

      <Link
        href={`/scheme/${result.scheme_id}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
      >
        View Eligibility <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
