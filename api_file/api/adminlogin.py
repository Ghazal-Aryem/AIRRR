from fastapi import FastAPI, APIRouter,HTTPException
from pydantic import BaseModel
from db.connection import admin_collection

router = APIRouter()

class Admin(BaseModel):
    unique_key: str
    password: str

#login
@router.post("/admlogin")
async def admin_login(admin: Admin):

    existing_admin = await admin_collection.find_one({"unique_key": admin.unique_key})
    if not existing_admin:
        raise HTTPException(status_code=400, detail="Admin not found")
    # Compare plain-text passwords
    if admin.password != existing_admin["password"]:
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {"success": True, "message": "Loginsuccessful"}