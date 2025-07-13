from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
import boto3
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from pymongo import MongoClient
# Load environment variables from .env file
load_dotenv()

# Environment variables
MONGO_URI = os.getenv("MONGO_URI")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")

# Initialize MongoDB client
mongo_client = AsyncIOMotorClient(MONGO_URI)
db = mongo_client["descriptions"]

jd_collection = db.get_collection('jd')
resume_collection = db.get_collection('resumes-info')
user_collection = db.get_collection('users')
admin_collection = db.get_collection('admins')
valid_user_collection = db.get_collection('admin_Dashboard')
stats_collection = db.get_collection('page_views')
# Initialize AWS S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)
CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
# OAuth Setup
config = Config(environ={})
oauth = OAuth(config)
google = oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    client_kwargs={
        'scope': 'openid email profile',
    }
)