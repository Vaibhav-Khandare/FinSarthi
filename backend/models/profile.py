from pydantic import BaseModel, Field
from typing import Optional


class UserProfile(BaseModel):
    full_name: str = Field(..., min_length=2)
    age: int = Field(..., ge=1, le=120)
    state: str
    district: str
    occupation: str
    annual_income: int = Field(..., ge=0)
    category: str
    gender: str
    business_type: Optional[str] = None
    is_student: bool = False
    is_farmer: bool = False
    uploaded_documents: list[str] = []


class ProfileCreate(UserProfile):
    pass


class ProfileResponse(UserProfile):
    id: str
    created_at: str
