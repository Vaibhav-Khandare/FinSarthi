"""Deterministic eligibility rule engine."""
from typing import Any
from models.profile import UserProfile
from models.scheme import Scheme, SchemeRule
from models.result import ConditionResult, EligibilityEvaluation


OPERATORS = {
    "equals": lambda a, b: str(a).lower() == str(b).lower(),
    "not_equals": lambda a, b: str(a).lower() != str(b).lower(),
    "greater_than": lambda a, b: float(a) > float(b),
    "less_than": lambda a, b: float(a) < float(b),
    "greater_than_or_equal": lambda a, b: float(a) >= float(b),
    "less_than_or_equal": lambda a, b: float(a) <= float(b),
    "contains": lambda a, b: str(b).lower() in str(a).lower(),
    "one_of": lambda a, b: str(a).lower() in [str(x).lower() for x in (b if isinstance(b, list) else [b])],
    "all": lambda a, b: all(str(x).lower() in str(a).lower() for x in b) if isinstance(b, list) else False,
    "any": lambda a, b: any(str(x).lower() in str(a).lower() for x in b) if isinstance(b, list) else False,
}


def _get_field_value(profile: UserProfile, field: str) -> Any:
    mapping = {
        "income": profile.annual_income,
        "annual_income": profile.annual_income,
        "age": profile.age,
        "state": profile.state,
        "district": profile.district,
        "occupation": profile.occupation,
        "category": profile.category,
        "gender": profile.gender,
        "business_type": profile.business_type or "",
        "is_student": profile.is_student,
        "is_farmer": profile.is_farmer,
        "full_name": profile.full_name,
    }
    return mapping.get(field, getattr(profile, field, None))


def _evaluate_rule(profile: UserProfile, rule: SchemeRule) -> ConditionResult:
    user_value = _get_field_value(profile, rule.field)
    op_fn = OPERATORS.get(rule.operator)
    label = rule.label or rule.field.replace("_", " ").title()

    if op_fn is None:
        return ConditionResult(
            field=rule.field, label=label, user_value=user_value,
            required=str(rule.value), status="review",
            reason=f"Unknown operator: {rule.operator}",
        )

    try:
        passed = op_fn(user_value, rule.value)
    except (TypeError, ValueError):
        passed = False

    if passed:
        status, reason = "pass", f"Your {label.lower()} meets the requirement."
    else:
        status, reason = "fail", f"Your {label.lower()} does not meet the requirement."

    required_str = str(rule.value)
    if rule.operator == "less_than_or_equal":
        required_str = f"≤ ₹{int(rule.value):,}" if rule.field in ("income", "annual_income") else f"≤ {rule.value}"
    elif rule.operator == "greater_than_or_equal":
        required_str = f"≥ {rule.value}"
    elif rule.operator == "one_of" and isinstance(rule.value, list):
        required_str = ", ".join(str(v) for v in rule.value)

    return ConditionResult(
        field=rule.field, label=label, user_value=user_value,
        required=required_str, status=status, reason=reason,
    )


def _check_documents(profile: UserProfile, scheme: Scheme) -> tuple[list[str], list[ConditionResult]]:
    uploaded_lower = [d.lower() for d in profile.uploaded_documents]
    missing = []
    review_conditions = []

    for doc in scheme.documents:
        doc_lower = doc.lower()
        found = any(
            doc_lower in u or u in doc_lower
            for u in uploaded_lower
        )
        if not found:
            missing.append(doc)
            review_conditions.append(ConditionResult(
                field="document", label=doc, user_value="Missing",
                required="Required", status="review",
                reason=f"{doc} not uploaded — eligibility may require verification.",
            ))

    return missing, review_conditions


def _build_implicit_rules(scheme: Scheme) -> list[SchemeRule]:
    rules = list(scheme.rules)
    if scheme.income_limit and not any(r.field in ("income", "annual_income") for r in rules):
        rules.append(SchemeRule(field="income", operator="less_than_or_equal", value=scheme.income_limit, label="Annual Income"))
    if scheme.age_min is not None and not any(r.field == "age" and r.operator == "greater_than_or_equal" for r in rules):
        rules.append(SchemeRule(field="age", operator="greater_than_or_equal", value=scheme.age_min, label="Minimum Age"))
    if scheme.age_max is not None and not any(r.field == "age" and r.operator == "less_than_or_equal" for r in rules):
        rules.append(SchemeRule(field="age", operator="less_than_or_equal", value=scheme.age_max, label="Maximum Age"))
    if scheme.state and scheme.state.lower() != "all india":
        rules.append(SchemeRule(field="state", operator="equals", value=scheme.state, label="State"))
    if scheme.categories:
        rules.append(SchemeRule(field="category", operator="one_of", value=scheme.categories, label="Category"))
    if "student" in [o.lower() for o in scheme.occupation]:
        rules.append(SchemeRule(field="is_student", operator="equals", value=True, label="Student Status"))
    if "farmer" in [o.lower() for o in scheme.occupation]:
        rules.append(SchemeRule(field="is_farmer", operator="equals", value=True, label="Farmer Status"))
    return rules


def compute_match_score(profile: UserProfile, scheme: Scheme) -> int:
    score = 0
    if scheme.state.lower() == "all india" or profile.state.lower() == scheme.state.lower():
        score += 20
    occ_lower = [o.lower() for o in scheme.occupation]
    if profile.occupation.lower() in occ_lower or profile.is_student and "student" in occ_lower or profile.is_farmer and "farmer" in occ_lower:
        score += 20
    if scheme.income_limit is None or profile.annual_income <= scheme.income_limit:
        score += 20
    if (scheme.age_min is None or profile.age >= scheme.age_min) and (scheme.age_max is None or profile.age <= scheme.age_max):
        score += 10
    if not scheme.categories or profile.category.upper() in [c.upper() for c in scheme.categories]:
        score += 15
    uploaded_lower = [d.lower() for d in profile.uploaded_documents]
    doc_score = 0
    if scheme.documents:
        matched = sum(1 for doc in scheme.documents if any(doc.lower() in u for u in uploaded_lower))
        doc_score = int(15 * matched / len(scheme.documents))
    score += doc_score
    return min(score, 100)


def evaluate_eligibility(profile: UserProfile, scheme: Scheme) -> EligibilityEvaluation:
    rules = _build_implicit_rules(scheme)
    passed, failed, needs_review = [], [], []

    for rule in rules:
        result = _evaluate_rule(profile, rule)
        if result.status == "pass":
            passed.append(result)
        elif result.status == "fail":
            failed.append(result)
        else:
            needs_review.append(result)

    missing_docs, doc_reviews = _check_documents(profile, scheme)
    needs_review.extend(doc_reviews)

    match_score = compute_match_score(profile, scheme)

    if failed:
        status = "NOT_ELIGIBLE"
        score = max(20, match_score - len(failed) * 15)
    elif needs_review or missing_docs:
        status = "NEEDS_REVIEW"
        score = max(50, match_score - len(needs_review) * 5)
    else:
        status = "LIKELY_ELIGIBLE"
        score = match_score

    why_eligible = [c.reason for c in passed[:4]]
    why_not = [c.reason for c in failed[:4]]

    return EligibilityEvaluation(
        status=status,
        score=score,
        match_score=match_score,
        passed=passed,
        failed=failed,
        needs_review=needs_review,
        missing_documents=missing_docs,
        required_documents=scheme.documents,
        why_eligible=why_eligible,
        why_not_eligible=why_not,
    )
