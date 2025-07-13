from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List
from bson import ObjectId
from db.connection import jd_collection
from utils.serialize import serialize_document
from utils.extract_text_by_choice import extract_text_choice
from utils.extract_text_by_s3 import  extract_text_from_s3
from services.extract_personal_info import Extract_personal_info
from services.predict_catagory import predict_category
from services.extract_info import extract_resume_info
from services.calculate_similarities import calculate_similarity
from services.upload_valid_resume import upload_resume
from services.insert_select_by_model import send_result_to_admin
router = APIRouter()
@router.post("/matchs")
async def match_resumes_with_job_description(    resumes: List[UploadFile] = File(...), jobDescriptionId: str = Form(...)):
    try:
        # Fetch the job description from MongoDB
        jd = await jd_collection.find_one({"_id": ObjectId(jobDescriptionId)})
        if not jd:
            raise HTTPException(status_code=404, detail="Job description not found.")
        # Deserialize the job description document
        jd = serialize_document(jd)
        job_desc_text = await extract_text_from_s3(jd["file_key"])

        matching_percentages = []
        resume_names = []
        predicted_categories = []
        Resume_personal_info = []
        Resume_extracted_entities = []
        # Process each resume
        for resume in resumes:
            # Extract text from resume
            #content = await resume.read()
            #resume_file = io.BytesIO(content) # Reset pointer before reading
            resume_text = await extract_text_choice(resume)
            #extract personal info
            Resume_personal_info.append(Extract_personal_info(resume_text))
            # Calculate similarity
            similarity = calculate_similarity(resume_text, job_desc_text)
            percentage = round(similarity, 2)
            matching_percentages.append(percentage)
            resume_names.append(resume.filename)
            print(similarity)
            # Upload and process resumes with a match percentage >= 70
            if similarity >= 70:

                resume.file.seek(0)  # Reset pointer before entity extraction
                predicted_category = predict_category(resume_text)
                predicted_categories.append(predicted_category)
                #Extract resume entities
                Resume_entities = await extract_resume_info(resume)
                Resume_extracted_entities.append(Resume_entities)
                #print(Resume_entities)
                uploaded_resume = await upload_resume(resume.filename, resume)
                #Notify admin
                send_result_to_admin(jd, uploaded_resume, matching_percentages, Resume_entities , Resume_personal_info , predicted_category)


        return JSONResponse(
            content={
                
                "personal_info": Resume_personal_info,
                "matchingPercentages": matching_percentages,
                "resumeNames": resume_names,
                "jd": jd.get("job_title"),
                "category" : predicted_categories,
                "extracted_info" : Resume_extracted_entities,
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred from matching jd-cv func: {str(e)}"
        )
