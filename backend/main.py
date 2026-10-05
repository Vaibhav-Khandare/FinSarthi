import os
import sys
import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, os.path.dirname(__file__))

from config import get_settings
from api.profile import router as profile_router
from api.documents import router as documents_router
from api.schemes import router as schemes_router
from api.analysis import router as analysis_router
from services.analysis_service import get_demo_data

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(os.path.join(os.path.dirname(__file__), "uploads"), exist_ok=True)
    yield


app = FastAPI(
    title="FinSarthi API",
    description="AI-assisted government scheme eligibility platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile_router)
app.include_router(documents_router)
app.include_router(schemes_router)
app.include_router(analysis_router)


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "demo_mode": settings.demo_mode,
        "llm_available": settings.llm_available,
        "version": "1.0.0",
    }


@app.get("/api/demo")
async def demo():
    return get_demo_data()


@app.post("/api/chat")
async def general_chat(body: dict):
    question = body.get("question", "")
    scheme_id = body.get("scheme_id")
    profile_data = body.get("profile", {})

    if not question:
        raise HTTPException(status_code=400, detail="Question is required")

    if scheme_id:
        from models.profile import UserProfile
        from services.scheme_service import get_scheme_by_id
        from services.eligibility_engine import evaluate_eligibility
        from services.evidence_service import build_evidence
        from services.llm_service import answer_scheme_question

        scheme = get_scheme_by_id(scheme_id)
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found")
        try:
            profile = UserProfile(**profile_data)
        except Exception:
            raise HTTPException(status_code=422, detail="Invalid profile")
        evaluation = evaluate_eligibility(profile, scheme)
        evidence = build_evidence(scheme)
        answer = await answer_scheme_question(question, scheme, evaluation, evidence)
        return {"answer": answer}

    return {
        "answer": "Please navigate to a specific scheme to ask detailed questions, or use the analysis flow to get personalized recommendations.",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
