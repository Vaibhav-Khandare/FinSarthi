from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.profile import UserProfile
from models.result import AnalysisResponse
from services.analysis_service import run_analysis

router = APIRouter(prefix="/api", tags=["analysis"])

_analyses: dict[str, dict] = {}


class AnalyzeRequest(BaseModel):
    profile: dict
    document_ids: list[str] = []


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: AnalyzeRequest):
    try:
        profile = UserProfile(**request.profile)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid profile data: {e}")

    try:
        result = await run_analysis(profile, request.document_ids)
        _analyses[result.analysis_id] = result.model_dump()
        return result
    except Exception:
        raise HTTPException(status_code=500, detail="Analysis failed. Please try again.")


@router.get("/analyze/{analysis_id}")
async def get_analysis(analysis_id: str):
    data = _analyses.get(analysis_id)
    if not data:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return data
