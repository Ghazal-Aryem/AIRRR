from fastapi import APIRouter, HTTPException ,UploadFile,File
from services.extract_info import extract_resume_info


router = APIRouter()
@router.post("/extract-info")
async def Extract_Information_From_Resume(resume: UploadFile = File(...)) -> dict:
    try:
        return await extract_resume_info(resume)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the file: {e}")