from fastapi import APIRouter,HTTPException , UploadFile, File
from typing import List
from fastapi.responses import JSONResponse
from services.calculate_similarities import calculate_similarity
from utils.extract_text_by_choice import extract_text_choice
router = APIRouter()

@router.post("/admin/matchs")
async def match_resumes(resumes: List[UploadFile] = File(...), jobDescription: UploadFile = File(...)):
    try:
        # Read job description text
        job_desc_text = await extract_text_choice(jobDescription)

        matching_percentages = []
        resume_names = []

        # Process each resume
        for resume in resumes:
            resume_text = await  extract_text_choice(resume)
            similarity = calculate_similarity(resume_text, job_desc_text)
            matching_percentages.append(round(similarity, 2))
            resume_names.append(resume.filename)

        # Return the results
        return JSONResponse(content={
            "matchingPercentages": matching_percentages,
            "resumeNames": resume_names
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")