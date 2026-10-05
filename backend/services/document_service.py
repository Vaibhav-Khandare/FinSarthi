"""Document upload and analysis service."""
import os
import uuid
import aiofiles
from datetime import datetime, timezone
from config import get_settings
from services.ocr_service import extract_text

settings = get_settings()
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

_documents: dict[str, dict] = {}


async def save_upload(filename: str, content: bytes) -> dict:
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise ValueError(f"File exceeds {settings.max_upload_size_mb}MB limit")

    ext = os.path.splitext(filename)[1].lower()
    allowed = {".pdf", ".png", ".jpg", ".jpeg"}
    if ext not in allowed:
        raise ValueError(f"Unsupported file type: {ext}")

    doc_id = str(uuid.uuid4())
    safe_name = f"{doc_id}{ext}"
    path = os.path.join(UPLOAD_DIR, safe_name)

    async with aiofiles.open(path, "wb") as f:
        await f.write(content)

    extraction = extract_text(filename, content)

    doc = {
        "id": doc_id,
        "filename": filename,
        "size": len(content),
        "path": path,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
        "status": "ready",
        "extracted_text": extraction["text"],
        "extraction_method": extraction["method"],
        "extraction_success": extraction["success"],
    }
    _documents[doc_id] = doc
    return doc


def get_document(doc_id: str) -> dict | None:
    return _documents.get(doc_id)


def analyze_documents(document_ids: list[str]) -> dict:
    texts = []
    doc_names = []
    for doc_id in document_ids:
        doc = _documents.get(doc_id)
        if doc:
            texts.append(doc.get("extracted_text", ""))
            doc_names.append(doc["filename"])

    combined = "\n\n".join(t for t in texts if t.strip())
    return {
        "combined_text": combined,
        "document_count": len(document_ids),
        "document_names": doc_names,
        "has_text": bool(combined.strip()),
    }
