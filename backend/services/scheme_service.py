"""Scheme retrieval and matching service."""
import json
import os
from functools import lru_cache
from models.profile import UserProfile
from models.scheme import Scheme
from services.eligibility_engine import compute_match_score


DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


@lru_cache(maxsize=1)
def load_schemes() -> list[Scheme]:
    path = os.path.join(DATA_DIR, "schemes.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [Scheme(**s) for s in data["schemes"]]


def get_scheme_by_id(scheme_id: str) -> Scheme | None:
    for scheme in load_schemes():
        if scheme.id == scheme_id:
            return scheme
    return None


def match_schemes(profile: UserProfile, min_match: int = 20) -> list[tuple[Scheme, int]]:
    results = []
    for scheme in load_schemes():
        score = compute_match_score(profile, scheme)
        if score >= min_match:
            results.append((scheme, score))
    results.sort(key=lambda x: x[1], reverse=True)
    return results


def filter_schemes(
    state: str | None = None,
    occupation: str | None = None,
    tag: str | None = None,
) -> list[Scheme]:
    schemes = load_schemes()
    if state:
        schemes = [s for s in schemes if s.state.lower() == "all india" or s.state.lower() == state.lower()]
    if occupation:
        schemes = [s for s in schemes if occupation.lower() in [o.lower() for o in s.occupation]]
    if tag:
        schemes = [s for s in schemes if tag.lower() in [t.lower() for t in s.tags]]
    return schemes
