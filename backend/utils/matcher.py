import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from .analyzer import analyze_quality, detect_priority, calculate_complexity, generate_recommendations

try:
    base_stop_words = set(stopwords.words('english'))
except LookupError:
    base_stop_words = set()

custom_stopwords = {'shall', 'system', 'user', 'must', 'will', 'should', 'can', 'may', 'allow', 'provide', 'ensure', 'require', 'requirement', 'application', 'software'}
stop_words = base_stop_words.union(custom_stopwords)

def get_confidence_score(similarity, status):
    if status in ["Added", "Removed"]:
        return "New" if status == "Added" else "N/A"
    
    sim_pct = similarity * 100
    if sim_pct >= 95:
        return "Very High"
    elif sim_pct >= 80:
        return "High"
    elif sim_pct >= 60:
        return "Medium"
    else:
        return "Low"

def get_detected_changes(old_text, new_text):
    vectorizer = TfidfVectorizer(stop_words=list(stop_words), token_pattern=r'\b[a-zA-Z]{3,}\b')
    try:
        tfidf = vectorizer.fit_transform([old_text, new_text])
        feature_names = vectorizer.get_feature_names_out()
        
        old_vec = tfidf.toarray()[0]
        new_vec = tfidf.toarray()[1]
        
        diff = new_vec - old_vec
        
        # Sort by highest positive difference
        added_indices = np.argsort(diff)[::-1]
        added = [feature_names[i] for i in added_indices if diff[i] > 0][:3]
        
        # Sort by lowest negative difference (highest removal)
        removed_indices = np.argsort(-diff)[::-1]
        removed = [feature_names[i] for i in removed_indices if diff[i] < 0][:3]
        
        # Highest common importance
        common_score = np.minimum(old_vec, new_vec)
        common_indices = np.argsort(common_score)[::-1]
        common = [feature_names[i] for i in common_indices if common_score[i] > 0][:2]
        
    except Exception:
        added, removed, common = [], [], []
    
    changes = []
    
    if added and removed:
        reason = f"{added[0].capitalize()} capability introduced, replacing '{removed[0]}'."
        changes.append(f"Summary: Scope modified by adding '{', '.join(added)}' while reducing emphasis on '{', '.join(removed)}'.")
    elif added:
        reason = f"{added[0].capitalize()} capability expanded."
        changes.append(f"Summary: Scope expanded to include '{', '.join(added)}'.")
    elif removed:
        reason = f"{removed[0].capitalize()} capability reduced."
        changes.append(f"Summary: Scope narrowed by removing '{', '.join(removed)}'.")
    else:
        reason = "Minor textual modifications."
        changes.append("Summary: Phrasing updated without major semantic shifts.")

    if added:
        changes.append(f"+ Added keywords: {', '.join(added)}")
    if removed:
        changes.append(f"- Removed keywords: {', '.join(removed)}")
    if common:
        changes.append(f"✓ Retained concepts: {', '.join(common)}")
        
    return {
        "highlights": changes,
        "reason": reason
    }

def match_sentences(baseline_dicts, updated_dicts, clean_baseline, clean_updated):
    """
    Matches requirements by their IDs first.
    Calculates TF-IDF Cosine Similarity only for matched IDs.
    """
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    
    # Fit global TF-IDF for accurate IDF weights
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, lowercase=True, min_df=1)
    all_clean = clean_baseline + clean_updated
    if all_clean:
        vectorizer.fit(all_clean)
        
    def get_sim(old_txt, new_txt):
        if not old_txt and not new_txt: 
            return {"semantic": 1.0, "keyword": 1.0, "overall": 1.0}
        if not old_txt or not new_txt: 
            return {"semantic": 0.0, "keyword": 0.0, "overall": 0.0}
        
        try:
            # Semantic (TF-IDF Cosine)
            vecs = vectorizer.transform([old_txt, new_txt])
            semantic = float(cosine_similarity(vecs[0:1], vecs[1:2])[0][0])
            
            # Keyword Match (Jaccard-like overlap of unique tokens)
            old_tokens = set(old_txt.split())
            new_tokens = set(new_txt.split())
            if not old_tokens and not new_tokens:
                keyword = 1.0
            else:
                intersection = len(old_tokens.intersection(new_tokens))
                union = len(old_tokens.union(new_tokens))
                keyword = intersection / union if union > 0 else 0.0
                
            overall = (semantic * 0.7) + (keyword * 0.3)
            
            return {
                "semantic": round(semantic, 4),
                "keyword": round(keyword, 4),
                "overall": round(overall, 4)
            }
        except Exception:
            return {"semantic": 0.0, "keyword": 0.0, "overall": 0.0}

    changes = []
    
    # 1. Create dictionaries mapping ID to objects
    # If an item has no ID (None), assign a temporary unique ID for tracking
    base_map = {}
    for i, b in enumerate(baseline_dicts):
        rid = b.get('id') or f"AUTO-{(i+1):03d}"
        base_map[rid] = {"text": b['text'], "clean": clean_baseline[i]}
        
    updated_map = {}
    for j, u in enumerate(updated_dicts):
        rid = u.get('id') or f"AUTO-{(j+1):03d}"
        updated_map[rid] = {"text": u['text'], "clean": clean_updated[j]}
        
    all_ids = set(base_map.keys()).union(set(updated_map.keys()))
    
    # Sort IDs logically to preserve order
    for rid in sorted(list(all_ids)):
        in_base = rid in base_map
        in_up = rid in updated_map
        
        if in_base and not in_up:
            old_text = base_map[rid]['text']
            changes.append({
                "req_id": rid,
                "old": old_text, "new": "", "status": "Removed",
                "similarity": 0.0, "confidence": "N/A",
                "quality": analyze_quality(old_text),
                "priority": detect_priority(old_text),
                "complexity": calculate_complexity(old_text)
            })
            
        elif not in_base and in_up:
            new_text = updated_map[rid]['text']
            changes.append({
                "req_id": rid,
                "old": "", "new": new_text, "status": "Added",
                "similarity": 0.0, "confidence": "New",
                "quality": analyze_quality(new_text),
                "priority": detect_priority(new_text),
                "complexity": calculate_complexity(new_text)
            })
            
        elif in_base and in_up:
            old_text = base_map[rid]['text']
            new_text = updated_map[rid]['text']
            
            sim_data = get_sim(base_map[rid]['clean'], updated_map[rid]['clean'])
            sim_score = sim_data["overall"]
            
            if sim_score >= 0.90:
                status = "Unchanged"
            else:
                status = "Modified"
                
            change_obj = {
                "req_id": rid,
                "old": old_text,
                "new": new_text,
                "status": status,
                "similarity": sim_score,
                "similarity_breakdown": sim_data,
                "confidence": get_confidence_score(sim_score, status),
                "quality": analyze_quality(new_text),
                "priority": detect_priority(new_text),
                "complexity": calculate_complexity(new_text)
            }
            
            if status == "Modified":
                change_obj["detected_changes"] = get_detected_changes(old_text, new_text)
                
            changes.append(change_obj)
            
    return changes
