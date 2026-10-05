# FinSarthi

**Find Government Benefits You Actually Qualify For.**

FinSarthi is an AI-assisted government scheme discovery platform that combines document understanding, deterministic eligibility rules, and verified evidence to help users discover schemes they may qualify for.

> **Demo Dataset — Not for real-world application.**

## Features

- **Multi-step onboarding** — Profile collection with validation
- **Document upload** — PDF/image upload with text extraction and OCR fallback
- **AI profile extraction** — LLM-powered document understanding (with demo fallback)
- **Scheme matching** — Structured attribute filtering and profile match scoring
- **Rule-based eligibility engine** — Deterministic evaluation (income, age, state, category, documents)
- **Evidence citations** — Official source links with excerpts
- **Personalized dashboard** — Summary cards, scheme cards, analytics chart
- **Scheme detail pages** — Full eligibility breakdown, missing documents, evidence
- **Ask FinSarthi chat** — Context-aware Q&A on scheme detail pages
- **Demo mode** — Complete workflow without API keys (judge-ready in under 2 minutes)

## Architecture

```
Frontend (Next.js) → REST API (FastAPI) → Services
                                              ├── Document/OCR
                                              ├── Scheme Retrieval
                                              ├── Eligibility Engine
                                              ├── Evidence Validator
                                              └── LLM Explanation
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| Backend | Python, FastAPI, Pydantic |
| AI | OpenAI-compatible LLM (optional) |
| Documents | PyPDF2, pytesseract (OCR) |
| Data | Local JSON scheme database |

## Project Structure

```
finsarthi/
├── frontend/          # Next.js application
│   ├── app/           # Pages (landing, onboarding, upload, analyzing, dashboard, schemes)
│   ├── components/    # UI components
│   └── lib/           # API client, store, utilities
├── backend/           # FastAPI application
│   ├── api/           # Route handlers
│   ├── services/      # Business logic
│   ├── models/        # Pydantic models
│   └── data/          # Scheme JSON, demo profiles
├── .env.example
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- (Optional) Tesseract OCR for image text extraction

### 1. Environment Setup

```bash
cp .env.example .env
```

Set `DEMO_MODE=true` for judge demos (no API key needed).

### 2. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at **http://localhost:8000**

API docs at **http://localhost:8000/docs**

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

## Demo Mode

Click **"Try Demo"** on the landing page to auto-populate:

- **Profile:** Rahul Patil, 24, Student, Maharashtra, OBC, ₹1.8L income
- **Documents:** Income Certificate, Bonafide Certificate
- **Analysis:** Mix of Likely Eligible, Needs Review, and Not Eligible results

The entire demo completes in under 2 minutes with no external API dependencies.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/demo` | Demo profile and documents |
| POST | `/api/profile` | Create profile |
| POST | `/api/documents/upload` | Upload document |
| POST | `/api/documents/analyze` | Analyze uploaded documents |
| POST | `/api/analyze` | Full eligibility analysis |
| GET | `/api/schemes` | List all schemes |
| GET | `/api/schemes/{id}` | Get scheme details |
| POST | `/api/schemes/{id}/check` | Check eligibility for one scheme |
| POST | `/api/schemes/{id}/chat` | Ask scheme question |
| POST | `/api/chat` | General chat |

## How AI Works

1. **Document → OCR/Text Extraction** — PDF text or OCR for images
2. **LLM Structured Extraction** — Profile fields extracted from document text
3. **Scheme Retrieval** — Local JSON filtered by state, occupation, income, age
4. **Rule Engine** — Deterministic eligibility evaluation (LLM does NOT decide eligibility)
5. **Evidence** — Official source citations attached to each result
6. **LLM Explanation** — Natural language explanation of rule engine results

## How Eligibility Engine Works

Each scheme has structured rules with operators: `equals`, `less_than_or_equal`, `one_of`, etc.

The engine evaluates each condition independently and returns:
- **LIKELY ELIGIBLE** — All rules pass, no missing documents
- **NEEDS REVIEW** — Some conditions or documents need verification
- **NOT ELIGIBLE** — One or more hard requirements failed

Profile match score (0–100%) is separate from eligibility status and reflects attribute alignment.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | (empty) | OpenAI API key |
| `LLM_MODEL` | gpt-4o-mini | Model name |
| `DEMO_MODE` | true | Use demo fallbacks |
| `MAX_UPLOAD_SIZE_MB` | 10 | Max upload size |
| `NEXT_PUBLIC_API_URL` | http://localhost:8000 | Backend URL |

## Future Improvements

- Vector database integration (Pinecone/Chroma/FAISS)
- LangGraph agent orchestration
- Multi-state scheme expansion
- Regional language support
- Automatic policy update pipeline
- Human reviewer workflow

## Disclaimer

FinSarthi provides eligibility guidance based on available information and official scheme documents. Final eligibility and approval are determined by the respective government authority. All scheme data in this prototype is labeled as demo data.
