"""Document text extraction with OCR fallback."""
import io
import os
from config import get_settings

settings = get_settings()


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(io.BytesIO(file_bytes))
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        return "\n".join(text_parts).strip()
    except Exception:
        return ""


def extract_text_from_image(file_bytes: bytes) -> str:
    try:
        from PIL import Image
        import pytesseract
        image = Image.open(io.BytesIO(file_bytes))
        return pytesseract.image_to_string(image).strip()
    except Exception:
        return ""


def extract_text(filename: str, file_bytes: bytes) -> dict:
    ext = os.path.splitext(filename)[1].lower()
    text = ""
    method = "none"

    if ext == ".pdf":
        text = extract_text_from_pdf(file_bytes)
        method = "pdf"
        if not text.strip():
            method = "pdf_empty"
    elif ext in (".png", ".jpg", ".jpeg", ".webp"):
        text = extract_text_from_image(file_bytes)
        method = "ocr" if text.strip() else "ocr_empty"
    else:
        return {"text": "", "method": "unsupported", "success": False}

    return {
        "text": text,
        "method": method,
        "success": bool(text.strip()),
    }
