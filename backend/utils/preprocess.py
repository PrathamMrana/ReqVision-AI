import re
import string
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Ensure resources are available
try:
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
except LookupError:
    # Fallback if not downloaded (though app.py handles it)
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()

def get_sentences(text):
    """Parse text into list of dicts: [{'id': 'REQ-001', 'text': '...'}]"""
    if not text or not text.strip():
        return []
    
    # Try to split by explicit tags like REQ-001, FR-01, NFR-100
    if re.search(r'\b[A-Z]{2,4}-\d+', text):
        chunks = re.split(r'(?=\b[A-Z]{2,4}-\d+)', text)
        reqs = []
        for chunk in chunks:
            chunk = chunk.strip()
            if chunk:
                # Extract ID
                match = re.match(r'^([A-Z]{2,4}-\d+)[^\w]*(.*)', chunk, re.DOTALL)
                if match:
                    req_id = match.group(1)
                    req_text = match.group(2).strip().replace('\n', ' ')
                    reqs.append({"id": req_id, "text": req_text})
                # If no match, it's metadata (e.g. "Project: ... 1. FUNCTIONAL REQS") before the first ID, so ignore it.
        return reqs
        
    # Fallback to double newline split (paragraphs)
    chunks = re.split(r'\n\s*\n', text.strip())
    reqs = []
    for chunk in chunks:
        if chunk.strip():
            reqs.append({"id": None, "text": chunk.strip().replace('\n', ' ')})
    return reqs

def clean_text(text):
    """
    Lowercases, removes punctuation, removes stopwords, and lemmatizes the text.
    """
    # Lowercase
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Tokenize words
    words = word_tokenize(text)
    # Remove stopwords and lemmatize
    cleaned_words = [
        lemmatizer.lemmatize(w) for w in words if w not in stop_words
    ]
    return " ".join(cleaned_words)
