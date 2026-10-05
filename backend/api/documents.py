from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.document_service import save_upload, get_document, analyze_documents
from services.llm_service import extract_profile_from_document
from models.profile import UserProfile

router = APIRouter(prefix="/api/documents", tags=["documents"])


class AnalyzeDocumentsRequest(BaseModel):
    document_ids: list[str]
    profile: dict | None = None


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        doc = await save_upload(file.filename, content)
        return {
            "id": doc["id"],
            "filename": doc["filename"],
            "size": doc["size"],
            "status": doc["status"],
            "extraction_success": doc["extraction_success"],
            "extraction_method": doc["extraction_method"],
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload document")


@router.get("/{document_id}")
async def get_document_info(document_id: str):
    doc = get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc["id"],
        "filename": doc["filename"],
        "size": doc["size"],
        "status": doc["status"],
        "extraction_success": doc["extraction_success"],
    }


@router.post("/analyze")
async def analyze_docs(request: AnalyzeDocumentsRequest):
    if not request.document_ids:
        raise HTTPException(status_code=400, detail="No document IDs provided")

    analysis = analyze_documents(request.document_ids)
    extracted_profile = {}

    if analysis["has_text"]:
        existing = UserProfile(**request.profile) if request.profile else None
        extracted_profile = await extract_profile_from_document(
            analysis["combined_text"], existing
        )

    return {
        "document_count": analysis["document_count"],
        "document_names": analysis["document_names"],
        "has_text": analysis["has_text"],
        "extracted_profile": extracted_profile,
    }
