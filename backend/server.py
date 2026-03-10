from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'avantra2024')
JWT_SECRET = os.environ.get('JWT_SECRET', 'avantra-jwt-secret-2024')

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
    return {
        "products": product_count,
        "dealers": 70,
        "farmers_served": 12000,
        "acres_covered": 30000,
        "team_members": 18,
        "licenses": 64
    }


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
