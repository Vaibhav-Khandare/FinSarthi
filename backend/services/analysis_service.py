"""Orchestrates the full analysis pipeline."""
import uuid
import json
import os
from models.profile import UserProfile
from models.result import SchemeResult, AnalysisSummary, AnalysisResponse
from services.scheme_service import match_schemes, get_scheme_by_id
from services.eligibility_engine import evaluate_eligibility
from services.evidence_service import build_evidence
from services.llm_service import extract_profile_from_document, explain_scheme_result, DISCLAIMER
from services.document_service import analyze_documents

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


async def run_analysis(profile: UserProfile, document_ids: list[str]) -> AnalysisResponse:
    analysis_id = str(uuid.uuid4())
    ai_activity = []

    # Step 1: Document analysis
    doc_analysis = analyze_documents(document_ids)
    ai_activity.append("✓ Documents read and processed")

    # Step 2: Profile extraction
    if doc_analysis["has_text"]:
        extracted = await extract_profile_from_document(doc_analysis["combined_text"], profile)
        profile = UserProfile(**{**profile.model_dump(), **extracted})
        ai_activity.append("✓ Profile information extracted from documents")
    else:
        ai_activity.append("✓ Profile validated from user input")

    # Add document names to profile
    doc_names = doc_analysis.get("document_names", [])
    profile.uploaded_documents = list(set(profile.uploaded_documents + doc_names))

    # Step 3: Scheme discovery
    matched = match_schemes(profile)
    ai_activity.append(f"✓ {len(matched)} schemes discovered")

    # Step 4: Eligibility evaluation
    results: list[SchemeResult] = []
    likely, review, not_elig = 0, 0, 0
    all_missing = set()

    for scheme, match_score in matched:
        evaluation = evaluate_eligibility(profile, scheme)
        evidence = build_evidence(scheme)
        explanation = await explain_scheme_result(profile, scheme, evaluation)

        if evaluation.status == "LIKELY_ELIGIBLE":
            likely += 1
        elif evaluation.status == "NEEDS_REVIEW":
            review += 1
        else:
            not_elig += 1

        all_missing.update(evaluation.missing_documents)

        results.append(SchemeResult(
            scheme_id=scheme.id,
            scheme_name=scheme.name,
            description=scheme.description,
            short_description=scheme.short_description,
            benefit=scheme.benefit,
            icon=scheme.icon,
            evaluation=evaluation,
            explanation=explanation,
            evidence=evidence,
            how_to_apply=scheme.how_to_apply,
            source_url=scheme.source.url,
            is_demo=scheme.source.is_demo,
        ))

    ai_activity.append(f"✓ {len(results)} schemes matched")
    ai_activity.append("✓ Eligibility rules evaluated")
    ai_activity.append("✓ Evidence verified")
    ai_activity.append("✓ Recommendations prepared")

    summary = AnalysisSummary(
        schemes_found=len(results),
        likely_eligible=likely,
        needs_review=review,
        not_eligible=not_elig,
        missing_documents=len(all_missing),
    )

    return AnalysisResponse(
        analysis_id=analysis_id,
        profile=profile.model_dump(),
        summary=summary,
        results=results,
        ai_activity=ai_activity,
        disclaimer=DISCLAIMER,
    )


async def check_single_scheme(profile: UserProfile, scheme_id: str) -> SchemeResult | None:
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        return None
    evaluation = evaluate_eligibility(profile, scheme)
    evidence = build_evidence(scheme)
    explanation = await explain_scheme_result(profile, scheme, evaluation)
    return SchemeResult(
        scheme_id=scheme.id,
        scheme_name=scheme.name,
        description=scheme.description,
        short_description=scheme.short_description,
        benefit=scheme.benefit,
        icon=scheme.icon,
        evaluation=evaluation,
        explanation=explanation,
        evidence=evidence,
        how_to_apply=scheme.how_to_apply,
        source_url=scheme.source.url,
        is_demo=scheme.source.is_demo,
    )


def get_demo_data() -> dict:
    path = os.path.join(DATA_DIR, "demo_profiles.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
