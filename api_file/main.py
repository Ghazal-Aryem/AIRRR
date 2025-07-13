from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
import  os
from fastapi.middleware.cors import CORSMiddleware
from api.jobs import router as jobs_router
from api.resume import router as resumes_router
from api.metrics import router as metrics_router
from api.candidate_selection import router as candidate_selection_router
from api.extract_resume_infor import router as extract_resume_infor_router
from api.category_predict import router as category_predict_router
from api.get_select_user import router as get_select_user_router
from api.matching import router as match_resumes
from api.adminlogin import router as adminlogin_router
from api.userLogin import router as userlogin_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SESSION_SECRET_KEY = os.getenv("SECRET_KEY")
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET_KEY
)

# Include routers
app.include_router(adminlogin_router, prefix="/api/adminValidation", tags=["adminlogin"])
app.include_router(userlogin_router, prefix="/api/userValidation", tags=["userlogin"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(resumes_router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(metrics_router, prefix="/api/metrics", tags=["Metrics"])
app.include_router(candidate_selection_router, prefix="/api/candidate_selection", tags=["candidate_selection"])
app.include_router(category_predict_router, prefix="/api/category_predict", tags=["category_predict"])
app.include_router(extract_resume_infor_router, prefix="/api/extract_resume_infor", tags=["extract_resume_infor"])
app.include_router(get_select_user_router, prefix="/api/get_select_user", tags=["get_select_user"])
app.include_router(match_resumes, prefix="/api", tags=["get_select_user"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)