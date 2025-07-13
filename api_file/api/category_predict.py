from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from utils.extract_text_by_choice import extract_text_choice
from utils.clean_text import clean_text
from models.model_loader import tfidf_vectorizer, rf_classifier
import numpy as np
from sklearn.preprocessing import LabelEncoder

router = APIRouter()

category_mapping = {
    36 : "HR",
    21 : "DESIGNER",
    39 : "INFORMATION-TECHNOLOGY",
    53: "TEACHER",
    3: "ADVOCATE",
    12: "BUSINESS-DEVELOPMENT",
    35: "HEALTHCARE",
    32: "FITNESS",
    4: "AGRICULTURE",
    11: "BPO",
    50: "SALES",
    18: "CONSULTANT",
    22: "DIGITAL-MEDIA",
    7: "AUTOMOBILE",
    16: "CHEF",
    31: "FINANCE",
    5: "APPAREL",
    28: "ENGINEERING",
    2: "ACCOUNTANT",
    17: "CONSTRUCTION",
    48: "PUBLIC-RELATIONS",
    10: "BANKING",
    6: "ARTS",
    8: "AVIATION",
    23: "Data Science",
    43: "Mechanical Engineer",
    52: "Sales",
    38: "Health and fitness",
    19: "Civil Engineer",
    41: "Java Developer",
    15: "Business Analyst",
    51: "SAP Developer",
    9: "Automation Testing",
    30: "Electrical Engineering",
    46: "Operations Manager",
    49: "Python Developer",
    26: "DevOps Engineer",
    45: "Network Security Engineer",
    47: "PMO",
    25: "Database",
    37: "Hadoop",
    29: "ETL Developer",
    27: "DotNet Developer",
    14: "Blockchain",
    54: "Testing",
    40: "Information Technology",
    1: "PCI port logging",
    0: "Department of Psychology\\nSecretary/Receptionist",
    33: "Frontend Developer",
    13: "Backend Developer",
    24: "Data Scientist",
    34: "Full Stack Developer",
    44: "Mobile App Developer (iOS/Android)",
    42:"Machine Learning Engineer",
    20: "Cloud Engineer" ,
}
MergedCategory=['HR', 'DESIGNER', 'INFORMATION-TECHNOLOGY', 'TEACHER', 'ADVOCATE',
        'BUSINESS-DEVELOPMENT', 'HEALTHCARE', 'FITNESS', 'AGRICULTURE',
        'BPO', 'SALES', 'CONSULTANT', 'DIGITAL-MEDIA', 'AUTOMOBILE',
        'CHEF', 'FINANCE', 'APPAREL', 'ENGINEERING', 'ACCOUNTANT',
        'CONSTRUCTION', 'PUBLIC-RELATIONS', 'BANKING', 'ARTS', 'AVIATION',
        'Data Science', 'Mechanical Engineer', 'Sales',
        'Health and fitness', 'Civil Engineer', 'Java Developer',
        'Business Analyst', 'SAP Developer', 'Automation Testing',
        'Electrical Engineering', 'Operations Manager', 'Python Developer',
        'DevOps Engineer', 'Network Security Engineer', 'PMO', 'Database',
        'Hadoop', 'ETL Developer', 'DotNet Developer', 'Blockchain',
        'Testing', ' PCI port logging',
        ' Department of Psychology\\nSecretary/Receptionist',
        'Frontend Developer', 'Backend Developer', 'Data Scientist',
        'Full Stack Developer', 'Mobile App Developer (iOS/Android)',
        'Machine Learning Engineer', 'Cloud Engineer']

@router.post("/predict-category")
async def predict_category_api(resume: UploadFile = File(...)):
    # Extract text from the uploaded file
    resume_text = await  extract_text_choice(resume)
    clean_resume_text = clean_text(resume_text)
    resume_tfidf = tfidf_vectorizer.transform([clean_resume_text])

    # Get probabilities for each category
    probabilities = rf_classifier.predict_proba(resume_tfidf)[0]

    # Train the label encoder with the categories
    label_encoder = LabelEncoder().fit(MergedCategory)
    category_names = label_encoder.classes_

    # Get the top 5 categories and their probabilities
    top_indices = probabilities.argsort()[-5:][::-1]  # Indices of the top 5 categories
    top_categories = [(category_names[i], probabilities[i]) for i in top_indices]
    result = [{"category": category, "probability": round(probability * 100, 2)} for category, probability in
              top_categories]

    return result