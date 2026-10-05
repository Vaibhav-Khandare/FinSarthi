import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  LIKELY_ELIGIBLE: {
    label: "LIKELY ELIGIBLE",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  NEEDS_REVIEW: {
    label: "NEEDS REVIEW",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  NOT_ELIGIBLE: {
    label: "NOT ELIGIBLE",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

export default function EligibilityBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEEDS_REVIEW;
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-wide", config.className, className)}>
      <span className={cn("h-2 w-2 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
