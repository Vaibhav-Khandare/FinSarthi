from pydantic import BaseModel
from typing import Optional, Any


class SchemeSource(BaseModel):
    name: str
    url: str
    page: Optional[int] = None
    excerpt: Optional[str] = None
    verified_at: Optional[str] = None
    is_demo: bool = True


class SchemeRule(BaseModel):
    field: str
    operator: str
    value: Any
    label: Optional[str] = None


class Scheme(BaseModel):
    id: str
    name: str
    description: str
    short_description: str
    state: str
    occupation: list[str]
    income_limit: Optional[int] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    categories: list[str] = []
    genders: list[str] = []
    benefit: str
    documents: list[str]
    rules: list[SchemeRule] = []
    source: SchemeSource
    how_to_apply: str = ""
    tags: list[str] = []
    icon: str = "🏛"
