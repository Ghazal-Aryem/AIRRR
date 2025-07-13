from fastapi import APIRouter, HTTPException
from bson import ObjectId
from db.connection import jd_collection , resume_collection , valid_user_collection

router = APIRouter()
@router.get("/admin/notifications")
async def get_admin_notifications():
    try:
        notifications = await valid_user_collection.find().to_list()

        for notification in notifications:
            notification["_id"] = str(notification["_id"])
            # print(notification["resume_id"])
            resume_info = await resume_collection.find_one({"_id": ObjectId(notification["resume_id"])})
            if resume_info:
                notification["resume_name"] = resume_info.get("resume_name", "N/A")
                notification["Resume_file_key"] = resume_info.get("Resume_file_key", "N/A")
            else:
                notification["resume_name"] = "N/A"
                notification["Resume_file_key"] = "N/A"

            # Fetch job description name based on job_id
            job_description = await jd_collection.find_one({"_id": ObjectId(notification["job_id"])})
            if job_description:
                notification["job_title"] = job_description.get("job_title", "N/A")
                notification["job_key"] = job_description.get("file_key", "N/A")
            else:
                notification["job_title"] = "N/A"
                notification["job_key"] = "N/A"
        return {"notifications": notifications}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching notifications: {e}")