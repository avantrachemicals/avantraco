from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
import base64
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'avantra2024')
JWT_SECRET = os.environ.get('JWT_SECRET', 'avantra-jwt-secret-2024')

# File storage directory
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")


# --- Models ---
class ProductCreate(BaseModel):
    name: str
    slug: str = ""
    category: str
    image_url: str = ""
    tagline: Dict[str, str] = {}
    overview: Dict[str, str] = {}
    composition: List[Dict[str, str]] = []
    how_it_works: Dict[str, List[str]] = {}
    growth_stages: Dict[str, List[str]] = {}
    dosage: Dict[str, str] = {}
    advantages: Dict[str, List[str]] = {}
    featured: bool = False


class ContactCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    message: str
    language: str = "en"


class DealerAppCreate(BaseModel):
    name: str
    business_name: str = ""
    email: str
    phone: str
    location: str
    message: str = ""


class AdminLogin(BaseModel):
    password: str


# --- Site Settings Model ---
class SiteSettingsUpdate(BaseModel):
    hero_image: Optional[str] = None
    logo_url: Optional[str] = None
    about_image: Optional[str] = None
    phytocode_image: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None


# --- Job Model ---
class JobCreate(BaseModel):
    title: str
    department: str = ""
    location: str = ""
    type: str = "Full-time"  # Full-time, Part-time, Contract
    experience: str = ""
    description: str = ""
    requirements: List[str] = []
    responsibilities: List[str] = []
    salary_range: str = ""
    is_active: bool = True


# --- Job Application Model ---
class JobApplicationCreate(BaseModel):
    job_id: str
    name: str
    email: str
    phone: str
    address: str = ""
    current_company: str = ""
    current_ctc: str = ""
    photo_base64: Optional[str] = None
    resume_base64: Optional[str] = None
    payslip_base64: Optional[str] = None


# --- Gallery Image Model ---
class GalleryImageCreate(BaseModel):
    title: str = ""
    description: str = ""
    image_url: str
    category: str = "general"  # general, factory, team, events, products
    is_featured: bool = False


# --- Blog Post Model ---
class BlogPostCreate(BaseModel):
    title: str
    slug: str = ""
    featured_image: str = ""
    excerpt: str = ""
    content: str = ""
    links: List[Dict[str, str]] = []  # [{title, url}]
    is_published: bool = True
    tags: List[str] = []


# --- Video Testimonial Model ---
class VideoTestimonialCreate(BaseModel):
    title: str
    farmer_name: str
    location: str = ""
    crop: str = ""
    video_url: str  # YouTube/Vimeo embed URL or direct video URL
    thumbnail_url: str = ""
    quote: str = ""
    is_featured: bool = False


# --- Auth ---
def create_token(data: dict):
    payload = {**data, "exp": datetime.now(timezone.utc) + timedelta(hours=24)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


async def verify_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        jwt.decode(authorization.split(" ")[1], JWT_SECRET, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# --- Admin ---
@api_router.post("/admin/login")
async def admin_login(data: AdminLogin):
    if data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": create_token({"role": "admin"})}


# --- Products ---
@api_router.get("/products")
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products


@api_router.get("/products/{slug}")
async def get_product(slug: str):
    product = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@api_router.post("/products")
async def create_product(data: ProductCreate, _=Depends(verify_admin)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["slug"] = doc["slug"] or doc["name"].lower().replace(" ", "-").replace("(", "").replace(")", "")
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.products.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.put("/products/{product_id}")
async def update_product(product_id: str, data: ProductCreate, _=Depends(verify_admin)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, _=Depends(verify_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}


# --- Contact ---
@api_router.post("/contact")
async def submit_contact(data: ContactCreate):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contacts.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.get("/contact")
async def list_contacts(_=Depends(verify_admin)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return contacts


# --- Dealers ---
@api_router.post("/dealers/apply")
async def submit_dealer_app(data: DealerAppCreate):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.dealer_applications.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.get("/dealers/applications")
async def list_dealer_apps(_=Depends(verify_admin)):
    apps = await db.dealer_applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return apps


# --- Stats ---
@api_router.get("/stats")
async def get_stats():
    product_count = await db.products.count_documents({})
    job_count = await db.jobs.count_documents({"is_active": True})
    return {
        "products": product_count,
        "dealers": 70,
        "farmers_served": 12000,
        "acres_covered": 30000,
        "team_members": 18,
        "licenses": 64,
        "open_positions": job_count
    }


# --- Site Settings ---
DEFAULT_SETTINGS = {
    "hero_image": "https://images.unsplash.com/photo-1757031298556-c0c5c4b01e64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxyb3clMjBjcm9wcyUyMGFncmljdWx0dXJlJTIwZmllbGQlMjBncmVlbnxlbnwwfHx8fDE3NzMxNDQ1NjR8MA&ixlib=rb-4.1.0&q=85",
    "logo_url": "",
    "about_image": "https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBpbiUyMGZpZWxkJTIwc21pbGluZ3xlbnwwfHx8fDE3NzMxNDQ1MTl8MA&ixlib=rb-4.1.0&q=85",
    "phytocode_image": "https://images.unsplash.com/photo-1720202194910-75fd3bc2b820?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHRpc3N1ZSUyMGN1bHR1cmUlMjB0ZXN0JTIwdHViZSUyMGxhYm9yYXRvcnklMjBzY2llbmNlfGVufDB8fHx8MTc3MzE0NDQ1MTJ8MA&ixlib=rb-4.1.0&q=85",
    "social_links": {
        "youtube": "",
        "twitter": "",
        "instagram": "",
        "facebook": "",
        "linkedin": ""
    }
}


@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"type": "site"}, {"_id": 0})
    if not settings:
        return DEFAULT_SETTINGS
    return {**DEFAULT_SETTINGS, **settings}


@api_router.put("/settings")
async def update_settings(data: SiteSettingsUpdate, _=Depends(verify_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["type"] = "site"
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.settings.update_one({"type": "site"}, {"$set": update_data}, upsert=True)
    return await get_settings()


# --- Jobs ---
@api_router.get("/jobs")
async def list_jobs(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    jobs = await db.jobs.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return jobs


@api_router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@api_router.post("/jobs")
async def create_job(data: JobCreate, _=Depends(verify_admin)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.jobs.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.put("/jobs/{job_id}")
async def update_job(job_id: str, data: JobCreate, _=Depends(verify_admin)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.jobs.update_one({"id": job_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return await db.jobs.find_one({"id": job_id}, {"_id": 0})


@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, _=Depends(verify_admin)):
    result = await db.jobs.delete_one({"id": job_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted"}


# --- Job Applications ---
@api_router.post("/jobs/apply")
async def submit_job_application(data: JobApplicationCreate):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    
    # Get job title for reference
    job = await db.jobs.find_one({"id": data.job_id}, {"title": 1})
    doc["job_title"] = job.get("title", "Unknown") if job else "Unknown"
    
    await db.job_applications.insert_one(doc)
    return {"id": doc["id"], "message": "Application submitted successfully"}


@api_router.get("/jobs/applications/list")
async def list_job_applications(_=Depends(verify_admin)):
    apps = await db.job_applications.find({}, {"_id": 0, "photo_base64": 0, "resume_base64": 0, "payslip_base64": 0}).sort("created_at", -1).to_list(1000)
    return apps


@api_router.get("/jobs/applications/{app_id}")
async def get_job_application(app_id: str, _=Depends(verify_admin)):
    app = await db.job_applications.find_one({"id": app_id}, {"_id": 0})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@api_router.put("/jobs/applications/{app_id}/status")
async def update_application_status(app_id: str, status: str, _=Depends(verify_admin)):
    result = await db.job_applications.update_one(
        {"id": app_id}, 
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": f"Status updated to {status}"}


# --- Gallery ---
@api_router.get("/gallery")
async def list_gallery_images(category: Optional[str] = None):
    query = {} if not category or category == "all" else {"category": category}
    images = await db.gallery.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return images


@api_router.post("/gallery")
async def create_gallery_image(data: GalleryImageCreate, _=Depends(verify_admin)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.gallery.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.put("/gallery/{image_id}")
async def update_gallery_image(image_id: str, data: GalleryImageCreate, _=Depends(verify_admin)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.gallery.update_one({"id": image_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return await db.gallery.find_one({"id": image_id}, {"_id": 0})


@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, _=Depends(verify_admin)):
    result = await db.gallery.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}


# --- Blog Posts (Media Center) ---
@api_router.get("/blog")
async def list_blog_posts(published_only: bool = True):
    query = {"is_published": True} if published_only else {}
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return posts


@api_router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@api_router.post("/blog")
async def create_blog_post(data: BlogPostCreate, _=Depends(verify_admin)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["slug"] = doc["slug"] or doc["title"].lower().replace(" ", "-").replace("'", "")[:50]
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["updated_at"] = doc["created_at"]
    await db.blog_posts.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.put("/blog/{post_id}")
async def update_blog_post(post_id: str, data: BlogPostCreate, _=Depends(verify_admin)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return await db.blog_posts.find_one({"id": post_id}, {"_id": 0})


@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, _=Depends(verify_admin)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted"}


# --- Video Testimonials ---
@api_router.get("/testimonials/videos")
async def list_video_testimonials(featured_only: bool = False):
    query = {"is_featured": True} if featured_only else {}
    videos = await db.video_testimonials.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return videos


@api_router.post("/testimonials/videos")
async def create_video_testimonial(data: VideoTestimonialCreate, _=Depends(verify_admin)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.video_testimonials.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.put("/testimonials/videos/{video_id}")
async def update_video_testimonial(video_id: str, data: VideoTestimonialCreate, _=Depends(verify_admin)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.video_testimonials.update_one({"id": video_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return await db.video_testimonials.find_one({"id": video_id}, {"_id": 0})


@api_router.delete("/testimonials/videos/{video_id}")
async def delete_video_testimonial(video_id: str, _=Depends(verify_admin)):
    result = await db.video_testimonials.delete_one({"id": video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Video deleted"}


# --- Seed ---
@api_router.post("/seed")
async def seed_data():
    existing = await db.products.count_documents({})
    if existing > 0:
        return {"message": f"Database already has {existing} products. Delete all first to re-seed."}
    from seed_data import PRODUCTS
    for product in PRODUCTS:
        await db.products.insert_one({**product})
    return {"message": f"Seeded {len(PRODUCTS)} products successfully"}


@api_router.get("/")
async def root():
    return {"message": "Avantra Chemicals API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
