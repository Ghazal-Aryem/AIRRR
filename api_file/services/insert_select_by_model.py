from datetime import datetime
from db.connection import valid_user_collection
def send_result_to_admin(job_description, resume_info, percentage ,entities, personal_info , predicted_category):
    try:
        notification = {

            "job_id": job_description.get("_id"),
            "resume_id": resume_info.get("resume_id"),
            "personal_info": personal_info,
            "match_percentage": percentage,
            "resume_entities": entities,
            "Predicted_category": predicted_category,
            "timestamp": datetime.now(),
        }
        valid_user_collection.insert_one(notification)
        print("Result successfully sent to admin dashboard.")
    except Exception as e:
        print(f"Error notifying admin: {e}")