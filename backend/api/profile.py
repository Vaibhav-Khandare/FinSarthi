from fastapi import APIRouter, HTTPException
from pydantic import ValidationError
from models.profile import ProfileCreate, ProfileResponse
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/api/profile", tags=["profile"])

_profiles: dict[str, dict] = {}


@router.post("", response_model=ProfileResponse)
async def create_profile(profile: ProfileCreate):
    try:
        profile_id = str(uuid.uuid4())
        data = profile.model_dump()
        data["id"] = profile_id
        data["created_at"] = datetime.now(timezone.utc).isoformat()
        _profiles[profile_id] = data
        return ProfileResponse(**data)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))


@router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(profile_id: str):
    data = _profiles.get(profile_id)
    if not data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse(**data)
