from pydantic import BaseModel
from typing import Optional, Any


class ConditionResult(BaseModel):
    field: str
    label: str
    user_value: Any
    required: str
    status: str  # pass, fail, review
    reason: str


class EvidenceItem(BaseModel):
    source_name: str
    source_url: str
    source_page: Optional[int] = None
    source_excerpt: str
    verified_at: Optional[str] = None
    is_demo: bool = True


class EligibilityEvaluation(BaseModel):
    status: str  # LIKELY_ELIGIBLE, NEEDS_REVIEW, NOT_ELIGIBLE
    score: int
    match_score: int
    passed: list[ConditionResult]
    failed: list[ConditionResult]
    needs_review: list[ConditionResult]
    missing_documents: list[str]
    required_documents: list[str]
    why_eligible: list[str]
    why_not_eligible: list[str]


class SchemeResult(BaseModel):
    scheme_id: str
    scheme_name: str
    description: str
    short_description: str
    benefit: str
    icon: str
    evaluation: EligibilityEvaluation
    explanation: str
    evidence: list[EvidenceItem]
    how_to_apply: str
    source_url: str
    is_demo: bool = True


class AnalysisSummary(BaseModel):
    schemes_found: int
    likely_eligible: int
    needs_review: int
    not_eligible: int
    missing_documents: int


class AnalysisResponse(BaseModel):
    analysis_id: str
    profile: dict
    summary: AnalysisSummary
    results: list[SchemeResult]
    ai_activity: list[str]
    disclaimer: str
