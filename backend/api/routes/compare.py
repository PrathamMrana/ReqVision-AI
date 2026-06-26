import time
from flask import Blueprint, request, jsonify
from utils.preprocess import get_sentences, clean_text
from utils.similarity import calculate_similarity_matrix
from utils.matcher import match_sentences
from utils.analyzer import generate_recommendations
from analytics.modules import get_module_impact
from analytics.risk import calculate_metrics, generate_executive_summary

compare_bp = Blueprint('compare_bp', __name__)

@compare_bp.route('/compare', methods=['POST'])
def compare_requirements():
    start_time = time.time()
    
    data = request.get_json()
    if not data or 'baseline' not in data or 'updated' not in data:
        return jsonify({"error": "Missing baseline or updated text"}), 400
        
    baseline_text = data['baseline']
    updated_text = data['updated']
    
    # 1. Tokenize into sentences
    baseline_sents = get_sentences(baseline_text)
    updated_sents = get_sentences(updated_text)
    
    # Check for empty files
    if not baseline_sents and not updated_sents:
        return jsonify({"error": "Both documents are empty"}), 400
        
    # 2. Clean sentences
    clean_baseline = [clean_text(s['text']) for s in baseline_sents]
    clean_updated = [clean_text(s['text']) for s in updated_sents]
    
    # 3. Greedy Requirement Matching (Delegates to matcher.py)
    # The matcher will compute TF-IDF inside itself between matched IDs!
    changes = match_sentences(baseline_sents, updated_sents, clean_baseline, clean_updated)
    
    # 6. Analytics
    module_impact = get_module_impact(changes)
    
    # 6.5 Recommendations & Quality Summaries
    total_quality = 0
    ambiguous_count = 0
    atomic_count = 0
    poor_quality_count = 0
    
    impacted_modules = set()
    review_areas = set()
    testing_focus = set()
    
    for change in changes:
        module = change.get('module', 'Other')
        status = change['status']
        rec = generate_recommendations(status, module)
        change['recommendations'] = rec
        
        if rec:
            impacted_modules.add(module)
            review_areas.add(rec['review'])
            for t in rec['tests']:
                testing_focus.add(t)
                
        q = change.get('quality', {})
        score = q.get('score', 0)
        total_quality += score
        if any("-10 Ambiguous word" in d for d in q.get('deductions', [])):
            ambiguous_count += 1
        if any("-10 Multiple requirements" not in d for d in q.get('deductions', [])):
            atomic_count += 1
        if score < 70:
            poor_quality_count += 1

    total_reqs = len(changes)
    quality_summary = {
        "average_score": round(total_quality / total_reqs) if total_reqs > 0 else 0,
        "ambiguous_count": ambiguous_count,
        "atomic_count": atomic_count,
        "poor_quality_count": poor_quality_count,
        "total": total_reqs
    }
    
    impact_analysis = {
        "impacted_modules": list(impacted_modules),
        "review_areas": list(review_areas),
        "testing_focus": list(testing_focus)
    }

    metrics = calculate_metrics(len(baseline_sents), len(updated_sents), changes)
    executive_summary = generate_executive_summary(metrics, module_impact)
    
    from datetime import datetime
    executive_summary["comparison_date"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    executive_summary["baseline_version"] = "v1.0"
    executive_summary["updated_version"] = "v2.0"
    executive_summary["ai_confidence"] = "High (TF-IDF Semantics)"
    
    execution_time = time.time() - start_time
    
    # Performance Statistics
    stats = {
        "execution_time_ms": round(execution_time * 1000, 2),
        "requirements_processed": len(baseline_sents) + len(updated_sents),
        "similarity_calculations": len(baseline_sents) * len(updated_sents)
    }
    
    response = {
        "metrics": metrics,
        "executive_summary": executive_summary,
        "module_impact": module_impact,
        "quality_summary": quality_summary,
        "impact_analysis": impact_analysis,
        "changes": changes,
        "statistics": stats
    }
    
    return jsonify(response), 200
