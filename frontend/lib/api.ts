const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  full_name: string;
  age: number;
  state: string;
  district: string;
  occupation: string;
  annual_income: number;
  category: string;
  gender: string;
  business_type?: string | null;
  is_student: boolean;
  is_farmer: boolean;
  uploaded_documents?: string[];
}

export interface ConditionResult {
  field: string;
  label: string;
  user_value: unknown;
  required: string;
  status: string;
  reason: string;
}

export interface EligibilityEvaluation {
  status: string;
  score: number;
  match_score: number;
  passed: ConditionResult[];
  failed: ConditionResult[];
  needs_review: ConditionResult[];
  missing_documents: string[];
  required_documents: string[];
  why_eligible: string[];
  why_not_eligible: string[];
}

export interface EvidenceItem {
  source_name: string;
  source_url: string;
  source_page?: number | null;
  source_excerpt: string;
  verified_at?: string | null;
  is_demo: boolean;
}

export interface SchemeResult {
  scheme_id: string;
  scheme_name: string;
  description: string;
  short_description: string;
  benefit: string;
  icon: string;
  evaluation: EligibilityEvaluation;
  explanation: string;
  evidence: EvidenceItem[];
  how_to_apply: string;
  source_url: string;
  is_demo: boolean;
}

export interface AnalysisResponse {
  analysis_id: string;
  profile: UserProfile;
  summary: {
    schemes_found: number;
    likely_eligible: number;
    needs_review: number;
    not_eligible: number;
    missing_documents: number;
  };
  results: SchemeResult[];
  ai_activity: string[];
  disclaimer: string;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  size: number;
  status: string;
  extraction_success?: boolean;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new ApiError(res.status, err.detail || "Request failed");
  }

  return res.json();
}

export async function healthCheck() {
  return request<{ status: string; demo_mode: boolean }>("/api/health");
}

export async function getDemoData() {
  return request<{ demo_profile: UserProfile; demo_documents: { filename: string; content: string }[] }>("/api/demo");
}

export async function uploadDocument(file: File): Promise<UploadedDocument> {
  const form = new FormData();
  form.append("file", file);
  return request<UploadedDocument>("/api/documents/upload", { method: "POST", body: form });
}

export async function analyzeProfile(profile: UserProfile, documentIds: string[]): Promise<AnalysisResponse> {
  return request<AnalysisResponse>("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ profile, document_ids: documentIds }),
  });
}

export async function getSchemes() {
  return request<{ count: number; schemes: unknown[] }>("/api/schemes");
}

export async function getScheme(id: string) {
  return request<Record<string, unknown>>(`/api/schemes/${id}`);
}

export async function checkScheme(id: string, profile: UserProfile) {
  return request<SchemeResult>(`/api/schemes/${id}/check`, {
    method: "POST",
    body: JSON.stringify({ profile }),
  });
}

export async function askSchemeQuestion(id: string, question: string, profile: UserProfile) {
  return request<{ answer: string }>(`/api/schemes/${id}/chat`, {
    method: "POST",
    body: JSON.stringify({ question, profile }),
  });
}

export { ApiError };
