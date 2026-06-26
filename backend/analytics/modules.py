def detect_functional_area(text):
    """
    Categorizes requirements into predefined functional modules based on keywords.
    """
    text_lower = text.lower()
    
    modules = {
        "Authentication": ["login", "sign in", "sign up", "register", "password", "oauth", "sso", "authenticate", "mfa", "session"],
        "Authorization": ["role", "permission", "access", "admin", "privilege", "rbac", "allow", "restrict", "authorize"],
        "Payment": ["payment", "stripe", "checkout", "credit card", "billing", "invoice", "refund", "transaction", "pay", "subscription"],
        "Dashboard": ["dashboard", "home page", "overview", "landing", "panel", "home"],
        "Reporting": ["report", "export", "pdf", "csv", "summary", "excel", "download", "print"],
        "Notifications": ["email", "notification", "alert", "sms", "push", "message", "notify"],
        "Database": ["database", "schema", "table", "sql", "nosql", "query", "record", "store", "save", "data", "repository"],
        "API": ["api", "endpoint", "rest", "graphql", "webhook", "integration", "payload", "sync", "fetch"],
        "Profile": ["profile", "avatar", "account", "settings", "preferences", "user", "customer", "client"],
        "Analytics": ["analytics", "metric", "track", "statistic", "graph", "chart", "monitor"],
        "Security": ["security", "encryption", "hash", "ssl", "tls", "vulnerability", "secure", "protect", "firewall", "audit"],
        "Search": ["search", "filter", "find", "sort", "lookup"],
        "Administration": ["admin", "manage", "configuration", "setup", "control panel"],
        "Performance": ["performance", "speed", "latency", "throughput", "response time", "load", "concurrent", "scalable", "fast", "cache", "optimize", "ms", "seconds"],
        "Inventory": ["inventory", "stock", "item", "product", "warehouse", "sku", "catalog", "category"],
        "UI/UX": ["ui", "ux", "interface", "button", "click", "screen", "display", "view", "frontend", "layout", "responsive", "mobile"]
    }
    
    for module, keywords in modules.items():
        if any(keyword in text_lower for keyword in keywords):
            return module
            
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
