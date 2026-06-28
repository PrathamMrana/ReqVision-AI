from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# Define semantic concepts (documents) for each module
MODULES = {
    "Authentication": "login sign in sign up register password oauth sso authenticate mfa session identity credential",
    "Authorization": "role permission access admin privilege rbac authorize restrict rule group grant",
    "Payment": "payment stripe checkout credit card billing invoice refund transaction pay subscription fee cost",
    "Search & Catalog": "search filter find sort lookup catalog category book item product inventory browse",
    "Loan Management": "borrow return loan due fine overdue issue renew checkout period returnable reserve",
    "Dashboard": "dashboard home page overview landing panel home hub central",
    "Reporting": "report export pdf csv summary excel download print analytics chart table",
    "Notifications": "email notification alert sms push message notify inbox broadcast",
    "Database": "database schema table sql nosql query record store save data repository migration backup",
    "API": "api endpoint rest graphql webhook integration payload sync fetch request response json http",
    "Profile": "profile avatar account settings preferences customer client user detail personal info",
    "Analytics": "analytics metric track statistic graph chart monitor performance usage trend dashboard",
    "Security": "security encryption hash ssl tls vulnerability secure protect firewall audit compliance",
    "Performance": "performance speed latency throughput response time load concurrent scalable fast cache optimize ms seconds",
    "UI/UX": "ui ux interface button click screen display view frontend layout responsive mobile accessibility design"
}

# Pre-train the TF-IDF model on the module concepts to build the semantic space
_module_names = list(MODULES.keys())
_module_docs = list(MODULES.values())
_vectorizer = TfidfVectorizer(stop_words='english')
_module_vectors = _vectorizer.fit_transform(_module_docs)

def detect_functional_area(text):
    """
    Categorizes requirements into predefined functional modules using TF-IDF Semantic Similarity.
    """
    if not text or not text.strip():
        return "Other"
        
    try:
        # Transform the requirement text into the semantic space
        req_vector = _vectorizer.transform([text.lower()])
        
        # Calculate cosine similarity against all module concept vectors
        similarities = cosine_similarity(req_vector, _module_vectors)[0]
        
        # Find the highest scoring module
        best_idx = similarities.argmax()
        best_score = similarities[best_idx]
        
        # Minimum similarity threshold to prevent forced misclassification
        if best_score > 0.05:
            return _module_names[best_idx]
            
    except Exception:
        pass
        
    return "Other"

def get_module_impact(changes):
    """
    Calculates the impact on different functional modules based on changes.
    """
    impact_data = {}
    total_changes = 0
    
    for change in changes:
        if change['status'] == 'Unchanged':
            continue
            
        # Consider the new requirement text if available, otherwise old
        text_to_analyze = change['new'] if change['new'] else change['old']
        module = detect_functional_area(text_to_analyze)
        change['module'] = module
        
        if module not in impact_data:
            impact_data[module] = {"Changed Requirements": 0, "Impact %": 0, "Risk Level": "Low"}
            
        impact_data[module]["Changed Requirements"] += 1
        total_changes += 1

    # Calculate percentages and risk
    for module in impact_data:
        impact_pct = round((impact_data[module]["Changed Requirements"] / total_changes) * 100) if total_changes > 0 else 0
        impact_data[module]["Impact %"] = impact_pct
        
        # Determine risk based on module and change count
        if module in ["Authentication", "Authorization", "Payments", "Security"]:
            impact_data[module]["Risk Level"] = "High"
        elif module in ["Database", "API"]:
            if impact_data[module]["Changed Requirements"] >= 2:
                impact_data[module]["Risk Level"] = "High"
            else:
                impact_data[module]["Risk Level"] = "Medium"
        else:
            if impact_data[module]["Changed Requirements"] >= 3:
                impact_data[module]["Risk Level"] = "Medium"
            else:
                impact_data[module]["Risk Level"] = "Low"
                
    # Also tag Unchanged items for the UI
    for change in changes:
        if change['status'] == 'Unchanged':
            change['module'] = detect_functional_area(change['old'])
            
    # Convert to list for frontend Recharts/Tables
    result = []
    for module, data in impact_data.items():
        result.append({
            "module": module,
            "changed": data["Changed Requirements"],
            "impact_pct": data["Impact %"],
            "risk": data["Risk Level"]
        })
        
    return sorted(result, key=lambda x: x['changed'], reverse=True)
