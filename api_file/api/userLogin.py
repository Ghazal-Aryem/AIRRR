from fastapi import FastAPI, Depends, HTTPException, Request, APIRouter
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, EmailStr, validator
from db.connection import user_collection , google , config
from bson import  ObjectId
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
# User Signup and Login Schema
class User(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

router = APIRouter()

@router.post("/user/signup")
async def user_signup(user: User ):
    print(user.dict())
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists. Please log in.")

    # Store user in MongoDB
    user_collection.insert_one(user.dict())
    return {"message": "User registered successfully" }


# User Login
@router.post("/user/login")
async def user_login(login: LoginRequest , request: Request):

    user = await user_collection.find_one({"email": login.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password.")
    if user["password"] != login.password:
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    request.session["user_id"] = str(user["_id"])
    return {"message": "Login successful", "user": {"name": user["name"], "email": user["email"]}}

@router.get("/debug-session")
async def debug_session(request: Request):
    return {"session_user_id": request.session.get("user_id")}

@router.get("/googlelogin")
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    return await google.authorize_redirect(request, redirect_uri)


# Google OAuth Callback
@router.get("/auth")
async def auth(request: Request):
    try:
        token = await google.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authorization error: {str(e)}")

    userinfo = token.get('userinfo')
    if not userinfo:
        raise HTTPException(status_code=400, detail="Failed to fetch user information from Google.")

    # Await the find_one call to fetch existing user
    existing_user = await user_collection.find_one({"email": userinfo["email"]})

    if existing_user:
        print(existing_user)
        request.session["user_id"] = str(existing_user["_id"])
        return RedirectResponse(url=f"http://localhost:5173/Userr")


    # Prepare and insert user data
    user_data = {
        "name": userinfo["name"],
        "email": userinfo["email"],
        "google_id": userinfo["sub"],
    }
    insert_result = await user_collection.insert_one(user_data)  # Await the insert operation
    user_data["_id"] = str(insert_result.inserted_id)
    request.session["user_id"] = str(user_data["_id"])
    # return JSONResponse(content={"message": "User logged in successfully", "user": user_data})
    return RedirectResponse(url=f"http://localhost:5173/Userr")


# Logout Endpoint
@router.get("/logout")
async def logout(request: Request):
    request.session.pop("user", None)
    return {"message": "Logged out successfully"}

# Get Current User Session
@router.get("/get_user")
async def get_user(request: Request):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in.")
    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    user['_id'] = str(user['_id'])
    return {"user": user}
