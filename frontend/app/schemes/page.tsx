"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSchemes } from "@/lib/api";
import { ArrowRight } from "lucide-react";

interface SchemeListItem {
  id: string;
  name: string;
  short_description: string;
  benefit: string;
  icon: string;
  state: string;
  tags: string[];
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<SchemeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchemes()
      .then((data) => setSchemes(data.schemes as SchemeListItem[]))
      .catch(() => setSchemes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900">Government Schemes</h1>
        <p className="mt-2 text-slate-500">Browse available schemes — Demo Dataset — Not for real-world application.</p>

        {loading ? (
          <p className="mt-10 text-slate-400">Loading schemes...</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {schemes.map((scheme) => (
              <div key={scheme.id} className="card hover:shadow-md transition-shadow">
                <span className="text-2xl">{scheme.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{scheme.name}</h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{scheme.short_description}</p>
                <p className="mt-3 font-bold text-indigo-700">{scheme.benefit}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {scheme.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{tag}</span>
                  ))}
                </div>
                <Link href={`/scheme/${scheme.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
