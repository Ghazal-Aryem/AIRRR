from models.model_loader import nlp_extract
from models.model_loader import nlp_lg
from utils.extract_text_by_choice import extract_text_choice
from fastapi import  File, UploadFile
from typing import List

def get_skills(text: str) -> List[str]:
    doc = nlp_lg(text)
    return list(set(ent.text for ent in doc.ents if ent.label_.startswith("SKILL")))

async def extract_resume_info(resume: UploadFile = File(...)) -> dict:
    try:
        # Extract text from the resume
        extracted_text = await extract_text_choice(resume)
        if not extracted_text:
            raise ValueError(f"Failed to extract text from the file: {resume.filename}")
        # Extract skills using the spaCy custom model
        skills = get_skills(extracted_text)
        #Extract entities using the spaCy pipeline
        doc = nlp_extract(extracted_text)
        entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
        #Define custom entity categories
        custom_entities = {
            "Location": [],
            "WorkExperience": [],
            "CompaniesWorkedAt":[],
            "YearOfExperience":[],
            "CollegeName": [],
            "Degree": [],
            "University": [],
            "Language":[],
            "YearOfGraduation": [],
            "Skills": [],
            "Certifications": [],
        }

        # Map raw entities to custom categories
        for entity in entities:
            if entity["label"] == "LOCATION":
                custom_entities["Location"].append(entity["text"])
            elif entity["label"] == "WORKED AS":
                custom_entities["WorkExperience"].append(entity["text"])
            elif entity["label"] == "COMPANIES WORKED AT":
                custom_entities["CompaniesWorkedAt"].append(entity["text"])
            elif entity["label"] == "YEARS OF EXPERIENCE":
                custom_entities["YearOfExperience"].append(entity["text"])
            elif entity["label"] == "COLLEGE NAME":
                custom_entities["CollegeName"].append(entity["text"])
            elif entity["label"] == "UNIVERSITY":
                custom_entities["University"].append(entity["text"])
            elif entity["label"] == "YEAR OF GRADUATION":
                custom_entities["YearOfGraduation"].append(entity["text"])
            elif entity["label"] == "LANGUAGE":
                custom_entities["Language"].append(entity["text"])
            elif entity["label"] == "DEGREE":
                custom_entities["Degree"].append(entity["text"])
            elif entity["label"] == "CERTIFICATION":
                custom_entities["Certifications"].append(entity["text"])
            elif entity["label"] == "SKILLS":
                custom_entities["Skills"].append(entity["text"])

        combined_skills = list(set(skills + custom_entities["Skills"]))
        custom_entities["Skills"] = combined_skills
        # Return extracted info
        return {
            "resumeName": resume.filename,
            "entities": custom_entities

        }
    except Exception as e:
        raise ValueError(f"Error processing the file {resume.filename}: {e}")