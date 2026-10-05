import { ExternalLink, BookOpen } from "lucide-react";
import { EvidenceItem } from "@/lib/api";

export default function EvidenceCard({ evidence }: { evidence: EvidenceItem }) {
  return (
    <div className="card !p-5 border-indigo-100 bg-indigo-50/30">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Official Evidence</p>
          <h4 className="mt-1 font-semibold text-slate-900">{evidence.source_name}</h4>
          {evidence.source_page && (
            <p className="text-xs text-slate-500 mt-0.5">Page {evidence.source_page}</p>
          )}
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{evidence.source_excerpt}</p>
          {evidence.is_demo && (
            <p className="mt-2 text-xs text-amber-600 font-medium">Demo Dataset — Not for real-world application.</p>
          )}
          {evidence.verified_at && (
            <p className="mt-1 text-xs text-slate-400">Last verified: {evidence.verified_at}</p>
          )}
          <a
            href={evidence.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
          >
            View Official Source <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
