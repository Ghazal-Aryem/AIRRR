from fastapi import  File, UploadFile ,Form , HTTPException
import uuid
import boto3
from db.connection import s3_client ,resume_collection

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