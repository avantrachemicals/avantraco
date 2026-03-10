from fastapi import FastAPI, HTTPException, Depends, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
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
    PageContent, CategoryContent, UILabel,
    create_tables, get_db_url,
    get_default_page_content, get_default_categories, get_default_ui_labels
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

CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'config.json')
INSTALLED_FILE = os.path.join(os.path.dirname(__file__), '.installed')

SessionLocal = None
engine = None

def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    return None

def init_database():
    global SessionLocal, engine
    config = load_config()
    if config:
        db_url = get_db_url(config['db_host'], config['db_user'], config['db_password'], config['db_name'], config.get('db_port', 3306))
        engine = create_engine(db_url, pool_pre_ping=True)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        return True
    return False

def get_db():
    if SessionLocal is None:
        if not init_database():
            # Return None to indicate no DB - endpoints will handle gracefully
            yield None
            return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def is_installed():
    return os.path.exists(INSTALLED_FILE) and os.path.exists(CONFIG_FILE)

def get_admin_password():
    config = load_config()
    return config.get('admin_password', 'admin123') if config else 'admin123'

def verify_token(token: str):
    try:
        config = load_config()
        secret = config.get('jwt_secret', 'avantra-secret-key') if config else 'avantra-secret-key'
        return jwt.decode(token, secret, algorithms=["HS256"])
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

def model_to_dict(obj):
    result = {}
    for column in obj.__table__.columns:
        value = getattr(obj, column.name)
        if isinstance(value, datetime):
            value = value.isoformat()
        result[column.name] = value
    return result

# ============================================
# PYDANTIC MODELS
# ============================================
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
    name: Dict[str, str] = {}
    slug: str = ""
    category: str
    brand: Dict[str, str] = {}
    image_url: str = ""
    tagline: Dict[str, str] = {}
    overview: Dict[str, str] = {}
    composition: List[Any] = []
    how_it_works: Dict[str, List[str]] = {}
    growth_stages: Dict[str, List[str]] = {}
    dosage: Dict[str, str] = {}
    advantages: Dict[str, List[str]] = {}
    crops: Dict[str, str] = {}
    manual_url: str = ""
    leaflet_url: str = ""
    featured: bool = False
    seo_title: Dict[str, str] = {}
    seo_description: Dict[str, str] = {}
    seo_keywords: Dict[str, str] = {}
    og_image: str = ""

class PageContentUpdate(BaseModel):
    content: Dict[str, Any] = {}
    seo: Dict[str, Any] = {}

class CategoryUpdate(BaseModel):
    name: Dict[str, str] = {}
    description: Dict[str, str] = {}
    image_url: str = ""
    order: int = 0

class UILabelUpdate(BaseModel):
    text: Dict[str, str] = {}
    category: str = "general"

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
    title: Dict[str, str] = {}
    image_url: str
    category: str = "general"

class BlogCreate(BaseModel):
    title: Dict[str, str] = {}
    slug: str = ""
    excerpt: Dict[str, str] = {}
    content: Dict[str, str] = {}
    featured_image_url: str = ""
    seo_title: Dict[str, str] = {}
    seo_description: Dict[str, str] = {}
    seo_keywords: Dict[str, str] = {}
    og_image: str = ""

class VideoCreate(BaseModel):
    title: Dict[str, str] = {}
    video_url: str
    thumbnail_url: str = ""
    author: str = ""
    location: Dict[str, str] = {}
    description: Dict[str, str] = {}

class JobCreate(BaseModel):
    title: Dict[str, str] = {}
    department: Dict[str, str] = {}
    location: Dict[str, str] = {}
    type: str = "Full-time"
    description: Dict[str, str] = {}
    requirements: Dict[str, str] = {}
    seo_title: Dict[str, str] = {}
    seo_description: Dict[str, str] = {}

class SettingsUpdate(BaseModel):
    logo_url: str = ""
    favicon_url: str = ""
    site_name: Dict[str, str] = {}
    tagline: Dict[str, str] = {}
    address: Dict[str, str] = {}
    phone: str = ""
    email: str = ""
    social_links: Dict[str, str] = {}
    default_seo_title: Dict[str, str] = {}
    default_seo_description: Dict[str, str] = {}
    default_seo_keywords: Dict[str, str] = {}
    og_image: str = ""
    google_analytics: str = ""

# ============================================
# INSTALLATION
# ============================================
@app.get("/api/install", response_class=HTMLResponse)
async def install_page():
    if is_installed():
        return HTMLResponse(content="""
        <html><head><title>Already Installed</title>
        <style>body{font-family:Arial;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;margin:0;}
        .container{background:white;padding:40px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);text-align:center;max-width:400px;}
        h1{color:#00A651;}a{display:inline-block;padding:12px 24px;background:#00A651;color:white;text-decoration:none;border-radius:4px;margin-top:20px;}
        </style></head><body><div class="container"><h1>Already Installed!</h1><p>Avantra Chemicals is already configured.</p><a href="/">Go to Website</a></div></body></html>
        """)
    
    return HTMLResponse(content="""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install Avantra Chemicals</title>
    <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#0d3d2a 0%,#000 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}
        .installer{background:white;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-width:500px;width:100%;overflow:hidden}
        .installer-header{background:#000;color:white;padding:30px;text-align:center}
        .installer-header h1{font-size:24px;margin-bottom:8px}
        .installer-header p{opacity:0.7;font-size:14px}
        .installer-body{padding:30px}
        .form-group{margin-bottom:20px}
        .form-group label{display:block;font-weight:600;margin-bottom:8px;color:#333;font-size:14px}
        .form-group input{width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:6px;font-size:14px;transition:border-color 0.3s}
        .form-group input:focus{outline:none;border-color:#00A651}
        .form-group small{display:block;margin-top:4px;color:#888;font-size:12px}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .section-title{font-size:14px;font-weight:700;color:#00A651;margin-bottom:15px;padding-bottom:10px;border-bottom:2px solid #f0f0f0}
        .btn-install{width:100%;padding:16px;background:#00A651;color:white;border:none;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;transition:background 0.3s}
        .btn-install:hover{background:#008f45}
        .btn-install:disabled{background:#ccc;cursor:not-allowed}
        .alert{padding:12px 16px;border-radius:6px;margin-bottom:20px;font-size:14px}
        .alert-error{background:#fee;color:#c00;border:1px solid #fcc}
        .alert-success{background:#efe;color:#060;border:1px solid #cfc}
        .loading{display:none;text-align:center;padding:20px}
        .spinner{width:40px;height:40px;border:4px solid #f0f0f0;border-top-color:#00A651;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 15px}
        @keyframes spin{to{transform:rotate(360deg)}}
    </style>
</head>
<body>
    <div class="installer">
        <div class="installer-header"><h1>Avantra Chemicals</h1><p>Website Installation Wizard</p></div>
        <div class="installer-body">
            <div id="alert" class="alert" style="display:none;"></div>
            <form id="installForm">
                <div class="section-title">Site Configuration</div>
                <div class="form-group"><label>Site URL</label><input type="url" name="site_url" required placeholder="https://avantra.co" value="https://avantra.co"><small>Your website URL (without trailing slash)</small></div>
                <div class="section-title">MySQL Database</div>
                <div class="form-row">
                    <div class="form-group"><label>Database Host</label><input type="text" name="db_host" required placeholder="localhost" value="localhost"></div>
                    <div class="form-group"><label>Port</label><input type="number" name="db_port" value="3306"></div>
                </div>
                <div class="form-group"><label>Database Name</label><input type="text" name="db_name" required placeholder="avantra_db"><small>Database must already exist</small></div>
                <div class="form-row">
                    <div class="form-group"><label>Database Username</label><input type="text" name="db_user" required placeholder="root"></div>
                    <div class="form-group"><label>Database Password</label><input type="password" name="db_password" placeholder="••••••••"></div>
                </div>
                <div class="section-title">Admin Account</div>
                <div class="form-group"><label>Admin Password</label><input type="password" name="admin_password" required placeholder="Choose a strong password" minlength="6"><small>Used to access the admin panel</small></div>
                <button type="submit" class="btn-install" id="submitBtn">Install Avantra Chemicals</button>
            </form>
            <div class="loading" id="loading"><div class="spinner"></div><p>Installing... Please wait.</p></div>
        </div>
    </div>
    <script>
        const form=document.getElementById('installForm'),alert=document.getElementById('alert'),loading=document.getElementById('loading');
        function showAlert(m,t){alert.textContent=m;alert.className='alert alert-'+t;alert.style.display='block'}
        form.addEventListener('submit',async(e)=>{
            e.preventDefault();
            const formData=new FormData(form),data=Object.fromEntries(formData);
            data.db_port=parseInt(data.db_port)||3306;
            form.style.display='none';loading.style.display='block';alert.style.display='none';
            try{
                const response=await fetch('/api/install',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
                const result=await response.json();
                if(response.ok){showAlert('Installation successful! Redirecting...','success');loading.style.display='none';setTimeout(()=>{window.location.href='/'},2000)}
                else{throw new Error(result.detail||'Installation failed')}
            }catch(error){form.style.display='block';loading.style.display='none';showAlert(error.message,'error')}
        });
    </script>
</body>
</html>
    """)

@app.post("/api/install")
async def run_install(data: InstallRequest):
    if is_installed():
        raise HTTPException(status_code=400, detail="Already installed")
    
    try:
        db_url = get_db_url(data.db_host, data.db_user, data.db_password, data.db_name, data.db_port)
        test_engine = create_engine(db_url, pool_pre_ping=True)
        create_tables(test_engine)
        
        TestSession = sessionmaker(bind=test_engine)
        session = TestSession()
        
        # Create default settings
        settings = session.query(SiteSettings).first()
        if not settings:
            settings = SiteSettings(
                site_name={"en": "Avantra Chemicals", "hi": "अवंत्रा केमिकल्स", "te": "అవంత్ర కెమికల్స్", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್"},
                tagline={"en": "Bio-Stimulants & Agricultural Products", "hi": "जैव-उत्तेजक और कृषि उत्पाद", "te": "బయో-స్టిమ్యులెంట్స్ & వ్యవసాయ ఉత్పత్తులు", "kn": "ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳು ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳು"},
                address={"en": "Avantra Chemicals Pvt Ltd, Hyderabad, Telangana, India", "hi": "अवंत्रा केमिकल्स प्रा. लि., हैदराबाद, तेलंगाना, भारत", "te": "అవంత్ర కెమికల్స్ ప్రై. లి., హైదరాబాద్, తెలంగాణ, భారతదేశం", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್ ಪ್ರೈ. ಲಿ., ಹೈದರಾಬಾದ್, ತೆಲಂಗಾಣ, ಭಾರತ"},
                phone='+91 98765 43210',
                email='info@avantra.co',
                social_links={}
            )
            session.add(settings)
        
        # Create default page contents
        page_contents = get_default_page_content()
        for page_key, data_dict in page_contents.items():
            existing = session.query(PageContent).filter(PageContent.page_key == page_key).first()
            if not existing:
                pc = PageContent(page_key=page_key, content=data_dict.get('content', {}), seo=data_dict.get('seo', {}))
                session.add(pc)
        
        # Create default categories
        for cat_data in get_default_categories():
            existing = session.query(CategoryContent).filter(CategoryContent.category_key == cat_data['category_key']).first()
            if not existing:
                cat = CategoryContent(**cat_data)
                session.add(cat)
        
        # Create default UI labels
        for label_data in get_default_ui_labels():
            existing = session.query(UILabel).filter(UILabel.label_key == label_data['label_key']).first()
            if not existing:
                label = UILabel(**label_data)
                session.add(label)
        
        session.commit()
        session.close()
        test_engine.dispose()
        
        import secrets
        config = {
            'site_url': data.site_url.rstrip('/'),
            'db_host': data.db_host, 'db_name': data.db_name, 'db_user': data.db_user,
            'db_password': data.db_password, 'db_port': data.db_port,
            'admin_password': data.admin_password, 'jwt_secret': secrets.token_hex(32)
        }
        
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f)
        with open(INSTALLED_FILE, 'w') as f:
            f.write(datetime.now(timezone.utc).isoformat())
        
        init_database()
        return {"success": True, "message": "Installation completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Installation failed: {str(e)}")

# ============================================
# API ROUTES
# ============================================
@app.get("/api/")
async def api_root():
    if not is_installed():
        return {"message": "Not installed", "install_url": "/api/install"}
    return {"message": "Avantra Chemicals API", "version": "3.0"}

@app.post("/api/admin/login")
async def admin_login(data: AdminLogin):
    if data.password != get_admin_password():
        raise HTTPException(status_code=401, detail="Invalid password")
    config = load_config()
    secret = config.get('jwt_secret', 'avantra-secret-key') if config else 'avantra-secret-key'
    token = jwt.encode({"admin": True}, secret, algorithm="HS256")
    return {"token": token}

# ============================================
# PAGE CONTENT
# ============================================
@app.get("/api/pages")
async def list_pages(db: Session = Depends(get_db)):
    if db is None:
        # Return default content when DB not configured
        default_content = get_default_page_content()
        return [{"page_key": k, "content": v.get("content", {}), "seo": v.get("seo", {})} for k, v in default_content.items()]
    pages = db.query(PageContent).all()
    return [model_to_dict(p) for p in pages]

@app.get("/api/pages/{page_key}")
async def get_page(page_key: str, db: Session = Depends(get_db)):
    if db is None:
        default_content = get_default_page_content()
        if page_key in default_content:
            return {"page_key": page_key, "content": default_content[page_key].get("content", {}), "seo": default_content[page_key].get("seo", {})}
        return {"page_key": page_key, "content": {}, "seo": {}}
    page = db.query(PageContent).filter(PageContent.page_key == page_key).first()
    if not page:
        return {"page_key": page_key, "content": {}, "seo": {}}
    return model_to_dict(page)

@app.put("/api/pages/{page_key}")
async def update_page(page_key: str, data: PageContentUpdate, db: Session = Depends(get_db)):
    page = db.query(PageContent).filter(PageContent.page_key == page_key).first()
    if not page:
        page = PageContent(page_key=page_key)
        db.add(page)
    page.content = data.content
    page.seo = data.seo
    page.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(page)
    return model_to_dict(page)

# ============================================
# CATEGORIES
# ============================================
@app.get("/api/categories")
async def list_categories(db: Session = Depends(get_db)):
    if db is None:
        return get_default_categories()
    cats = db.query(CategoryContent).order_by(CategoryContent.order).all()
    if not cats:
        return get_default_categories()
    return [model_to_dict(c) for c in cats]

@app.put("/api/categories/{category_key}")
async def update_category(category_key: str, data: CategoryUpdate, db: Session = Depends(get_db)):
    cat = db.query(CategoryContent).filter(CategoryContent.category_key == category_key).first()
    if not cat:
        cat = CategoryContent(category_key=category_key)
        db.add(cat)
    cat.name = data.name
    cat.description = data.description
    cat.image_url = data.image_url
    cat.order = data.order
    db.commit()
    db.refresh(cat)
    return model_to_dict(cat)

# ============================================
# UI LABELS
# ============================================
@app.get("/api/labels")
async def list_labels(category: Optional[str] = None, db: Session = Depends(get_db)):
    if db is None:
        default_labels = get_default_ui_labels()
        result = {}
        for l in default_labels:
            if category is None or l.get('category') == category:
                result[l['label_key']] = l['text']
        return result
    query = db.query(UILabel)
    if category:
        query = query.filter(UILabel.category == category)
    labels = query.all()
    if not labels:
        default_labels = get_default_ui_labels()
        return {l['label_key']: l['text'] for l in default_labels}
    return {l.label_key: l.text for l in labels}

@app.get("/api/labels/all")
async def list_all_labels(db: Session = Depends(get_db)):
    if db is None:
        return get_default_ui_labels()
    labels = db.query(UILabel).all()
    if not labels:
        return get_default_ui_labels()
    return [model_to_dict(l) for l in labels]

@app.put("/api/labels/{label_key}")
async def update_label(label_key: str, data: UILabelUpdate, db: Session = Depends(get_db)):
    label = db.query(UILabel).filter(UILabel.label_key == label_key).first()
    if not label:
        label = UILabel(label_key=label_key)
        db.add(label)
    label.text = data.text
    label.category = data.category
    db.commit()
    db.refresh(label)
    return model_to_dict(label)

@app.post("/api/labels")
async def create_label(label_key: str, data: UILabelUpdate, db: Session = Depends(get_db)):
    existing = db.query(UILabel).filter(UILabel.label_key == label_key).first()
    if existing:
        raise HTTPException(status_code=400, detail="Label already exists")
    label = UILabel(label_key=label_key, text=data.text, category=data.category)
    db.add(label)
    db.commit()
    db.refresh(label)
    return model_to_dict(label)

# ============================================
# PRODUCTS
# ============================================
@app.get("/api/products")
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None, db: Session = Depends(get_db)):
    if db is None:
        return []  # No products when DB not configured
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    if featured:
        query = query.filter(Product.featured == True)
    products = query.all()
    return [model_to_dict(p) for p in products]

@app.get("/api/products/{slug}")
async def get_product(slug: str, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=404, detail="Product not found")
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return model_to_dict(product)

@app.post("/api/products")
async def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    name_en = product.name.get('en', '') if isinstance(product.name, dict) else str(product.name)
    slug = product.slug or slugify(name_en)
    existing = db.query(Product).filter(Product.slug == slug).first()
    if existing:
        slug = f"{slug}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    db_product = Product(
        name=product.name, slug=slug, category=product.category, brand=product.brand,
        image_url=product.image_url, tagline=product.tagline, overview=product.overview,
        composition=product.composition, how_it_works=product.how_it_works,
        growth_stages=product.growth_stages, dosage=product.dosage, advantages=product.advantages,
        crops=product.crops, manual_url=product.manual_url, leaflet_url=product.leaflet_url,
        featured=product.featured, seo_title=product.seo_title, seo_description=product.seo_description,
        seo_keywords=product.seo_keywords, og_image=product.og_image
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
    if db_product:
        db.delete(db_product)
        db.commit()
    return {"deleted": True}

# ============================================
# CONTACT
# ============================================
@app.post("/api/contact")
async def submit_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    return {"success": True}

@app.get("/api/contact")
async def list_contacts(db: Session = Depends(get_db)):
    if db is None:
        return []
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()
    return [model_to_dict(c) for c in contacts]

# ============================================
# DEALERS
# ============================================
@app.get("/api/dealers")
async def list_dealers(db: Session = Depends(get_db)):
    if db is None:
        return []
    dealers = db.query(Dealer).filter(Dealer.is_approved == True).all()
    return [model_to_dict(d) for d in dealers]

@app.post("/api/dealers")
async def apply_dealer(dealer: DealerCreate, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    db_dealer = Dealer(**dealer.dict())
    db.add(db_dealer)
    db.commit()
    return {"success": True}

@app.get("/api/dealers/applications")
async def list_dealer_applications(db: Session = Depends(get_db)):
    if db is None:
        return []
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

# ============================================
# GALLERY
# ============================================
@app.get("/api/gallery")
async def list_gallery(db: Session = Depends(get_db)):
    if db is None:
        return []
    items = db.query(GalleryItem).order_by(GalleryItem.order).all()
    return [model_to_dict(i) for i in items]

@app.post("/api/gallery")
async def add_gallery(item: GalleryCreate, db: Session = Depends(get_db)):
    db_item = GalleryItem(title=item.title, image_url=item.image_url, category=item.category)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return model_to_dict(db_item)

@app.put("/api/gallery/{item_id}")
async def update_gallery(item_id: str, item: GalleryCreate, db: Session = Depends(get_db)):
    db_item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    db_item.title = item.title
    db_item.image_url = item.image_url
    db_item.category = item.category
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

# ============================================
# BLOG
# ============================================
@app.get("/api/blog")
async def list_blog(db: Session = Depends(get_db)):
    if db is None:
        return []
    posts = db.query(BlogPost).filter(BlogPost.published == True).order_by(BlogPost.created_at.desc()).all()
    return [model_to_dict(p) for p in posts]

@app.get("/api/blog/{post_id}")
async def get_blog_post(post_id: str, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=404, detail="Post not found")
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return model_to_dict(post)

@app.post("/api/blog")
async def create_blog(post: BlogCreate, db: Session = Depends(get_db)):
    title_en = post.title.get('en', '') if isinstance(post.title, dict) else str(post.title)
    slug = post.slug or slugify(title_en)
    db_post = BlogPost(
        title=post.title, slug=slug, excerpt=post.excerpt, content=post.content,
        featured_image_url=post.featured_image_url, seo_title=post.seo_title,
        seo_description=post.seo_description, seo_keywords=post.seo_keywords, og_image=post.og_image
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return model_to_dict(db_post)

@app.put("/api/blog/{post_id}")
async def update_blog(post_id: str, post: BlogCreate, db: Session = Depends(get_db)):
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    for key, value in post.dict().items():
        if key != 'slug' or value:
            setattr(db_post, key, value)
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

# ============================================
# VIDEOS
# ============================================
@app.get("/api/videos")
async def list_videos(db: Session = Depends(get_db)):
    if db is None:
        return []
    videos = db.query(VideoTestimonial).order_by(VideoTestimonial.order).all()
    return [model_to_dict(v) for v in videos]

@app.post("/api/videos")
async def add_video(video: VideoCreate, db: Session = Depends(get_db)):
    db_video = VideoTestimonial(
        title=video.title, video_url=video.video_url, thumbnail_url=video.thumbnail_url,
        author=video.author, location=video.location, description=video.description
    )
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

# ============================================
# JOBS
# ============================================
@app.get("/api/jobs")
async def list_jobs(db: Session = Depends(get_db)):
    if db is None:
        return []
    jobs = db.query(Job).filter(Job.active == True).all()
    return [model_to_dict(j) for j in jobs]

@app.post("/api/jobs")
async def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(
        title=job.title, department=job.department, location=job.location,
        type=job.type, description=job.description, requirements=job.requirements,
        seo_title=job.seo_title, seo_description=job.seo_description
    )
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

# ============================================
# JOB APPLICATIONS
# ============================================
@app.get("/api/job-applications")
async def list_applications(db: Session = Depends(get_db)):
    if db is None:
        return []
    apps = db.query(JobApplication).order_by(JobApplication.created_at.desc()).all()
    return [model_to_dict(a) for a in apps]

@app.post("/api/job-applications")
async def submit_application(name: str, email: str, job_id: str, phone: str = "", resume_url: str = "", photo_url: str = "", cover_letter: str = "", db: Session = Depends(get_db)):
    db_app = JobApplication(job_id=job_id, name=name, email=email, phone=phone, resume_url=resume_url, photo_url=photo_url, cover_letter=cover_letter)
    db.add(db_app)
    db.commit()
    return {"success": True}

# ============================================
# SETTINGS
# ============================================
@app.get("/api/settings")
async def get_settings(db: Session = Depends(get_db)):
    if db is None:
        return {
            "site_name": {"en": "Avantra Chemicals", "hi": "अवंत्रा केमिकल्स", "te": "అవంత్ర కెమికల్స్", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್"},
            "tagline": {"en": "Bio-Stimulants & Agricultural Products", "hi": "जैव-उत्तेजक और कृषि उत्पाद", "te": "బయో-స్టిమ్యులెంట్స్ & వ్యవసాయ ఉత్పత్తులు", "kn": "ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳು ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳು"},
            "address": {"en": "Avantra Chemicals Pvt Ltd, Hyderabad, Telangana, India", "hi": "अवंत्रा केमिकल्स प्रा. लि., हैदराबाद, तेलंगाना, भारत", "te": "అవంత్ర కెమికల్స్ ప్రై. లి., హైదరాబాద్, తెలంగాణ, భారతదేశం", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್ ಪ್ರೈ. ಲಿ., ಹೈದರಾಬಾದ್, ತೆಲಂಗಾಣ, ಭಾರತ"},
            "phone": "+91 98765 43210",
            "email": "info@avantra.co",
            "social_links": {}
        }
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

# ============================================
# STATS
# ============================================
@app.get("/api/stats")
async def get_stats(db: Session = Depends(get_db)):
    if db is None:
        return {"products": 0, "dealers": 0, "farmers": "12000", "states": "10"}
    product_count = db.query(Product).count()
    dealer_count = db.query(Dealer).filter(Dealer.is_approved == True).count()
    return {"products": product_count, "dealers": dealer_count, "farmers": "12000", "states": "10"}


# ============================================
# SERVE REACT FRONTEND (for cPanel deployment)
# ============================================
FRONTEND_BUILD = os.path.join(os.path.dirname(__file__), 'public')

if os.path.isdir(FRONTEND_BUILD):
    app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_BUILD, "static")), name="static-files")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Try to serve the exact file first
        file_path = os.path.join(FRONTEND_BUILD, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        # Otherwise serve index.html (React SPA routing)
        index_path = os.path.join(FRONTEND_BUILD, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        raise HTTPException(status_code=404, detail="Not found")
