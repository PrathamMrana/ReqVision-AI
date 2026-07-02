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

def generate_engineering_impact(change):
    status = change.get('status')
    if status in ['Unchanged', 'N/A']:
        return None
        
    module = change.get('module', 'Other')
    complexity = change.get('complexity', 'Low')
    new_text = (change.get('new') or change.get('old') or '').lower()
    
    # Calculate Fibonacci Story Points (1, 2, 3, 5, 8, 13)
    points = 3
    if complexity == 'High':
        points = 8 if status == 'Modified' else 13
    elif complexity == 'Medium':
        points = 5 if status == 'Modified' else 8
    else:
        points = 2 if status == 'Modified' else 3
        
    if len(new_text.split()) > 25 and points < 13:
        points = 8 if points == 5 else 13 if points == 8 else points
        
    # Estimate Sprint Effort
    effort_map = {
        1: "< 1 day",
        2: "1–2 days",
        3: "2–3 days",
        5: "3–5 days (1 Sprint)",
        8: "1–2 Sprints",
        13: "2+ Sprints (Major Epic)"
    }
    sprint_effort = effort_map.get(points, "3–5 days")
    
    # Backward Compatibility & Breaking Changes
    breaking_keywords = ['remove', 'delete', 'replace', 'migrate', 'schema', 'breaking', 'deprecated', 'oauth', 'token', 'drop', 'alter', 'rename']
    is_breaking = any(kw in new_text for kw in breaking_keywords) or status == 'Removed'
    backward_compatible = not is_breaking
    
    # Dynamic Keyword-Driven Architecture Impact Stars (out of 5)
    stars = {
        "Frontend": 2,
        "Backend": 3,
        "Database": 1,
        "API": 2,
        "Testing": 3
    }
    
    # Check keyword rules first for true data-driven stars
    if any(kw in new_text for kw in ['oauth', 'sso', 'jwt', 'token', 'auth', 'login', 'security']):
        stars['API'] = 5
        stars['Backend'] = 5
        stars['Testing'] = 4
        stars['Frontend'] = 2
    elif any(kw in new_text for kw in ['payment', 'stripe', 'checkout', 'billing', 'invoice', 'transaction']):
        stars['API'] = 5
        stars['Backend'] = 5
        stars['Testing'] = 5
        stars['Database'] = 4
        stars['Frontend'] = 3
    elif any(kw in new_text for kw in ['database', 'schema', 'table', 'sql', 'migration', 'index', 'query']):
        stars['Database'] = 5
        stars['Backend'] = 5
        stars['API'] = 3
        stars['Testing'] = 4
        stars['Frontend'] = 1
    elif any(kw in new_text for kw in ['ui', 'button', 'screen', 'view', 'layout', 'dashboard', 'theme', 'mobile']):
        stars['Frontend'] = 5
        stars['Backend'] = 2
        stars['API'] = 2
        stars['Testing'] = 3
    elif any(kw in new_text for kw in ['report', 'export', 'pdf', 'csv', 'chart', 'analytics']):
        stars['Backend'] = 4
        stars['Database'] = 3
        stars['Frontend'] = 4
        stars['Testing'] = 3
    else:
        # Fallback to module heuristics
        if module in ['UI/UX', 'Dashboard', 'Profile']:
            stars['Frontend'] = 5
            stars['Backend'] = 2
        elif module in ['Authentication', 'Authorization', 'Security']:
            stars['Frontend'] = 4
            stars['Backend'] = 5
            stars['API'] = 5
            stars['Testing'] = 5
        elif module in ['Database', 'Loan Management', 'Inventory']:
            stars['Database'] = 5
            stars['Backend'] = 5
            stars['API'] = 3
        elif module in ['API', 'Payment', 'Search & Catalog']:
            stars['API'] = 5
            stars['Backend'] = 5
            stars['Frontend'] = 3
            stars['Testing'] = 5
            
    if is_breaking:
        stars['Testing'] = 5
        stars['Backend'] = max(stars['Backend'], 4)
        
    # Richer Dependency Chain Story
    if any(kw in new_text for kw in ['payment', 'stripe', 'checkout', 'billing', 'invoice', 'transaction']) or module == 'Payments':
        chain = ["Payment Module", "Payment API", "Transaction Service", "Billing Database", "Integration Tests"]
    elif any(kw in new_text for kw in ['oauth', 'sso', 'jwt', 'token', 'auth', 'login']) or module in ['Authentication', 'Authorization']:
        chain = ["Auth Module", "OAuth Gateway", "Session Middleware", "User Identity DB", "Security Penetration Tests"]
    elif any(kw in new_text for kw in ['database', 'schema', 'table', 'sql', 'migration']) or module == 'Database':
        chain = ["Data Access Layer", "ORM Models", "Schema Migration Script", "Core Database", "Data Migration Tests"]
    elif any(kw in new_text for kw in ['search', 'filter', 'sort', 'catalog']) or module == 'Search & Catalog':
        chain = ["Search Module", "Search API Indexer", "Catalog Service", "Read Replica DB", "Load Tests"]
    elif any(kw in new_text for kw in ['report', 'export', 'pdf', 'csv']) or module == 'Reporting':
        chain = ["Reporting UI", "Report Generator Service", "Async Job Queue", "Data Warehouse", "Export Validation Tests"]
    else:
        rec = generate_recommendations(status, module)
        components = rec.get('components', ['Core Layer', "Service Module"]) if rec else ['Core Layer']
        tests = rec.get('tests', ['Regression Tests']) if rec else ['Regression Tests']
        chain = list(components) + [tests[0] if tests else "E2E Tests"]
    
    return {
        "story_points": points,
        "sprint_effort": sprint_effort,
        "backward_compatible": backward_compatible,
        "stars": stars,
        "dependency_chain": chain,
        "is_breaking": is_breaking
    }
