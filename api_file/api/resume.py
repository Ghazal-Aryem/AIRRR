from fastapi import APIRouter, Path ,HTTPException , UploadFile, File , Form
from bson import ObjectId
from utils.serialize import serialize_document
from db.connection import resume_collection , s3_client
import uuid
import boto3
router = APIRouter()

@router.get("/View_resume/{resume_id}") #view resume by id
async def view_resume(resume_id: str = Path(...)):
    """
    Endpoint to fetch resume details by resumeId.
    """
    try:
        # Fetch resume document from MongoDB
        resume = await resume_collection.find_one({"_id": ObjectId(resume_id)})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found.")

        resume = serialize_document(resume)  # Serialize MongoDB document
        pre_signed_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": "resumes-bucket", "Key": resume["Resume_file_key"]},
            ExpiresIn=3600,  # URL valid for 1 hour
        )
        print(pre_signed_url)  # For debugging
        return {
            "name": resume.get("resume_name", "N/A"),  # Optional field
            "link": pre_signed_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
# API endpoint to match resumes with job description
@router.post("/input_resume") #insert resume
async def upload_resume(resume_name: str = Form(...), file: UploadFile = File(...)):
    try:
        unique_filename = f"{uuid.uuid4()}-{file.filename}"
        file.file.seek(0)  # Ensure file pointer is reset
        try:
            s3_client.upload_fileobj(
                file.file,
                "resumes-bucket",
                unique_filename,
                ExtraArgs={"ContentType": file.content_type},
            )
        except boto3.exceptions.S3UploadFailedError as e:
            raise HTTPException(status_code=500, detail=f"S3 upload failed: {str(e)}")
        resume_info = await  resume_collection.insert_one({"resume_name": resume_name, "Resume_file_key": unique_filename})
        resume_id = str(resume_info.inserted_id)
        return {"message": "Resume uploaded successfully","resume_id": resume_id, "Resume_file_key": unique_filename, "resume_name": resume_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))