from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.profile import UserProfile
from services.scheme_service import load_schemes, get_scheme_by_id, filter_schemes
from services.analysis_service import check_single_scheme
from services.llm_service import answer_scheme_question
from services.evidence_service import build_evidence
from services.eligibility_engine import evaluate_eligibility

router = APIRouter(prefix="/api/schemes", tags=["schemes"])


class CheckRequest(BaseModel):
    profile: dict


class ChatRequest(BaseModel):
    question: str
    profile: dict


@router.get("")
async def list_schemes(state: str | None = None, occupation: str | None = None, tag: str | None = None):
    if state or occupation or tag:
        schemes = filter_schemes(state=state, occupation=occupation, tag=tag)
    else:
        schemes = load_schemes()
    return {
        "count": len(schemes),
        "schemes": [s.model_dump() for s in schemes],
        "disclaimer": "Demo Dataset — Not for real-world application.",
    }


@router.get("/{scheme_id}")
async def get_scheme(scheme_id: str):
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme.model_dump()


@router.post("/{scheme_id}/check")
async def check_eligibility(scheme_id: str, request: CheckRequest):
    try:
        profile = UserProfile(**request.profile)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid profile: {e}")

    result = await check_single_scheme(profile, scheme_id)
    if not result:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return result.model_dump()


@router.post("/{scheme_id}/chat")
async def scheme_chat(scheme_id: str, request: ChatRequest):
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    try:
        profile = UserProfile(**request.profile)
    except Exception:
        raise HTTPException(status_code=422, detail="Invalid profile")

    evaluation = evaluate_eligibility(profile, scheme)
    evidence = build_evidence(scheme)
    answer = await answer_scheme_question(request.question, scheme, evaluation, evidence)

    return {
        "question": request.question,
        "answer": answer,
        "disclaimer": "Answers are based on structured scheme data. Final approval is by the government authority.",
    }
