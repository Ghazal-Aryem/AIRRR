from fastapi import APIRouter, Form, File, UploadFile, HTTPException , Path ,Query
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
from db.connection import jd_collection , s3_client
from utils.serialize import serialize_document
from bson import ObjectId
import uuid

router = APIRouter()

class Job(BaseModel):
    job_title: str
    file_link: str
    expire_date: str
@router.post("/upload")#insert
async def upload_job(
    job_title: str = Form(...),
    expire_date: str = Form(None),
    file: UploadFile = File(...)
):
    try:
        unique_filename = f"{uuid.uuid4()}-{file.filename}"
        s3_client.upload_fileobj(
            file.file,
            "jd-cv",
            unique_filename,
            ExtraArgs={"ContentType": file.content_type},
        )
        expire_date_parsed = (
            datetime.fromisoformat(expire_date) if expire_date else datetime.now(timezone.utc) + timedelta(days=7)
        )
        document = {
            "job_title": job_title,
            "file_key": unique_filename,
            "status": "active",
            "upload_date": datetime.now(timezone.utc).isoformat(),
            "expire_date": expire_date_parsed.isoformat(),
        }
        await jd_collection.insert_one(document)
        return {"message": "Job uploaded successfully", "file_key": unique_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/job_descriptions")#all jd
async def get_job_descriptions(search: str = Query("", alias="search")):
    if search.strip():
        query = {"job_title": {"$regex": search, "$options": "i"}}
    else:
        query = {}
    job_descriptions =  await jd_collection.find(query).to_list(None)
    for jd in job_descriptions:
        jd["_id"] = str(jd["_id"])
        #print(f"Job Title: {jd.get('job_title', 'No title found')}")
    return {"job_descriptions": job_descriptions  }

@router.get("/job_descriptions/{jobid}")
async def view_job_description(jobid: str = Path(...)):
    """
    Endpoint to fetch job description details by jobId.
    """
    try:
        jd = await jd_collection.find_one({"_id": ObjectId(jobid) })
        if not jd:
            raise HTTPException(status_code=404, detail="Job description not found.")
        jd = serialize_document(jd)
        pre_signed_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": "jd-cv", "Key": jd["file_key"]},
            ExpiresIn=3600,  # URL valid for 1 hour
        )
        print(pre_signed_url)
        return {
            "title": jd.get("job_title", "N/A"),  # Default to "N/A" if key not found
            "link": pre_signed_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred from view jd func: {str(e)}")

@router.put("/update-job/{job_id}")#UPDATE
async def update_job(
        job_id: str,
        job_title: str = Form(...),
        expire_date: str = Form(None),  # Accept an optional expiration date
        file: UploadFile = File(None)  # Optional new file
):
    """
    Update job title, expiration date, and/or file for the given job ID.
    """
    try:
        # Convert job_id to ObjectId
        job_object_id = ObjectId(job_id)

        # Find the existing job in the database
        job = await jd_collection.find_one({"_id": job_object_id})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Prepare the updated fields
        update_fields = {"job_title": job_title}

        # Update the expiration date if provided
        if expire_date:
            try:
                expire_date_parsed = datetime.fromisoformat(expire_date)
                update_fields["expire_date"] = expire_date_parsed.isoformat()
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid expire_date format. Use ISO 8601.")

        # If a new file is provided, upload it to S3 and update the file key
        if file:
            unique_filename = f"{uuid.uuid4()}-{file.filename}"
            s3_client.upload_fileobj(
                file.file,
                "jd-cv",
                unique_filename,
                ExtraArgs={"ContentType": file.content_type},
            )
            update_fields["file_key"] = unique_filename

        # Update the job document in MongoDB
        await jd_collection.update_one({"_id": job_object_id}, {"$set": update_fields})
        print("Job update successfully")
        return {"message": "Job updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete-job/{job_id}") #DELETE
async def delete_job(job_id: str):
    """
    Delete a job by its ID and remove its file from S3.
    """
    try:
        # Convert job_id to ObjectId
        job_object_id = ObjectId(job_id)

        # Find the job to delete
        job = await jd_collection.find_one({"_id": job_object_id})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Delete the file from S3
        s3_client.delete_object(Bucket="jd-cv", Key=job["file_key"])

        # Delete the job from MongoDB
        await jd_collection.delete_one({"_id": job_object_id})
        print("Job deleted successfully")
        return {"message": "Job deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/get-active-jobs")
async def get_active_jobs():
    jobs = await jd_collection.find({"status": "active"}).to_list(None)
    for job in jobs:
        job["_id"] = str(job["_id"])
    return jobs


