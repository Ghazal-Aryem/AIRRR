from fastapi import APIRouter
from db.connection import resume_collection, jd_collection , user_collection , valid_user_collection , stats_collection
from datetime import datetime, timedelta
from utils.serialize import serialize_document
router = APIRouter()
@router.get("/metrics")
async def get_metrics():
    # Get the count of documents in each collection
    resume_counts = await resume_collection.count_documents({})
    jd_counts =await jd_collection.count_documents({})
    user_counts =await user_collection.count_documents({})
    valid_user_count =await valid_user_collection.count_documents({})

    # Return the counts in a dictionary so FastAPI can serialize it to JSON
    return {
        "resume_counts": resume_counts,
        "jd_counts": jd_counts,
        "user_counts": user_counts,
        "valid_user_count": valid_user_count,
    }


@router.post("/page_views")
async def track_page_view():

    try:
        today = datetime.utcnow().strftime("%Y-%m-%d")  # Format: YYYY-MM-DD
        result = await stats_collection.update_one(
            {"date": today},
            {"$inc": {"count": 1}},
            upsert=True
        )
        return {"message": "Page view tracked successfully.", "result":  serialize_document(result.raw_result)}
    except Exception as e:
        return {"error": str(e)}


@router.get("/stats")
async def get_page_view_stats():

    try:
        today = datetime.utcnow()
        week_ago = today - timedelta(days=7)

        # Aggregate page views for the last 7 days
        cursor = stats_collection.aggregate([
            {
                "$match": {
                    "date": {"$gte": week_ago.strftime("%Y-%m-%d")}
                }
            },
            {
                "$sort": {"date": 1}  # Sort by date
            },
            {
                "$project": {
                    "_id": 0,
                    "date": 1,
                    "count": 1
                }
            }
        ])

        stats = await cursor.to_list(length=None)
        return {"stats": serialize_document(stats)}
    except Exception as e:
        return {"error": str(e)}