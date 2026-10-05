"""Evidence validation and citation service."""
from models.scheme import Scheme
from models.result import EvidenceItem


def build_evidence(scheme: Scheme) -> list[EvidenceItem]:
    source = scheme.source
    items = [
        EvidenceItem(
            source_name=source.name,
            source_url=source.url,
            source_page=source.page,
            source_excerpt=source.excerpt or f"Eligibility criteria for {scheme.name} as per official guidelines.",
            verified_at=source.verified_at,
            is_demo=source.is_demo,
        )
    ]

    if scheme.income_limit:
        items.append(EvidenceItem(
            source_name=source.name,
            source_url=source.url,
            source_page=source.page,
            source_excerpt=f"Annual family income must be below ₹{scheme.income_limit:,} to qualify.",
            verified_at=source.verified_at,
            is_demo=source.is_demo,
        ))

    if scheme.age_min or scheme.age_max:
        age_range = f"{scheme.age_min or '—'} to {scheme.age_max or '—'}"
        items.append(EvidenceItem(
            source_name=source.name,
            source_url=source.url,
            source_excerpt=f"Age eligibility: {age_range} years.",
            verified_at=source.verified_at,
            is_demo=source.is_demo,
        ))

    return items
