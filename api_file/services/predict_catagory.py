from utils.clean_text import clean_text
from models.model_loader import tfidf_vectorizer
from models.model_loader import rf_classifier
def predict_category(resume_text: str):
    clean_resume_text = clean_text(resume_text)
    resume_tfidf = tfidf_vectorizer.transform([clean_resume_text])
    predicted_category = rf_classifier.predict(resume_tfidf)[0]
    return predicted_category