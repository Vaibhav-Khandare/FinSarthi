"""Modular LLM service with demo fallback."""
import json
import httpx
from config import get_settings
from models.profile import UserProfile
from models.scheme import Scheme
from models.result import EligibilityEvaluation

settings = get_settings()

DISCLAIMER = (
    "FinSarthi provides eligibility guidance based on available information and official scheme documents. "
    "Final eligibility and approval are determined by the respective government authority."
)


async def _call_llm(messages: list[dict], json_mode: bool = True) -> str | None:
    if not settings.llm_available:
        return None
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            payload = {
                "model": settings.llm_model,
                "messages": messages,
                "temperature": 0.2,
            }
            if json_mode:
                payload["response_format"] = {"type": "json_object"}
            resp = await client.post(
                f"{settings.openai_base_url}/chat/completions",
                headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]
    except Exception:
        return None


def _demo_extract_profile(text: str, existing: UserProfile | None = None) -> dict:
    """Demo fallback profile extraction from document text."""
    extracted = {}
    text_lower = text.lower()

    if "rahul" in text_lower or "patil" in text_lower:
        extracted["full_name"] = "Rahul Patil"
    if "maharashtra" in text_lower:
        extracted["state"] = "Maharashtra"
    if "pune" in text_lower:
        extracted["district"] = "Pune"
    if "obc" in text_lower:
        extracted["category"] = "OBC"
    if "student" in text_lower:
        extracted["is_student"] = True
        extracted["occupation"] = "Student"
    if "farmer" in text_lower or "kisan" in text_lower:
        extracted["is_farmer"] = True
    if "income" in text_lower:
        for val in ["180000", "1,80,000", "180,000"]:
            if val.replace(",", "") in text.replace(",", ""):
                extracted["annual_income"] = 180000
                break

    if existing:
        base = existing.model_dump()
        base.update({k: v for k, v in extracted.items() if v is not None})
        return base
    return extracted


async def extract_profile_from_document(text: str, existing: UserProfile | None = None) -> dict:
    if settings.demo_mode or not settings.llm_available:
        return _demo_extract_profile(text, existing)

    prompt = f"""Extract user profile fields from this document text. Return JSON with only found fields:
full_name, age, state, district, occupation, annual_income, category, gender, is_student, is_farmer, business_type.
Do not invent values. Use null for missing fields.

Document text:
{text[:4000]}"""

    result = await _call_llm([{"role": "user", "content": prompt}])
    if result:
        try:
            data = json.loads(result)
            if existing:
                base = existing.model_dump()
                base.update({k: v for k, v in data.items() if v is not None})
                return base
            return data
        except json.JSONDecodeError:
            pass
    return _demo_extract_profile(text, existing)


def _demo_explanation(profile: UserProfile, scheme: Scheme, evaluation: EligibilityEvaluation) -> str:
    status_map = {
        "LIKELY_ELIGIBLE": "likely eligible",
        "NEEDS_REVIEW": "needs further review",
        "NOT_ELIGIBLE": "not currently eligible",
    }
    status_text = status_map.get(evaluation.status, "under review")

    parts = [
        f"Based on your profile, you appear {status_text} for {scheme.name}.",
        f"Your profile match score is {evaluation.match_score}%.",
    ]
    if evaluation.passed:
        parts.append(f"You satisfy {len(evaluation.passed)} condition(s) including {evaluation.passed[0].label}.")
    if evaluation.failed:
        parts.append(f"You do not meet {len(evaluation.failed)} requirement(s): {evaluation.failed[0].label}.")
    if evaluation.missing_documents:
        parts.append(f"Missing documents: {', '.join(evaluation.missing_documents)}.")
    parts.append("Final approval depends on the relevant government authority.")
    return " ".join(parts)


async def explain_scheme_result(
    profile: UserProfile, scheme: Scheme, evaluation: EligibilityEvaluation
) -> str:
    if settings.demo_mode or not settings.llm_available:
        return _demo_explanation(profile, scheme, evaluation)

    prompt = f"""Explain eligibility result. Do NOT override rules. Do NOT guarantee approval.
Profile: {profile.model_dump_json()}
Scheme: {scheme.name} - {scheme.description}
Status: {evaluation.status}, Match: {evaluation.match_score}%
Passed: {[c.label for c in evaluation.passed]}
Failed: {[c.label for c in evaluation.failed]}
Missing docs: {evaluation.missing_documents}
Return JSON: {{"explanation": "..."}}"""

    result = await _call_llm([{"role": "user", "content": prompt}])
    if result:
        try:
            return json.loads(result).get("explanation", _demo_explanation(profile, scheme, evaluation))
        except json.JSONDecodeError:
            pass
    return _demo_explanation(profile, scheme, evaluation)


def _demo_chat_answer(question: str, scheme: Scheme, evaluation: EligibilityEvaluation) -> str:
    q = question.lower()
    if "eligible" in q or "qualify" in q:
        if evaluation.status == "LIKELY_ELIGIBLE":
            reasons = "; ".join(c.label for c in evaluation.passed[:3]) or "profile matches key criteria"
            return f"You appear likely eligible because: {reasons}. Final approval is by the government authority."
        elif evaluation.status == "NOT_ELIGIBLE":
            reasons = "; ".join(c.label for c in evaluation.failed[:3]) or "some criteria not met"
            return f"You are not currently eligible because: {reasons}."
        return "Your application needs review. Some conditions or documents require verification."
    if "document" in q or "missing" in q:
        if evaluation.missing_documents:
            return f"Missing documents: {', '.join(evaluation.missing_documents)}. Required: {', '.join(evaluation.required_documents)}."
        return f"All required documents appear present. Required: {', '.join(evaluation.required_documents)}."
    if "benefit" in q or "amount" in q or "receive" in q:
        return f"The potential benefit for {scheme.name} is {scheme.benefit}. Actual amount depends on authority approval."
    if "apply" in q or "where" in q:
        return f"Apply via: {scheme.how_to_apply}. Official source: {scheme.source.url}"
    return f"For {scheme.name}, your status is {evaluation.status.replace('_', ' ').title()}. Match score: {evaluation.match_score}%."


async def answer_scheme_question(
    question: str, scheme: Scheme, evaluation: EligibilityEvaluation, evidence: list
) -> str:
    if settings.demo_mode or not settings.llm_available:
        return _demo_chat_answer(question, scheme, evaluation)

    prompt = f"""Answer ONLY from provided data. Do NOT invent schemes or requirements.
Question: {question}
Scheme: {scheme.model_dump_json()}
Evaluation: status={evaluation.status}, passed={[c.label for c in evaluation.passed]}, failed={[c.label for c in evaluation.failed]}, missing={evaluation.missing_documents}
Benefit: {scheme.benefit}
Apply: {scheme.how_to_apply}
Return JSON: {{"answer": "..."}}"""

    result = await _call_llm([{"role": "user", "content": prompt}])
    if result:
        try:
            return json.loads(result).get("answer", _demo_chat_answer(question, scheme, evaluation))
        except json.JSONDecodeError:
            pass
    return _demo_chat_answer(question, scheme, evaluation)
