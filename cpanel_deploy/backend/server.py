from fastapi import FastAPI, HTTPException, Depends, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import jwt
import os
import json
import re

from models import (
    Base, Product, Contact, Dealer, GalleryItem, BlogPost, 
    VideoTestimonial, Job, JobApplication, SiteSettings,
    create_tables, get_db_url
)

app = FastAPI(title="Avantra Chemicals API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config file path
CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'config.json')
INSTALLED_FILE = os.path.join(os.path.dirname(__file__), '.installed')

# Global DB session
SessionLocal = None
engine = None

def load_config():
    """Load database config from file"""
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    return None

def init_database():
    """Initialize database connection"""
    global SessionLocal, engine
    config = load_config()
    if config:
        db_url = get_db_url(
            config['db_host'],
            config['db_user'],
            config['db_password'],
            config['db_name'],
            config.get('db_port', 3306)
        )
        engine = create_engine(db_url, pool_pre_ping=True)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        return True
    return False

def get_db():
    """Get database session"""
    if SessionLocal is None:
        if not init_database():
            raise HTTPException(status_code=503, detail="Database not configured. Please run installer.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def is_installed():
    """Check if app is installed"""
    return os.path.exists(INSTALLED_FILE) and os.path.exists(CONFIG_FILE)

# --- Pydantic Models ---
class InstallRequest(BaseModel):
    site_url: str
    db_host: str
    db_name: str
    db_user: str
    db_password: str
    db_port: int = 3306
    admin_password: str

class AdminLogin(BaseModel):
    password: str

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
    manual_url: str = ""
    leaflet_url: str = ""
    brand: str = ""
    crops: str = ""

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    message: str = ""

class DealerCreate(BaseModel):
    name: str
    business_name: str = ""
    location: str
    phone: str = ""
    email: str = ""
    message: str = ""

class GalleryCreate(BaseModel):
    title: str = ""
    image_url: str
    category: str = "general"

class BlogCreate(BaseModel):
    title: str
    slug: str = ""
    excerpt: str = ""
    content: str = ""
    featured_image_url: str = ""

class VideoCreate(BaseModel):
    title: str = ""
    video_url: str
    thumbnail_url: str = ""
    author: str = ""
    location: str = ""
    description: str = ""

class JobCreate(BaseModel):
    title: str
    department: str = ""
    location: str = ""
    type: str = "Full-time"
    description: str = ""
    requirements: str = ""

class JobApplicationCreate(BaseModel):
    job_id: str
    name: str
    email: str
    phone: str = ""
    resume_url: str = ""
    photo_url: str = ""
    cover_letter: str = ""

class SettingsUpdate(BaseModel):
    logo_url: str = ""
    hero_image_url: str = ""
    address: str = ""
    phone: str = ""
    email: str = ""
    social_links: Dict[str, str] = {}

# Helper functions
def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

def model_to_dict(obj):
    """Convert SQLAlchemy model to dictionary"""
    result = {}
    for column in obj.__table__.columns:
        value = getattr(obj, column.name)
        if isinstance(value, datetime):
            value = value.isoformat()
        result[column.name] = value
    return result

def get_admin_password():
    """Get admin password from config"""
    config = load_config()
    return config.get('admin_password', 'admin123') if config else 'admin123'

def verify_token(token: str):
    try:
        config = load_config()
        secret = config.get('jwt_secret', 'avantra-secret-key') if config else 'avantra-secret-key'
        return jwt.decode(token, secret, algorithms=["HS256"])
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- Installation Endpoint ---
@app.get("/api/install", response_class=HTMLResponse)
async def install_page():
    """Render installation page"""
    if is_installed():
        return HTMLResponse(content="""
        <html>
        <head><title>Already Installed</title>
        <style>body{font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;margin:0;}
        .container{background:white;padding:40px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);text-align:center;max-width:400px;}
        h1{color:#00A651;margin-bottom:20px;}
        a{display:inline-block;padding:12px 24px;background:#00A651;color:white;text-decoration:none;border-radius:4px;margin-top:20px;}
        </style></head>
        <body><div class="container">
        <h1>Already Installed!</h1>
        <p>Avantra Chemicals website is already installed and configured.</p>
        <a href="/">Go to Website</a>
        </div></body></html>
        """)
    
    return HTMLResponse(content="""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install Avantra Chemicals</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #0d3d2a 0%, #000 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .installer {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 100%;
            overflow: hidden;
        }
        .installer-header {
            background: #000;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .installer-header h1 {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .installer-header p {
            opacity: 0.7;
            font-size: 14px;
        }
        .installer-body {
            padding: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
            font-size: 14px;
        }
        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #00A651;
        }
        .form-group small {
            display: block;
            margin-top: 4px;
            color: #888;
            font-size: 12px;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #00A651;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }
        .btn-install {
            width: 100%;
            padding: 16px;
            background: #00A651;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        .btn-install:hover {
            background: #008f45;
        }
        .btn-install:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .alert {
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .alert-error {
            background: #fee;
            color: #c00;
            border: 1px solid #fcc;
        }
        .alert-success {
            background: #efe;
            color: #060;
            border: 1px solid #cfc;
        }
        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f0f0f0;
            border-top-color: #00A651;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="installer">
        <div class="installer-header">
            <h1>Avantra Chemicals</h1>
            <p>Website Installation Wizard</p>
        </div>
        <div class="installer-body">
            <div id="alert" class="alert" style="display:none;"></div>
            
            <form id="installForm">
                <div class="section-title">Site Configuration</div>
                
                <div class="form-group">
                    <label>Site URL</label>
                    <input type="url" name="site_url" required placeholder="https://avantra.co" value="https://avantra.co">
                    <small>Your website URL (without trailing slash)</small>
                </div>
                
                <div class="section-title">MySQL Database</div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Database Host</label>
                        <input type="text" name="db_host" required placeholder="localhost" value="localhost">
                    </div>
                    <div class="form-group">
                        <label>Port</label>
                        <input type="number" name="db_port" value="3306">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Database Name</label>
                    <input type="text" name="db_name" required placeholder="avantra_db">
                    <small>Database must already exist</small>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Database Username</label>
                        <input type="text" name="db_user" required placeholder="root">
                    </div>
                    <div class="form-group">
                        <label>Database Password</label>
                        <input type="password" name="db_password" placeholder="••••••••">
                    </div>
                </div>
                
                <div class="section-title">Admin Account</div>
                
                <div class="form-group">
                    <label>Admin Password</label>
                    <input type="password" name="admin_password" required placeholder="Choose a strong password" minlength="6">
                    <small>Used to access the admin panel</small>
                </div>
                
                <button type="submit" class="btn-install" id="submitBtn">
                    Install Avantra Chemicals
                </button>
            </form>
            
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Installing... Please wait.</p>
            </div>
        </div>
    </div>
    
    <script>
        const form = document.getElementById('installForm');
        const alert = document.getElementById('alert');
        const loading = document.getElementById('loading');
        const submitBtn = document.getElementById('submitBtn');
        
        function showAlert(message, type) {
            alert.textContent = message;
            alert.className = 'alert alert-' + type;
            alert.style.display = 'block';
        }
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            data.db_port = parseInt(data.db_port) || 3306;
            
            form.style.display = 'none';
            loading.style.display = 'block';
            alert.style.display = 'none';
            
            try {
                const response = await fetch('/api/install', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showAlert('Installation successful! Redirecting...', 'success');
                    loading.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    throw new Error(result.detail || 'Installation failed');
                }
            } catch (error) {
                form.style.display = 'block';
                loading.style.display = 'none';
                showAlert(error.message, 'error');
            }
        });
    </script>
</body>
</html>
    """)

@app.post("/api/install")
async def run_install(data: InstallRequest):
    """Run installation"""
    if is_installed():
        raise HTTPException(status_code=400, detail="Already installed")
    
    try:
        # Test database connection
        db_url = get_db_url(data.db_host, data.db_user, data.db_password, data.db_name, data.db_port)
        test_engine = create_engine(db_url, pool_pre_ping=True)
        
        # Create tables
        create_tables(test_engine)
        
        # Create session and add default settings
        TestSession = sessionmaker(bind=test_engine)
        session = TestSession()
        
        # Check if settings exist
        settings = session.query(SiteSettings).first()
        if not settings:
            settings = SiteSettings(
                logo_url='',
                address='Avantra Chemicals Pvt Ltd, Hyderabad, Telangana, India',
                phone='+91 98765 43210',
                email='info@avantra.co',
                social_links={}
            )
            session.add(settings)
            session.commit()
        
        session.close()
        test_engine.dispose()
        
        # Save config
        import secrets
        config = {
            'site_url': data.site_url.rstrip('/'),
            'db_host': data.db_host,
            'db_name': data.db_name,
            'db_user': data.db_user,
            'db_password': data.db_password,
            'db_port': data.db_port,
            'admin_password': data.admin_password,
            'jwt_secret': secrets.token_hex(32)
        }
        
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f)
        
        # Create installed flag
        with open(INSTALLED_FILE, 'w') as f:
            f.write(datetime.now(timezone.utc).isoformat())
        
        # Initialize database
        init_database()
        
        return {"success": True, "message": "Installation completed successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Installation failed: {str(e)}")

# --- API Routes ---
@app.get("/api/")
async def api_root():
    if not is_installed():
        return {"message": "Not installed", "install_url": "/install"}
    return {"message": "Avantra Chemicals API", "version": "2.0"}

@app.post("/api/admin/login")
async def admin_login(data: AdminLogin):
    if data.password != get_admin_password():
        raise HTTPException(status_code=401, detail="Invalid password")
    config = load_config()
    secret = config.get('jwt_secret', 'avantra-secret-key') if config else 'avantra-secret-key'
    token = jwt.encode({"admin": True}, secret, algorithm="HS256")
    return {"token": token}

# --- Products ---
@app.get("/api/products")
async def list_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    if featured:
        query = query.filter(Product.featured == True)
    products = query.all()
    return [model_to_dict(p) for p in products]

@app.get("/api/products/{slug}")
async def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return model_to_dict(product)

@app.post("/api/products")
async def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    slug = product.slug or slugify(product.name)
    existing = db.query(Product).filter(Product.slug == slug).first()
    if existing:
        slug = f"{slug}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    db_product = Product(
        name=product.name,
        slug=slug,
        category=product.category,
        brand=product.brand,
        image_url=product.image_url,
        tagline=product.tagline,
        overview=product.overview,
        composition=product.composition,
        how_it_works=product.how_it_works,
        growth_stages=product.growth_stages,
        dosage=product.dosage,
        advantages=product.advantages,
        crops=product.crops,
        manual_url=product.manual_url,
        leaflet_url=product.leaflet_url,
        featured=product.featured
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return model_to_dict(db_product)

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product.dict().items():
        if key != 'slug' or value:
            setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return model_to_dict(db_product)

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"deleted": True}

# --- Contact ---
@app.post("/api/contact")
async def submit_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    return {"success": True}

@app.get("/api/contact")
async def list_contacts(db: Session = Depends(get_db)):
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()
    return [model_to_dict(c) for c in contacts]

# --- Dealers ---
@app.get("/api/dealers")
async def list_dealers(db: Session = Depends(get_db)):
    dealers = db.query(Dealer).filter(Dealer.is_approved == True).all()
    return [model_to_dict(d) for d in dealers]

@app.post("/api/dealers")
async def apply_dealer(dealer: DealerCreate, db: Session = Depends(get_db)):
    db_dealer = Dealer(**dealer.dict())
    db.add(db_dealer)
    db.commit()
    return {"success": True}

@app.get("/api/dealers/applications")
async def list_dealer_applications(db: Session = Depends(get_db)):
    dealers = db.query(Dealer).order_by(Dealer.created_at.desc()).all()
    return [model_to_dict(d) for d in dealers]

@app.put("/api/dealers/{dealer_id}/approve")
async def approve_dealer(dealer_id: str, db: Session = Depends(get_db)):
    dealer = db.query(Dealer).filter(Dealer.id == dealer_id).first()
    if not dealer:
        raise HTTPException(status_code=404, detail="Dealer not found")
    dealer.is_approved = True
    dealer.status = 'approved'
    db.commit()
    return {"success": True}

# --- Gallery ---
@app.get("/api/gallery")
async def list_gallery(db: Session = Depends(get_db)):
    items = db.query(GalleryItem).order_by(GalleryItem.order).all()
    return [model_to_dict(i) for i in items]

@app.post("/api/gallery")
async def add_gallery(item: GalleryCreate, db: Session = Depends(get_db)):
    db_item = GalleryItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return model_to_dict(db_item)

@app.delete("/api/gallery/{item_id}")
async def delete_gallery(item_id: str, db: Session = Depends(get_db)):
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"deleted": True}

# --- Blog ---
@app.get("/api/blog")
async def list_blog(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(BlogPost.published == True).order_by(BlogPost.created_at.desc()).all()
    return [model_to_dict(p) for p in posts]

@app.get("/api/blog/{post_id}")
async def get_blog_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return model_to_dict(post)

@app.post("/api/blog")
async def create_blog(post: BlogCreate, db: Session = Depends(get_db)):
    slug = post.slug or slugify(post.title)
    db_post = BlogPost(
        title=post.title,
        slug=slug,
        excerpt=post.excerpt,
        content=post.content,
        featured_image_url=post.featured_image_url
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return model_to_dict(db_post)

@app.delete("/api/blog/{post_id}")
async def delete_blog(post_id: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if post:
        db.delete(post)
        db.commit()
    return {"deleted": True}

# --- Videos ---
@app.get("/api/videos")
async def list_videos(db: Session = Depends(get_db)):
    videos = db.query(VideoTestimonial).order_by(VideoTestimonial.order).all()
    return [model_to_dict(v) for v in videos]

@app.post("/api/videos")
async def add_video(video: VideoCreate, db: Session = Depends(get_db)):
    db_video = VideoTestimonial(**video.dict())
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return model_to_dict(db_video)

@app.delete("/api/videos/{video_id}")
async def delete_video(video_id: str, db: Session = Depends(get_db)):
    video = db.query(VideoTestimonial).filter(VideoTestimonial.id == video_id).first()
    if video:
        db.delete(video)
        db.commit()
    return {"deleted": True}

# --- Jobs ---
@app.get("/api/jobs")
async def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.active == True).all()
    return [model_to_dict(j) for j in jobs]

@app.post("/api/jobs")
async def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return model_to_dict(db_job)

@app.delete("/api/jobs/{job_id}")
async def delete_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job:
        db.delete(job)
        db.commit()
    return {"deleted": True}

# --- Job Applications ---
@app.get("/api/job-applications")
async def list_applications(db: Session = Depends(get_db)):
    apps = db.query(JobApplication).order_by(JobApplication.created_at.desc()).all()
    return [model_to_dict(a) for a in apps]

@app.post("/api/job-applications")
async def submit_application(app: JobApplicationCreate, db: Session = Depends(get_db)):
    db_app = JobApplication(**app.dict())
    db.add(db_app)
    db.commit()
    return {"success": True}

# --- Settings ---
@app.get("/api/settings")
async def get_settings(db: Session = Depends(get_db)):
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return model_to_dict(settings)

@app.put("/api/settings")
async def update_settings(data: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
    
    for key, value in data.dict().items():
        setattr(settings, key, value)
    
    settings.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(settings)
    return model_to_dict(settings)

# --- Stats ---
@app.get("/api/stats")
async def get_stats(db: Session = Depends(get_db)):
    product_count = db.query(Product).count()
    dealer_count = db.query(Dealer).filter(Dealer.is_approved == True).count()
    return {
        "products": product_count,
        "dealers": dealer_count,
        "farmers": "12000",
        "states": "10"
    }
