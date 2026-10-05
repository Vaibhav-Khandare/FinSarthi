import { FileWarning } from "lucide-react";

export default function MissingDocuments({
  missing,
  required,
}: {
  missing: string[];
  required: string[];
}) {
  if (!missing.length && !required.length) return null;

  return (
    <div className="card border-amber-100 bg-amber-50/30">
      <div className="flex items-center gap-2 mb-4">
        <FileWarning className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold text-slate-900">Documents</h3>
      </div>

      {missing.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-amber-700 mb-2">Missing Documents</p>
          <ul className="space-y-2">
            {missing.map((doc) => (
              <li key={doc} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Required Documents</p>
        <ul className="space-y-2">
          {required.map((doc) => (
            <li key={doc} className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`h-2 w-2 rounded-full ${missing.includes(doc) ? "bg-amber-500" : "bg-emerald-500"}`} />
              {doc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
