import re

AMBIGUOUS_WORDS = ["fast", "easy", "efficient", "user-friendly", "secure", "quickly", "robust", "optimal", "flexible"]
CONDITIONALS = ["if", "when", "unless", "in case", "provided that"]

def analyze_quality(req_text):
    if not req_text:
        return {"score": 0, "deductions": [], "strengths": [], "weaknesses": [], "suggestions": [], "ambiguous_words": []}

    score = 100
    deductions = []
    strengths = []
    weaknesses = []
    suggestions = []
    found_ambiguous = []

    text_lower = req_text.lower()
    words = text_lower.split()
    
    # 1. Ambiguous words (-10)
    for w in AMBIGUOUS_WORDS:
        if w in text_lower:
            found_ambiguous.append(w)
    
    if found_ambiguous:
        score -= 10
        deductions.append("-10 Ambiguous word(s)")
        weaknesses.append(f"Contains ambiguous words: {', '.join(found_ambiguous)}")
        suggestions.append("Replace subjective adjectives with measurable metrics.")
    else:
        strengths.append("Clear and unambiguous language")

    # 2. Passive voice (-10)
    # Simple heuristic: is/are/was/were/be/been/being + [word ending in ed]
    if re.search(r'\b(is|are|was|were|be|been|being)\s+\w+ed\b', text_lower):
        score -= 10
        deductions.append("-10 Passive voice")
        weaknesses.append("Uses passive voice")
        suggestions.append("Rewrite in active voice to clarify the actor (e.g., 'The system shall...').")

    # 3. Multiple requirements (-10)
    # Heuristic: multiple 'shall', 'must', or 'will'
    req_keywords = len(re.findall(r'\b(shall|must|will)\b', text_lower))
    if req_keywords > 1:
        score -= 10
        deductions.append("-10 Multiple requirements in one sentence")
        weaknesses.append("Non-atomic requirement (contains multiple 'shall'/'must' clauses)")
        suggestions.append("Split into separate, single-responsibility requirements.")
    else:
        strengths.append("Atomic requirement")

    # 4. Not measurable (-15)
    # Heuristic: lacks numbers, percentages, or specific timeframes
    has_numbers = bool(re.search(r'\d+', req_text))
    is_boolean = bool(re.search(r'\b(support|allow|enable|provide|generate|restrict|enforce)\b', text_lower))
    
    if not has_numbers and not is_boolean:
        score -= 15
        deductions.append("-15 Not measurable")
        weaknesses.append("Lacks measurable criteria")
        suggestions.append("Add specific metrics, thresholds, or exact criteria to allow verification.")
    elif has_numbers:
        strengths.append("Highly measurable (contains quantitative criteria)")

    # 5. Length checks
    if len(words) < 5:
        score -= 5
        deductions.append("-5 Too short")
        weaknesses.append("Too concise")
        suggestions.append("Expand the requirement to ensure completeness.")
    elif len(words) > 30:
        score -= 5
        deductions.append("-5 Too long")
        weaknesses.append("Overly verbose")
        suggestions.append("Simplify the sentence to improve readability.")
    
    if score == 100:
        strengths.append("Perfectly formed requirement")

    return {
        "score": max(0, score),
        "deductions": deductions,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions,
        "ambiguous_words": found_ambiguous
    }

def detect_priority(req_text):
    if not req_text:
        return "N/A"
    text_lower = req_text.lower()
    if "must" in text_lower or "shall" in text_lower:
        return "Must Have"
    elif "should" in text_lower:
        return "Should Have"
    elif "could" in text_lower:
        return "Could Have"
    elif "may" in text_lower:
        return "Optional"
    return "Must Have"

def calculate_complexity(req_text):
    if not req_text:
        return "Low"
    
    text_lower = req_text.lower()
    complexity_score = 0
    
    # Sentence length
    words = len(text_lower.split())
    if words > 20:
        complexity_score += 1
    if words > 30:
        complexity_score += 1
        
    # Conjunctions
    conjunctions = len(re.findall(r'\b(and|or)\b', text_lower))
    if conjunctions > 1:
        complexity_score += 1
    if conjunctions > 3:
        complexity_score += 1
        
    # Conditionals
    for cond in CONDITIONALS:
        if cond in text_lower:
            complexity_score += 2
            break
            
    # Multiple actors/actions
    actions = len(re.findall(r'\b(allow|provide|generate|store|encrypt|restrict|view|export)\b', text_lower))
    if actions > 1:
        complexity_score += 1

    if complexity_score >= 4:
        return "High"
    elif complexity_score >= 2:
        return "Medium"
    else:
        return "Low"

def generate_recommendations(status, module):
    if status in ["Unchanged", "N/A"]:
        return None
        
    rules = {
        "Authentication": {
            "review": "Review OAuth/SSO implementations and session management.",
            "components": ["Authentication Service", "Session Middleware", "User Database"],
            "tests": ["Auth Integration Tests", "Security/Penetration Tests"]
        },
        "Database": {
            "review": "Review database migration scripts and schema changes.",
            "components": ["Database Layer", "ORM Models"],
            "tests": ["Database Integration Tests", "Data Migration Tests"]
        },
        "API": {
            "review": "Update API documentation (Swagger/OpenAPI) and notify consumers.",
            "components": ["API Gateway", "Route Controllers"],
            "tests": ["API Contract Tests", "Endpoint E2E Tests"]
        },
        "Reporting": {
            "review": "Validate export functionality and report generation pipelines.",
            "components": ["Report Generator Service", "File Storage"],
            "tests": ["Export Format Tests (PDF/CSV)", "Analytics Integration Tests"]
        },
        "Notifications": {
            "review": "Verify email/SMS communication workflows and templates.",
            "components": ["Notification Service", "Email Templates"],
            "tests": ["Webhook/Delivery Tests", "Template Rendering Tests"]
        },
        "Payments": {
            "review": "Review payment gateway integration and webhook handlers.",
            "components": ["Payment Processor", "Invoice Service"],
            "tests": ["Payment E2E Tests", "Financial Reconciliation Tests"]
        }
    }
    
    # Fallback default
    default = {
        "review": "Review affected feature implementation and backwards compatibility.",
        "components": [f"{module} Core Module" if module != "Unknown" else "Affected Components"],
        "tests": ["Unit Tests", "Regression Test Suite"]
    }
    
    return rules.get(module, default)
