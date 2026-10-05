import { ConditionResult } from "@/lib/api";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function StatusIcon({ status }: { status: string }) {
  if (status === "pass") return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (status === "fail") return <XCircle className="h-5 w-5 text-red-500" />;
  return <AlertCircle className="h-5 w-5 text-amber-500" />;
}

function ConditionRow({ condition }: { condition: ConditionResult }) {
  const statusLabel = condition.status === "pass" ? "PASS" : condition.status === "fail" ? "FAIL" : "REVIEW";
  const statusColor = condition.status === "pass" ? "text-emerald-600" : condition.status === "fail" ? "text-red-600" : "text-amber-600";

  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-100 p-4">
      <StatusIcon status={condition.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-slate-900">{condition.label}</p>
          <span className={cn("text-xs font-bold", statusColor)}>{statusLabel}</span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Your value: <span className="font-medium">{String(condition.user_value)}</span>
        </p>
        <p className="text-sm text-slate-500">Required: {condition.required}</p>
      </div>
    </div>
  );
}

export default function EligibilityBreakdown({
  passed,
  failed,
  needsReview,
}: {
  passed: ConditionResult[];
  failed: ConditionResult[];
  needsReview: ConditionResult[];
}) {
  const all = [...passed, ...needsReview, ...failed];
  if (!all.length) return null;

  return (
    <div className="space-y-3">
      {all.map((c, i) => (
        <ConditionRow key={`${c.field}-${i}`} condition={c} />
      ))}
    </div>
  );
}
