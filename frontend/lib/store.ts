"use client";

import { UserProfile, AnalysisResponse, UploadedDocument } from "./api";

const PROFILE_KEY = "finsarthi_profile";
const DOCS_KEY = "finsarthi_documents";
const ANALYSIS_KEY = "finsarthi_analysis";

export function saveProfile(profile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
}

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveDocuments(docs: UploadedDocument[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
  }
}

export function getDocuments(): UploadedDocument[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(DOCS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveAnalysis(analysis: AnalysisResponse) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
  }
}

export function getAnalysis(): AnalysisResponse | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(ANALYSIS_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearAll() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(DOCS_KEY);
    localStorage.removeItem(ANALYSIS_KEY);
  }
}
