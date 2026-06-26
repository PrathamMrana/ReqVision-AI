import os
import nltk
from flask import Flask
from flask_cors import CORS
from api.routes.compare import compare_bp

def download_nltk_data():
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    try:
        nltk.data.find('tokenizers/punkt_tab')
    except LookupError:
        nltk.download('punkt_tab')
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')
    try:
        nltk.data.find('corpora/wordnet')
    except LookupError:
        nltk.download('wordnet')

def create_app():
    download_nltk_data()
    app = Flask(__name__)
    CORS(app)
    
    app.register_blueprint(compare_bp, url_prefix='/api')
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
