"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import EligibilityBadge from "@/components/EligibilityBadge";
import EligibilityBreakdown from "@/components/EligibilityBreakdown";
import EvidenceCard from "@/components/EvidenceCard";
import MissingDocuments from "@/components/MissingDocuments";
import { SchemeResult, askSchemeQuestion } from "@/lib/api";
import { getAnalysis, getProfile } from "@/lib/store";
import { MessageCircle, Send, Loader2 } from "lucide-react";

const QUICK_QUESTIONS = [
  "Why am I eligible?",
  "What documents am I missing?",
  "How much benefit can I receive?",
  "Where do I apply?",
];

export default function SchemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [result, setResult] = useState<SchemeResult | null>(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ q: string; a: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const analysis = getAnalysis();
    if (analysis) {
      const found = analysis.results.find((r) => r.scheme_id === id);
      if (found) {
        setResult(found);
        return;
      }
    }
    router.push("/dashboard");
  }, [id, router]);

  const handleAsk = async (q: string) => {
    if (!q.trim() || !result) return;
    const profile = getProfile();
    if (!profile) return;

    setChatLoading(true);
    setQuestion("");
    try {
      const resp = await askSchemeQuestion(id, q, profile);
      setChatHistory((prev) => [...prev, { q, a: resp.answer }]);
    } catch {
      setChatHistory((prev) => [...prev, { q, a: "Sorry, I couldn't answer that. Please try again." }]);
    }
    setChatLoading(false);
  };

  if (!result) return <div className="py-20 text-center text-slate-500">Loading scheme details...</div>;

  const { evaluation } = result;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-start gap-4">
                <span className="text-4xl">{result.icon}</span>
                <div>
                  <p className="text-sm font-medium text-slate-500">Government Scheme</p>
                  <h1 className="text-3xl font-bold text-slate-900">{result.scheme_name}</h1>
                  {result.is_demo && (
                    <span className="mt-2 inline-block rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-xs font-semibold text-amber-700">
                      Demo Dataset — Not for real-world application
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-slate-600 leading-relaxed">{result.description}</p>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold text-slate-900">Benefit</h2>
              <p className="mt-2 text-2xl font-bold text-indigo-700">{result.benefit}</p>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Eligibility Breakdown</h2>
              <EligibilityBreakdown
                passed={evaluation.passed}
                failed={evaluation.failed}
                needsReview={evaluation.needs_review}
              />
            </div>

            {evaluation.why_eligible.length > 0 && (
              <div className="card border-emerald-100 bg-emerald-50/30">
                <h2 className="text-lg font-bold text-emerald-900">Why you qualify</h2>
                <ul className="mt-3 space-y-2">
                  {evaluation.why_eligible.map((r, i) => (
                    <li key={i} className="text-sm text-emerald-800 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.why_not_eligible.length > 0 && (
              <div className="card border-red-100 bg-red-50/30">
                <h2 className="text-lg font-bold text-red-900">Why you don&apos;t qualify</h2>
                <ul className="mt-3 space-y-2">
                  {evaluation.why_not_eligible.map((r, i) => (
                    <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <MissingDocuments missing={evaluation.missing_documents} required={evaluation.required_documents} />

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Evidence</h2>
              <div className="space-y-4">
                {result.evidence.map((ev, i) => (
                  <EvidenceCard key={i} evidence={ev} />
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold text-slate-900">How to Apply</h2>
              <p className="mt-2 text-slate-600">{result.how_to_apply}</p>
              <a href={result.source_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:text-indigo-800">
                View Official Source →
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card sticky top-24">
              <h3 className="font-bold text-slate-900">Eligibility Summary</h3>
              <div className="mt-4">
                <EligibilityBadge status={evaluation.status} className="!text-sm" />
              </div>
              <p className="mt-4 text-3xl font-bold text-indigo-700">{evaluation.match_score}%</p>
              <p className="text-sm text-slate-500">Profile match score</p>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Ask FinSarthi</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleAsk(q)}
                    disabled={chatLoading}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {chatHistory.length > 0 && (
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {chatHistory.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-xs font-semibold text-indigo-700">{item.q}</p>
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  className="input-field !py-2"
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk(question)}
                  disabled={chatLoading}
                />
                <button
                  onClick={() => handleAsk(question)}
                  disabled={chatLoading || !question.trim()}
                  className="btn-primary !px-3 !py-2"
                >
                  {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
