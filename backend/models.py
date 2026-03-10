from sqlalchemy import create_engine, Column, String, Text, Boolean, DateTime, JSON, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, timezone
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

# ============================================
# PRODUCTS
# ============================================
class Product(Base):
    __tablename__ = 'products'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(JSON, default={})  # Translatable: {en, hi, te, kn}
    slug = Column(String(255), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    brand = Column(JSON, default={})  # Translatable
    image_url = Column(Text, default='')
    tagline = Column(JSON, default={})  # Translatable
    overview = Column(JSON, default={})  # Translatable
    composition = Column(JSON, default=[])  # [{component: {en,hi,te,kn}, specification: {en,hi,te,kn}}]
    how_it_works = Column(JSON, default={})  # {en: [], hi: [], te: [], kn: []}
    growth_stages = Column(JSON, default={})  # {en: [], hi: [], te: [], kn: []}
    dosage = Column(JSON, default={})  # Translatable
    advantages = Column(JSON, default={})  # {en: [], hi: [], te: [], kn: []}
    crops = Column(JSON, default={})  # Translatable
    manual_url = Column(Text, default='')
    leaflet_url = Column(Text, default='')
    featured = Column(Boolean, default=False)
    # SEO Fields
    seo_title = Column(JSON, default={})  # Translatable
    seo_description = Column(JSON, default={})  # Translatable
    seo_keywords = Column(JSON, default={})  # Translatable
    og_image = Column(Text, default='')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# PAGE CONTENT - All editable page content
# ============================================
class PageContent(Base):
    __tablename__ = 'page_contents'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    page_key = Column(String(100), unique=True, nullable=False)  # e.g., 'home', 'about', 'contact'
    content = Column(JSON, default={})  # All translatable content for the page
    seo = Column(JSON, default={})  # SEO settings for the page
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# CATEGORY CONTENT - Editable category labels
# ============================================
class CategoryContent(Base):
    __tablename__ = 'category_contents'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    category_key = Column(String(100), unique=True, nullable=False)
    name = Column(JSON, default={})  # Translatable name
    description = Column(JSON, default={})  # Translatable description
    image_url = Column(Text, default='')
    order = Column(Integer, default=0)

# ============================================
# NAVIGATION & UI LABELS
# ============================================
class UILabel(Base):
    __tablename__ = 'ui_labels'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    label_key = Column(String(100), unique=True, nullable=False)  # e.g., 'nav.home', 'btn.submit'
    text = Column(JSON, default={})  # {en, hi, te, kn}
    category = Column(String(50), default='general')  # nav, button, form, footer, etc.

# ============================================
# CONTACTS
# ============================================
class Contact(Base):
    __tablename__ = 'contacts'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), default='')
    message = Column(Text, default='')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# DEALERS
# ============================================
class Dealer(Base):
    __tablename__ = 'dealers'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    business_name = Column(String(255), default='')
    location = Column(String(255), nullable=False)
    phone = Column(String(50), default='')
    email = Column(String(255), default='')
    message = Column(Text, default='')
    status = Column(String(50), default='pending')
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# GALLERY
# ============================================
class GalleryItem(Base):
    __tablename__ = 'gallery'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(JSON, default={})  # Translatable
    image_url = Column(Text, nullable=False)
    category = Column(String(100), default='general')
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# BLOG POSTS
# ============================================
class BlogPost(Base):
    __tablename__ = 'blog_posts'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(JSON, default={})  # Translatable
    slug = Column(String(255), unique=True, nullable=False)
    excerpt = Column(JSON, default={})  # Translatable
    content = Column(JSON, default={})  # Translatable
    featured_image_url = Column(Text, default='')
    author = Column(String(255), default='Admin')
    published = Column(Boolean, default=True)
    # SEO Fields
    seo_title = Column(JSON, default={})
    seo_description = Column(JSON, default={})
    seo_keywords = Column(JSON, default={})
    og_image = Column(Text, default='')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# VIDEO TESTIMONIALS
# ============================================
class VideoTestimonial(Base):
    __tablename__ = 'video_testimonials'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(JSON, default={})  # Translatable
    video_url = Column(Text, nullable=False)
    thumbnail_url = Column(Text, default='')
    author = Column(String(255), default='')
    location = Column(JSON, default={})  # Translatable
    description = Column(JSON, default={})  # Translatable
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# JOBS
# ============================================
class Job(Base):
    __tablename__ = 'jobs'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(JSON, default={})  # Translatable
    department = Column(JSON, default={})  # Translatable
    location = Column(JSON, default={})  # Translatable
    type = Column(String(50), default='Full-time')
    description = Column(JSON, default={})  # Translatable
    requirements = Column(JSON, default={})  # Translatable
    active = Column(Boolean, default=True)
    # SEO Fields
    seo_title = Column(JSON, default={})
    seo_description = Column(JSON, default={})
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# JOB APPLICATIONS
# ============================================
class JobApplication(Base):
    __tablename__ = 'job_applications'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey('jobs.id'))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), default='')
    resume_url = Column(Text, default='')
    photo_url = Column(Text, default='')
    cover_letter = Column(Text, default='')
    status = Column(String(50), default='pending')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ============================================
# SITE SETTINGS
# ============================================
class SiteSettings(Base):
    __tablename__ = 'site_settings'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    logo_url = Column(Text, default='')
    favicon_url = Column(Text, default='')
    site_name = Column(JSON, default={})  # Translatable
    tagline = Column(JSON, default={})  # Translatable
    address = Column(JSON, default={})  # Translatable
    phone = Column(String(50), default='')
    email = Column(String(255), default='')
    social_links = Column(JSON, default={})
    # Global SEO
    default_seo_title = Column(JSON, default={})
    default_seo_description = Column(JSON, default={})
    default_seo_keywords = Column(JSON, default={})
    og_image = Column(Text, default='')
    google_analytics = Column(String(50), default='')
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


def create_tables(engine):
    """Create all database tables"""
    Base.metadata.create_all(engine)


def get_db_url(host, user, password, database, port=3306):
    """Generate MySQL connection URL"""
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}?charset=utf8mb4"


# ============================================
# DEFAULT CONTENT - Seed data for installation
# ============================================
def get_default_page_content():
    """Returns default translatable content for all pages"""
    return {
        "home": {
            "content": {
                "hero_slides": [
                    {
                        "title_top": {"en": "Nourishing Crops", "hi": "फसलों का पोषण", "te": "పంటలను పోషించడం", "kn": "ಬೆಳೆಗಳನ್ನು ಪೋಷಿಸುವುದು"},
                        "title_bottom": {"en": "that nourish India", "hi": "जो भारत का पोषण करती हैं", "te": "భారతదేశాన్ని పోషించేవి", "kn": "ಭಾರತವನ್ನು ಪೋಷಿಸುವ"},
                        "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80"
                    },
                    {
                        "title_top": {"en": "Boosting Soil Fertility", "hi": "मिट्टी की उर्वरता बढ़ाना", "te": "నేల సారాన్ని పెంచడం", "kn": "ಮಣ್ಣಿನ ಫಲವತ್ತತೆಯನ್ನು ಹೆಚ್ಚಿಸುವುದು"},
                        "title_bottom": {"en": "with Bio-Stimulants", "hi": "जैव-उत्तेजकों के साथ", "te": "బయో-స్టిమ్యులెంట్లతో", "kn": "ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳೊಂದಿಗೆ"},
                        "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80"
                    },
                    {
                        "title_top": {"en": "Enhancing Crop Growth", "hi": "फसल वृद्धि बढ़ाना", "te": "పంట పెరుగుదలను మెరుగుపరచడం", "kn": "ಬೆಳೆ ಬೆಳವಣಿಗೆಯನ್ನು ಹೆಚ್ಚಿಸುವುದು"},
                        "title_bottom": {"en": "with Advanced Technology", "hi": "उन्नत तकनीक के साथ", "te": "అధునాతన సాంకేతికతతో", "kn": "ಮುಂದುವರಿದ ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ"},
                        "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
                    }
                ],
                "products_section": {
                    "label": {"en": "Our Products", "hi": "हमारे उत्पाद", "te": "మా ఉత్పత్తులు", "kn": "ನಮ್ಮ ಉತ್ಪನ್ನಗಳು"},
                    "title": {"en": "Breakthrough Biological Farm Inputs", "hi": "क्रांतिकारी जैविक कृषि इनपुट", "te": "విప్లవాత్మక జీవ వ్యవసాయ ఇన్‌పుట్‌లు", "kn": "ಕ್ರಾಂತಿಕಾರಿ ಜೈವಿಕ ಕೃಷಿ ಒಳಸುರಿ"},
                    "description": {"en": "At Avantra Chemicals, we are on a bold mission to restore the golden balance between nature and science.", "hi": "अवंत्रा केमिकल्स में, हम प्रकृति और विज्ञान के बीच सुनहरे संतुलन को बहाल करने के साहसिक मिशन पर हैं।", "te": "అవంత్ర కెమికల్స్‌లో, మేము ప్రకృతి మరియు సైన్స్ మధ్య బంగారు సమతుల్యతను పునరుద్ధరించే సాహసోపేత మిషన్‌లో ఉన్నాము.", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್‌ನಲ್ಲಿ, ನಾವು ಪ್ರಕೃತಿ ಮತ್ತು ವಿಜ್ಞಾನದ ನಡುವಿನ ಸುವರ್ಣ ಸಮತೋಲನವನ್ನು ಮರುಸ್ಥಾಪಿಸುವ ಧೈರ್ಯದ ಮಿಷನ್‌ನಲ್ಲಿದ್ದೇವೆ."},
                    "description2": {"en": "We help farmers enhance the health and quality of their produce through our revolutionary 100% bio-enabled agri inputs.", "hi": "हम किसानों को हमारे क्रांतिकारी 100% जैव-सक्षम कृषि इनपुट के माध्यम से उनकी उपज के स्वास्थ्य और गुणवत्ता को बढ़ाने में मदद करते हैं।", "te": "మా విప్లవాత్మక 100% బయో-ఎనేబుల్డ్ వ్యవసాయ ఇన్‌పుట్‌ల ద్వారా రైతులు తమ ఉత్పత్తుల ఆరోగ్యం మరియు నాణ్యతను మెరుగుపరచడంలో మేము సహాయం చేస్తాము.", "kn": "ನಮ್ಮ ಕ್ರಾಂತಿಕಾರಿ 100% ಜೈವಿಕ-ಸಕ್ರಿಯ ಕೃಷಿ ಒಳಸುರಿಗಳ ಮೂಲಕ ರೈತರು ತಮ್ಮ ಉತ್ಪನ್ನಗಳ ಆರೋಗ್ಯ ಮತ್ತು ಗುಣಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸಲು ನಾವು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ."}
                },
                "stats": {
                    "farmers": {"value": "12K", "label": {"en": "Farmers Served", "hi": "किसानों की सेवा", "te": "రైతులకు సేవ", "kn": "ರೈತರಿಗೆ ಸೇವೆ"}},
                    "dealers": {"value": "50", "label": {"en": "Authorized Dealers", "hi": "अधिकृत डीलर", "te": "అధీకృత డీలర్లు", "kn": "ಅಧಿಕೃತ ವಿತರಕರು"}},
                    "products": {"value": "15", "label": {"en": "Bio Products", "hi": "जैव उत्पाद", "te": "జీవ ఉత్పత్తులు", "kn": "ಜೈವಿಕ ಉತ್ಪನ್ನಗಳು"}},
                    "states": {"value": "10", "label": {"en": "States Covered", "hi": "राज्य कवर", "te": "కవర్ చేసిన రాష్ట్రాలు", "kn": "ಒಳಗೊಂಡ ರಾಜ್ಯಗಳು"}}
                },
                "technology_section": {
                    "label": {"en": "Our Technology", "hi": "हमारी तकनीक", "te": "మా సాంకేతికత", "kn": "ನಮ್ಮ ತಂತ್ರಜ್ಞಾನ"},
                    "title": {"en": "Phytocode Technology", "hi": "फाइटोकोड तकनीक", "te": "ఫైటోకోడ్ సాంకేతికత", "kn": "ಫೈಟೋಕೋಡ್ ತಂತ್ರಜ್ಞಾನ"},
                    "features": [
                        {
                            "num": "01",
                            "title": {"en": "Feed the plant when they need it", "hi": "जरूरत पड़ने पर पौधे को खिलाएं", "te": "అవసరమైనప్పుడు మొక్కకు ఆహారం ఇవ్వండి", "kn": "ಅಗತ್ಯವಿದ್ದಾಗ ಸಸ್ಯಕ್ಕೆ ಆಹಾರ ನೀಡಿ"},
                            "desc": {"en": "Our proprietary technologies use enzyme activators to ensure effective nutrient uptake and delivery when plants need it the most.", "hi": "हमारी मालिकाना तकनीकें एंजाइम एक्टिवेटर्स का उपयोग करती हैं ताकि पौधों को जरूरत पड़ने पर प्रभावी पोषक तत्व ग्रहण और वितरण सुनिश्चित हो सके।", "te": "మొక్కలకు అత్యంత అవసరమైనప్పుడు సమర్థవంతమైన పోషక శోషణ మరియు డెలివరీని నిర్ధారించడానికి మా యాజమాన్య సాంకేతికతలు ఎంజైమ్ యాక్టివేటర్లను ఉపయోగిస్తాయి.", "kn": "ಸಸ್ಯಗಳಿಗೆ ಹೆಚ್ಚು ಅಗತ್ಯವಿರುವಾಗ ಪರಿಣಾಮಕಾರಿ ಪೋಷಕಾಂಶ ಹೀರಿಕೊಳ್ಳುವಿಕೆ ಮತ್ತು ವಿತರಣೆಯನ್ನು ಖಚಿತಪಡಿಸಲು ನಮ್ಮ ಸ್ವಾಮ್ಯದ ತಂತ್ರಜ್ಞಾನಗಳು ಎಂಜೈಮ್ ಆಕ್ಟಿವೇಟರ್‌ಗಳನ್ನು ಬಳಸುತ್ತವೆ."}
                        },
                        {
                            "num": "02",
                            "title": {"en": "Protect plants from stressors", "hi": "पौधों को तनाव से बचाएं", "te": "మొక్కలను ఒత్తిడి నుండి రక్షించండి", "kn": "ಸಸ್ಯಗಳನ್ನು ಒತ್ತಡದಿಂದ ರಕ್ಷಿಸಿ"},
                            "desc": {"en": "In cases of biotic & abiotic stress, our technologies enhance plants' defence mechanisms while maintaining nutrient uptake.", "hi": "जैविक और अजैविक तनाव के मामलों में, हमारी तकनीकें पोषक तत्वों के अवशोषण को बनाए रखते हुए पौधों की रक्षा तंत्र को बढ़ाती हैं।", "te": "బయోటిక్ & అబయోటిక్ ఒత్తిడి సందర్భాలలో, మా సాంకేతికతలు పోషక శోషణను నిర్వహిస్తూ మొక్కల రక్షణ మెకానిజమ్‌లను మెరుగుపరుస్తాయి.", "kn": "ಜೈವಿಕ ಮತ್ತು ಅಜೈವಿಕ ಒತ್ತಡದ ಸಂದರ್ಭಗಳಲ್ಲಿ, ನಮ್ಮ ತಂತ್ರಜ್ಞಾನಗಳು ಪೋಷಕಾಂಶ ಹೀರಿಕೊಳ್ಳುವಿಕೆಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವಾಗ ಸಸ್ಯಗಳ ರಕ್ಷಣಾ ಕಾರ್ಯವಿಧಾನಗಳನ್ನು ಹೆಚ್ಚಿಸುತ್ತವೆ."}
                        },
                        {
                            "num": "03",
                            "title": {"en": "Make products last longer", "hi": "उत्पादों को लंबे समय तक टिकाऊ बनाएं", "te": "ఉత్పత్తులు ఎక్కువ కాలం ఉండేలా చేయండి", "kn": "ಉತ್ಪನ್ನಗಳು ಹೆಚ್ಚು ಕಾಲ ಬಾಳಿಕೆ ಬರುವಂತೆ ಮಾಡಿ"},
                            "desc": {"en": "Our technologies employ special regenerative complexes that improve stability & shelf life, reducing the required number of applications.", "hi": "हमारी तकनीकें विशेष पुनर्योजी कॉम्प्लेक्स का उपयोग करती हैं जो स्थिरता और शेल्फ लाइफ में सुधार करती हैं, आवश्यक अनुप्रयोगों की संख्या को कम करती हैं।", "te": "మా సాంకేతికతలు స్థిరత్వం & షెల్ఫ్ లైఫ్‌ను మెరుగుపరిచే ప్రత్యేక రీజెనరేటివ్ కాంప్లెక్స్‌లను ఉపయోగిస్తాయి, అవసరమైన అప్లికేషన్ల సంఖ్యను తగ్గిస్తాయి.", "kn": "ನಮ್ಮ ತಂತ್ರಜ್ಞಾನಗಳು ಸ್ಥಿರತೆ ಮತ್ತು ಶೆಲ್ಫ್ ಜೀವಿತಾವಧಿಯನ್ನು ಸುಧಾರಿಸುವ ವಿಶೇಷ ಪುನರುತ್ಪಾದಕ ಸಂಕೀರ್ಣಗಳನ್ನು ಬಳಸುತ್ತವೆ, ಅಗತ್ಯವಿರುವ ಅನ್ವಯಗಳ ಸಂಖ್ಯೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತವೆ."}
                        }
                    ]
                },
                "cta_section": {
                    "title": {"en": "Ready to Transform Your Farm?", "hi": "अपने खेत को बदलने के लिए तैयार हैं?", "te": "మీ పొలాన్ని మార్చడానికి సిద్ధంగా ఉన్నారా?", "kn": "ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿಯನ್ನು ಪರಿವರ್ತಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?"},
                    "description": {"en": "Join thousands of farmers who have already improved their crop yield and quality with Avantra's bio-solutions.", "hi": "हजारों किसानों से जुड़ें जिन्होंने पहले से ही अवंत्रा के जैव-समाधानों से अपनी फसल की उपज और गुणवत्ता में सुधार किया है।", "te": "అవంత్ర బయో-సొల్యూషన్స్‌తో తమ పంట దిగుబడి మరియు నాణ్యతను ఇప్పటికే మెరుగుపరచుకున్న వేలాది రైతులతో చేరండి.", "kn": "ಅವಂತ್ರ ಜೈವಿಕ-ಪರಿಹಾರಗಳೊಂದಿಗೆ ತಮ್ಮ ಬೆಳೆ ಇಳುವರಿ ಮತ್ತು ಗುಣಮಟ್ಟವನ್ನು ಈಗಾಗಲೇ ಸುಧಾರಿಸಿಕೊಂಡ ಸಾವಿರಾರು ರೈತರೊಂದಿಗೆ ಸೇರಿ."},
                    "btn_products": {"en": "Explore Products", "hi": "उत्पाद देखें", "te": "ఉత్పత్తులను అన్వేషించండి", "kn": "ಉತ್ಪನ್ನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ"},
                    "btn_contact": {"en": "Contact Us", "hi": "संपर्क करें", "te": "మమ్మల్ని సంప్రదించండి", "kn": "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"}
                }
            },
            "seo": {
                "title": {"en": "Avantra Chemicals - Bio-Stimulants & Agricultural Products", "hi": "अवंत्रा केमिकल्स - जैव-उत्तेजक और कृषि उत्पाद", "te": "అవంత్ర కెమికల్స్ - బయో-స్టిమ్యులెంట్స్ & వ్యవసాయ ఉత్పత్తులు", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್ - ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳು ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳು"},
                "description": {"en": "Leading manufacturer of biostimulants and agricultural products in India. Innovative bio-solutions for sustainable farming.", "hi": "भारत में जैव-उत्तेजकों और कृषि उत्पादों के अग्रणी निर्माता। टिकाऊ खेती के लिए नवीन जैव-समाधान।", "te": "భారతదేశంలో బయో-స్టిమ్యులెంట్స్ మరియు వ్యవసాయ ఉత్పత్తుల ప్రముఖ తయారీదారు. సుస్థిర వ్యవసాయం కోసం వినూత్న బయో-సొల్యూషన్స్.", "kn": "ಭಾರತದಲ್ಲಿ ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳು ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳ ಪ್ರಮುಖ ತಯಾರಕ. ಸುಸ್ಥಿರ ಕೃಷಿಗಾಗಿ ನವೀನ ಜೈವಿಕ-ಪರಿಹಾರಗಳು."},
                "keywords": {"en": "biostimulants, agriculture, farming, bio fertilizer, crop enhancement, India", "hi": "जैव-उत्तेजक, कृषि, खेती, जैव उर्वरक, फसल वृद्धि, भारत", "te": "బయో-స్టిమ్యులెంట్స్, వ్యవసాయం, సాగు, జీవ ఎరువు, పంట మెరుగుదల, భారతదేశం", "kn": "ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳು, ಕೃಷಿ, ಕೃಷಿ, ಜೈವಿಕ ಗೊಬ್ಬರ, ಬೆಳೆ ಸುಧಾರಣೆ, ಭಾರತ"}
            }
        },
        "about": {
            "content": {
                "hero_title": {"en": "About Us", "hi": "हमारे बारे में", "te": "మా గురించి", "kn": "ನಮ್ಮ ಬಗ್ಗೆ"},
                "mission_label": {"en": "Our Mission", "hi": "हमारा मिशन", "te": "మా మిషన్", "kn": "ನಮ್ಮ ಧ್ಯೇಯ"},
                "mission_title": {"en": "Nurturing the Interaction Between Plant, Soil & Microbes", "hi": "पौधे, मिट्टी और रोगाणुओं के बीच संपर्क का पोषण", "te": "మొక్క, నేల & సూక్ష్మజీవుల మధ్య పరస్పర చర్యను పోషించడం", "kn": "ಸಸ್ಯ, ಮಣ್ಣು ಮತ್ತು ಸೂಕ್ಷ್ಮಜೀವಿಗಳ ನಡುವಿನ ಪರಸ್ಪರ ಕ್ರಿಯೆಯನ್ನು ಪೋಷಿಸುವುದು"},
                "mission_desc": {"en": "At Avantra Chemicals, we are on a bold mission to restore the golden balance between nature and science.", "hi": "अवंत्रा केमिकल्स में, हम प्रकृति और विज्ञान के बीच सुनहरे संतुलन को बहाल करने के साहसिक मिशन पर हैं।", "te": "అవంత్ర కెమికల్స్‌లో, మేము ప్రకృతి మరియు సైన్స్ మధ్య బంగారు సమతుల్యతను పునరుద్ధరించే సాహసోపేత మిషన్‌లో ఉన్నాము.", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್‌ನಲ್ಲಿ, ನಾವು ಪ್ರಕೃತಿ ಮತ್ತು ವಿಜ್ಞಾನದ ನಡುವಿನ ಸುವರ್ಣ ಸಮತೋಲನವನ್ನು ಮರುಸ್ಥಾಪಿಸುವ ಧೈರ್ಯದ ಮಿಷನ್‌ನಲ್ಲಿದ್ದೇವೆ."},
                "values_label": {"en": "Our Values", "hi": "हमारे मूल्य", "te": "మా విలువలు", "kn": "ನಮ್ಮ ಮೌಲ್ಯಗಳು"},
                "values_title": {"en": "What Drives Us", "hi": "क्या हमें प्रेरित करता है", "te": "మాకు ప్రేరణ ఏమిటి", "kn": "ನಮ್ಮನ್ನು ಪ್ರೇರೇಪಿಸುವುದು"},
                "values": [
                    {"title": {"en": "Innovation", "hi": "नवाचार", "te": "ఆవిష్కరణ", "kn": "ನವೀನತೆ"}, "desc": {"en": "Constantly pushing boundaries in agricultural science", "hi": "कृषि विज्ञान में लगातार सीमाओं को आगे बढ़ाना", "te": "వ్యవసాయ శాస్త్రంలో నిరంతరం సరిహద్దులను విస్తరిస్తున్నాము", "kn": "ಕೃಷಿ ವಿಜ್ಞಾನದಲ್ಲಿ ನಿರಂತರವಾಗಿ ಗಡಿಗಳನ್ನು ತಳ್ಳುವುದು"}},
                    {"title": {"en": "Farmer First", "hi": "किसान पहले", "te": "రైతు ముందుగా", "kn": "ರೈತ ಮೊದಲು"}, "desc": {"en": "Every decision centers around farmer welfare", "hi": "हर निर्णय किसान कल्याण के इर्द-गिर्द केंद्रित है", "te": "ప్రతి నిర్ణయం రైతు సంక్షేమం చుట్టూ కేంద్రీకృతమవుతుంది", "kn": "ಪ್ರತಿ ನಿರ್ಧಾರವೂ ರೈತ ಕಲ್ಯಾಣವನ್ನು ಕೇಂದ್ರೀಕರಿಸುತ್ತದೆ"}},
                    {"title": {"en": "Sustainability", "hi": "स्थिरता", "te": "స్థిరత్వం", "kn": "ಸುಸ್ಥಿರತೆ"}, "desc": {"en": "Committed to eco-friendly farming solutions", "hi": "पर्यावरण अनुकूल खेती समाधानों के लिए प्रतिबद्ध", "te": "పర్యావరణ అనుకూల వ్యవసాయ పరిష్కారాలకు కట్టుబడి", "kn": "ಪರಿಸರ ಸ್ನೇಹಿ ಕೃಷಿ ಪರಿಹಾರಗಳಿಗೆ ಬದ್ಧ"}},
                    {"title": {"en": "Excellence", "hi": "उत्कृष्टता", "te": "శ్రేష్ఠత", "kn": "ಶ್ರೇಷ್ಠತೆ"}, "desc": {"en": "Uncompromising quality in every product", "hi": "हर उत्पाद में बेजोड़ गुणवत्ता", "te": "ప్రతి ఉత్పత్తిలో అసమాన నాణ్యత", "kn": "ಪ್ರತಿ ಉತ್ಪನ್ನದಲ್ಲಿ ಅಸಮಾನ ಗುಣಮಟ್ಟ"}}
                ],
                "team_image": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
                "rd_image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80"
            },
            "seo": {
                "title": {"en": "About Avantra Chemicals - Our Mission & Values", "hi": "अवंत्रा केमिकल्स के बारे में - हमारा मिशन और मूल्य", "te": "అవంత్ర కెమికల్స్ గురించి - మా మిషన్ & విలువలు", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್ ಬಗ್ಗೆ - ನಮ್ಮ ಧ್ಯೇಯ ಮತ್ತು ಮೌಲ್ಯಗಳು"},
                "description": {"en": "Learn about Avantra Chemicals' mission to transform Indian agriculture through innovative bio-solutions.", "hi": "नवीन जैव-समाधानों के माध्यम से भारतीय कृषि को बदलने के अवंत्रा केमिकल्स के मिशन के बारे में जानें।", "te": "వినూత్న బయో-సొల్యూషన్స్ ద్వారా భారతీయ వ్యవసాయాన్ని మార్చే అవంత్ర కెమికల్స్ మిషన్ గురించి తెలుసుకోండి.", "kn": "ನವೀನ ಜೈವಿಕ-ಪರಿಹಾರಗಳ ಮೂಲಕ ಭಾರತೀಯ ಕೃಷಿಯನ್ನು ಪರಿವರ್ತಿಸುವ ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್‌ನ ಧ್ಯೇಯದ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ."}
            }
        },
        "contact": {
            "content": {
                "hero_title": {"en": "Contact Us", "hi": "संपर्क करें", "te": "మమ్మల్ని సంప్రదించండి", "kn": "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"},
                "form_title": {"en": "Send Us a Message", "hi": "हमें संदेश भेजें", "te": "మాకు సందేశం పంపండి", "kn": "ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ"},
                "info_title": {"en": "Get In Touch", "hi": "संपर्क में रहें", "te": "సంప్రదించండి", "kn": "ಸಂಪರ್ಕದಲ್ಲಿರಿ"},
                "info_subtitle": {"en": "We'd Love to Hear From You", "hi": "हम आपसे सुनना पसंद करेंगे", "te": "మీ నుండి వినడానికి ఇష్టపడతాము", "kn": "ನಿಮ್ಮಿಂದ ಕೇಳಲು ನಾವು ಇಷ್ಟಪಡುತ್ತೇವೆ"},
                "labels": {
                    "name": {"en": "Full Name", "hi": "पूरा नाम", "te": "పూర్తి పేరు", "kn": "ಪೂರ್ಣ ಹೆಸರು"},
                    "email": {"en": "Email Address", "hi": "ईमेल पता", "te": "ఇమెయిల్ చిరునామా", "kn": "ಇಮೇಲ್ ವಿಳಾಸ"},
                    "phone": {"en": "Phone Number", "hi": "फोन नंबर", "te": "ఫోన్ నంబర్", "kn": "ಫೋನ್ ಸಂಖ್ಯೆ"},
                    "message": {"en": "Message", "hi": "संदेश", "te": "సందేశం", "kn": "ಸಂದೇಶ"},
                    "submit": {"en": "Send Message", "hi": "संदेश भेजें", "te": "సందేశం పంపండి", "kn": "ಸಂದೇಶ ಕಳುಹಿಸಿ"}
                }
            },
            "seo": {
                "title": {"en": "Contact Avantra Chemicals", "hi": "अवंत्रा केमिकल्स से संपर्क करें", "te": "అవంత్ర కెమికల్స్‌ను సంప్రదించండి", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ"},
                "description": {"en": "Contact Avantra Chemicals for inquiries about our bio-stimulants and agricultural products.", "hi": "हमारे जैव-उत्तेजकों और कृषि उत्पादों के बारे में पूछताछ के लिए अवंत्रा केमिकल्स से संपर्क करें।", "te": "మా బయో-స్టిమ్యులెంట్స్ మరియు వ్యవసాయ ఉత్పత్తుల గురించి విచారణల కోసం అవంత్ర కెమికల్స్‌ను సంప్రదించండి.", "kn": "ನಮ್ಮ ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳು ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳ ಬಗ್ಗೆ ವಿಚಾರಣೆಗಳಿಗಾಗಿ ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ."}
            }
        },
        "products": {
            "content": {
                "hero_title": {"en": "Our Products", "hi": "हमारे उत्पाद", "te": "మా ఉత్పత్తులు", "kn": "ನಮ್ಮ ಉತ್ಪನ್ನಗಳು"},
                "filter_all": {"en": "All Products", "hi": "सभी उत्पाद", "te": "అన్ని ఉత్పత్తులు", "kn": "ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು"},
                "cta_title": {"en": "Need Help Choosing the Right Product?", "hi": "सही उत्पाद चुनने में मदद चाहिए?", "te": "సరైన ఉత్పత్తిని ఎంచుకోవడంలో సహాయం కావాలా?", "kn": "ಸರಿಯಾದ ಉತ್ಪನ್ನವನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಸಹಾಯ ಬೇಕೇ?"},
                "cta_desc": {"en": "Our agricultural experts are here to help you find the perfect solution for your crops.", "hi": "हमारे कृषि विशेषज्ञ आपकी फसलों के लिए सही समाधान खोजने में मदद करने के लिए यहां हैं।", "te": "మీ పంటలకు సరైన పరిష్కారాన్ని కనుగొనడంలో మీకు సహాయం చేయడానికి మా వ్యవసాయ నిపుణులు ఇక్కడ ఉన్నారు.", "kn": "ನಿಮ್ಮ ಬೆಳೆಗಳಿಗೆ ಸೂಕ್ತ ಪರಿಹಾರವನ್ನು ಹುಡುಕಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಮ್ಮ ಕೃಷಿ ತಜ್ಞರು ಇಲ್ಲಿದ್ದಾರೆ."},
                "btn_contact": {"en": "Contact Our Experts", "hi": "हमारे विशेषज्ञों से संपर्क करें", "te": "మా నిపుణులను సంప్రదించండి", "kn": "ನಮ್ಮ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ"},
                "btn_dealers": {"en": "Find a Dealer", "hi": "डीलर खोजें", "te": "డీలర్‌ను కనుగొనండి", "kn": "ವಿತರಕರನ್ನು ಹುಡುಕಿ"}
            },
            "seo": {
                "title": {"en": "Agricultural Products - Avantra Chemicals", "hi": "कृषि उत्पाद - अवंत्रा केमिकल्स", "te": "వ్యవసాయ ఉత్పత్తులు - అవంత్ర కెమికల్స్", "kn": "ಕೃಷಿ ಉತ್ಪನ್ನಗಳು - ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್"},
                "description": {"en": "Explore our range of bio-stimulants, biofertilizers, and agricultural products for enhanced crop growth.", "hi": "बेहतर फसल वृद्धि के लिए हमारे जैव-उत्तेजकों, जैव उर्वरकों और कृषि उत्पादों की श्रृंखला देखें।", "te": "మెరుగైన పంట పెరుగుదల కోసం మా బయో-స్టిమ్యులెంట్స్, బయోఫెర్టిలైజర్లు మరియు వ్యవసాయ ఉత్పత్తుల శ్రేణిని అన్వేషించండి.", "kn": "ವರ್ಧಿತ ಬೆಳೆ ಬೆಳವಣಿಗೆಗಾಗಿ ನಮ್ಮ ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳು, ಜೈವಿಕ ಗೊಬ್ಬರಗಳು ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳ ಶ್ರೇಣಿಯನ್ನು ಅನ್ವೇಷಿಸಿ."}
            }
        },
        "dealers": {
            "content": {
                "hero_title": {"en": "Dealer Network", "hi": "डीलर नेटवर्क", "te": "డీలర్ నెట్‌వర్క్", "kn": "ವಿತರಕ ಜಾಲ"},
                "find_title": {"en": "Find a Dealer", "hi": "डीलर खोजें", "te": "డీలర్‌ను కనుగొనండి", "kn": "ವಿತರಕರನ್ನು ಹುಡುಕಿ"},
                "find_subtitle": {"en": "Our Authorized Dealers", "hi": "हमारे अधिकृत डीलर", "te": "మా అధీకృత డీలర్లు", "kn": "ನಮ್ಮ ಅಧಿಕೃತ ವಿತರಕರು"},
                "apply_title": {"en": "Become an Authorized Dealer", "hi": "अधिकृत डीलर बनें", "te": "అధీకృత డీలర్ అవ్వండి", "kn": "ಅಧಿಕೃತ ವಿತರಕರಾಗಿ"},
                "apply_subtitle": {"en": "Partner with us to bring innovative bio-solutions to farmers in your region.", "hi": "अपने क्षेत्र के किसानों तक नवीन जैव-समाधान पहुंचाने के लिए हमारे साथ भागीदार बनें।", "te": "మీ ప్రాంతంలోని రైతులకు వినూత్న బయో-సొల్యూషన్స్ అందించడానికి మాతో భాగస్వామ్యం చేయండి.", "kn": "ನಿಮ್ಮ ಪ್ರದೇಶದ ರೈತರಿಗೆ ನವೀನ ಜೈವಿಕ-ಪರಿಹಾರಗಳನ್ನು ತರಲು ನಮ್ಮೊಂದಿಗೆ ಪಾಲುದಾರರಾಗಿ."}
            },
            "seo": {
                "title": {"en": "Dealer Network - Avantra Chemicals", "hi": "डीलर नेटवर्क - अवंत्रा केमिकल्स", "te": "డీలర్ నెట్‌వర్క్ - అవంత్ర కెమికల్స్", "kn": "ವಿತರಕ ಜಾಲ - ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್"}
            }
        },
        "careers": {
            "content": {
                "hero_title": {"en": "Careers", "hi": "करियर", "te": "కెరీర్స్", "kn": "ವೃತ್ತಿಜೀವನ"},
                "why_title": {"en": "Build Your Career at Avantra", "hi": "अवंत्रा में अपना करियर बनाएं", "te": "అవంత్రలో మీ కెరీర్‌ను నిర్మించుకోండి", "kn": "ಅವಂತ್ರದಲ್ಲಿ ನಿಮ್ಮ ವೃತ್ತಿಜೀವನವನ್ನು ನಿರ್ಮಿಸಿ"},
                "openings_title": {"en": "Current Openings", "hi": "वर्तमान रिक्तियां", "te": "ప్రస్తుత ఖాళీలు", "kn": "ಪ್ರಸ್ತುತ ಹುದ್ದೆಗಳು"}
            },
            "seo": {
                "title": {"en": "Careers at Avantra Chemicals", "hi": "अवंत्रा केमिकल्स में करियर", "te": "అవంత్ర కెమికల్స్‌లో కెరీర్స్", "kn": "ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್‌ನಲ್ಲಿ ವೃತ್ತಿಜೀವನ"}
            }
        },
        "gallery": {
            "content": {
                "hero_title": {"en": "Gallery", "hi": "गैलरी", "te": "గ్యాలరీ", "kn": "ಗ್ಯಾಲರಿ"},
                "subtitle": {"en": "Explore Our Facilities & Impact", "hi": "हमारी सुविधाओं और प्रभाव का अन्वेषण करें", "te": "మా సౌకర్యాలు & ప్రభావాన్ని అన్వేషించండి", "kn": "ನಮ್ಮ ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಪ್ರಭಾವವನ್ನು ಅನ್ವೇಷಿಸಿ"}
            },
            "seo": {
                "title": {"en": "Gallery - Avantra Chemicals", "hi": "गैलरी - अवंत्रा केमिकल्स", "te": "గ్యాలరీ - అవంత్ర కెమికల్స్", "kn": "ಗ್ಯಾಲರಿ - ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್"}
            }
        },
        "media": {
            "content": {
                "hero_title": {"en": "Media Center", "hi": "मीडिया सेंटर", "te": "మీడియా సెంటర్", "kn": "ಮಾಧ್ಯಮ ಕೇಂದ್ರ"},
                "subtitle": {"en": "Latest From Avantra", "hi": "अवंत्रा से नवीनतम", "te": "అవంత్ర నుండి తాజాది", "kn": "ಅವಂತ್ರದಿಂದ ಇತ್ತೀಚಿನವು"}
            },
            "seo": {
                "title": {"en": "Media Center - Avantra Chemicals", "hi": "मीडिया सेंटर - अवंत्रा केमिकल्स", "te": "మీడియా సెంటర్ - అవంత్ర కెమికల్స్", "kn": "ಮಾಧ್ಯಮ ಕೇಂದ್ರ - ಅವಂತ್ರ ಕೆಮಿಕಲ್ಸ್"}
            }
        }
    }


def get_default_categories():
    """Returns default product categories with translations"""
    return [
        {
            "category_key": "biostimulant",
            "name": {"en": "Biostimulants", "hi": "जैव-उत्तेजक", "te": "బయో-స్టిమ్యులెంట్స్", "kn": "ಜೈವಿಕ-ಉತ್ತೇಜಕಗಳು"},
            "description": {"en": "High-performing plant growth enhancers", "hi": "उच्च प्रदर्शन वाले पौधे वृद्धि बढ़ाने वाले", "te": "అధిక పనితీరు కలిగిన మొక్కల పెరుగుదల పెంచేవి", "kn": "ಉನ್ನತ ಕಾರ್ಯಕ್ಷಮತೆಯ ಸಸ್ಯ ಬೆಳವಣಿಗೆ ವರ್ಧಕಗಳು"},
            "order": 1
        },
        {
            "category_key": "biofertilizer",
            "name": {"en": "Biofertilizers", "hi": "जैव उर्वरक", "te": "బయోఫెర్టిలైజర్లు", "kn": "ಜೈವಿಕ ಗೊಬ್ಬರಗಳು"},
            "description": {"en": "Power-packed soil nutrition solutions", "hi": "शक्तिशाली मिट्टी पोषण समाधान", "te": "శక్తివంతమైన నేల పోషణ పరిష్కారాలు", "kn": "ಶಕ್ತಿಯುತ ಮಣ್ಣಿನ ಪೋಷಣೆ ಪರಿಹಾರಗಳು"},
            "order": 2
        },
        {
            "category_key": "liquid_fertilizer",
            "name": {"en": "Liquid Fertilizers", "hi": "तरल उर्वरक", "te": "ద్రవ ఎరువులు", "kn": "ದ್ರವ ಗೊಬ್ಬರಗಳು"},
            "description": {"en": "Fast-acting foliar nutrition", "hi": "तेजी से काम करने वाला पत्ते का पोषण", "te": "వేగంగా పనిచేసే ఆకుల పోషణ", "kn": "ವೇಗವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಎಲೆ ಪೋಷಣೆ"},
            "order": 3
        },
        {
            "category_key": "micronutrient",
            "name": {"en": "Micronutrients", "hi": "सूक्ष्म पोषक तत्व", "te": "సూక్ష్మ పోషకాలు", "kn": "ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳು"},
            "description": {"en": "Essential mineral supplements for crops", "hi": "फसलों के लिए आवश्यक खनिज पूरक", "te": "పంటలకు అవసరమైన ఖనిజ సప్లిమెంట్స్", "kn": "ಬೆಳೆಗಳಿಗೆ ಅಗತ್ಯ ಖನಿಜ ಪೂರಕಗಳು"},
            "order": 4
        },
        {
            "category_key": "water_soluble",
            "name": {"en": "Water Soluble", "hi": "पानी में घुलनशील", "te": "నీటిలో కరిగేవి", "kn": "ನೀರಿನಲ್ಲಿ ಕರಗುವ"},
            "description": {"en": "Easy-to-apply water soluble fertilizers", "hi": "आसानी से लगाने वाले पानी में घुलनशील उर्वरक", "te": "సులభంగా వర్తింపజేయగల నీటిలో కరిగే ఎరువులు", "kn": "ಸುಲಭವಾಗಿ ಹಚ್ಚಬಹುದಾದ ನೀರಿನಲ್ಲಿ ಕರಗುವ ಗೊಬ್ಬರಗಳು"},
            "order": 5
        }
    ]


def get_default_ui_labels():
    """Returns default UI labels with translations"""
    return [
        # Navigation
        {"label_key": "nav.home", "text": {"en": "Home", "hi": "होम", "te": "హోమ్", "kn": "ಮುಖಪುಟ"}, "category": "nav"},
        {"label_key": "nav.about", "text": {"en": "About", "hi": "हमारे बारे में", "te": "మా గురించి", "kn": "ನಮ್ಮ ಬಗ್ಗೆ"}, "category": "nav"},
        {"label_key": "nav.products", "text": {"en": "Products", "hi": "उत्पाद", "te": "ఉత్పత్తులు", "kn": "ಉತ್ಪನ್ನಗಳು"}, "category": "nav"},
        {"label_key": "nav.gallery", "text": {"en": "Gallery", "hi": "गैलरी", "te": "గ్యాలరీ", "kn": "ಗ್ಯಾಲರಿ"}, "category": "nav"},
        {"label_key": "nav.media", "text": {"en": "Media", "hi": "मीडिया", "te": "మీడియా", "kn": "ಮಾಧ್ಯಮ"}, "category": "nav"},
        {"label_key": "nav.dealers", "text": {"en": "Dealers", "hi": "डीलर", "te": "డీలర్లు", "kn": "ವಿತರಕರು"}, "category": "nav"},
        {"label_key": "nav.contact", "text": {"en": "Contact", "hi": "संपर्क", "te": "సంప్రదించండి", "kn": "ಸಂಪರ್ಕ"}, "category": "nav"},
        {"label_key": "nav.careers", "text": {"en": "Careers", "hi": "करियर", "te": "కెరీర్స్", "kn": "ವೃತ್ತಿ"}, "category": "nav"},
        
        # Buttons
        {"label_key": "btn.submit", "text": {"en": "Submit", "hi": "जमा करें", "te": "సమర్పించు", "kn": "ಸಲ್ಲಿಸಿ"}, "category": "button"},
        {"label_key": "btn.learn_more", "text": {"en": "Learn More", "hi": "और जानें", "te": "మరింత తెలుసుకోండి", "kn": "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ"}, "category": "button"},
        {"label_key": "btn.view_details", "text": {"en": "View Details", "hi": "विवरण देखें", "te": "వివరాలు చూడండి", "kn": "ವಿವರಗಳನ್ನು ನೋಡಿ"}, "category": "button"},
        {"label_key": "btn.download_manual", "text": {"en": "Download Product Manual", "hi": "उत्पाद मैनुअल डाउनलोड करें", "te": "ఉత్పత్తి మాన్యువల్ డౌన్‌లోడ్ చేయండి", "kn": "ಉತ್ಪನ್ನ ಕೈಪಿಡಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"}, "category": "button"},
        {"label_key": "btn.download_leaflet", "text": {"en": "Download Leaflet", "hi": "पत्रक डाउनलोड करें", "te": "లీఫ్‌లెట్ డౌన్‌లోడ్ చేయండి", "kn": "ಕರಪತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"}, "category": "button"},
        {"label_key": "btn.back_to_products", "text": {"en": "Back to Products", "hi": "उत्पादों पर वापस", "te": "ఉత్పత్తులకు తిరిగి", "kn": "ಉತ್ಪನ್ನಗಳಿಗೆ ಹಿಂತಿರುಗಿ"}, "category": "button"},
        
        # Product Details
        {"label_key": "product.benefits", "text": {"en": "Benefits", "hi": "लाभ", "te": "ప్రయోజనాలు", "kn": "ಪ್ರಯೋಜನಗಳು"}, "category": "product"},
        {"label_key": "product.how_it_works", "text": {"en": "How It Works", "hi": "यह कैसे काम करता है", "te": "ఇది ఎలా పని చేస్తుంది", "kn": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ"}, "category": "product"},
        {"label_key": "product.composition", "text": {"en": "Active Ingredients", "hi": "सक्रिय तत्व", "te": "క్రియాశీల పదార్థాలు", "kn": "ಸಕ್ರಿಯ ಘಟಕಗಳು"}, "category": "product"},
        {"label_key": "product.component", "text": {"en": "Component", "hi": "घटक", "te": "భాగం", "kn": "ಘಟಕ"}, "category": "product"},
        {"label_key": "product.specification", "text": {"en": "Specification", "hi": "विनिर्देश", "te": "స్పెసిఫికేషన్", "kn": "ವಿವರಣೆ"}, "category": "product"},
        {"label_key": "product.growth_stages", "text": {"en": "Targeted Growth Stages", "hi": "लक्षित विकास चरण", "te": "లక్ష్య పెరుగుదల దశలు", "kn": "ಗುರಿಯ ಬೆಳವಣಿಗೆ ಹಂತಗಳು"}, "category": "product"},
        {"label_key": "product.dosage", "text": {"en": "Application Window", "hi": "अनुप्रयोग विंडो", "te": "అప్లికేషన్ విండో", "kn": "ಅಪ್ಲಿಕೇಶನ್ ವಿಂಡೋ"}, "category": "product"},
        {"label_key": "product.crops", "text": {"en": "Crops", "hi": "फसलें", "te": "పంటలు", "kn": "ಬೆಳೆಗಳು"}, "category": "product"},
        {"label_key": "product.related", "text": {"en": "Related Products", "hi": "संबंधित उत्पाद", "te": "సంబంధిత ఉత్పత్తులు", "kn": "ಸಂಬಂಧಿತ ಉತ್ಪನ್ನಗಳು"}, "category": "product"},
        
        # Footer
        {"label_key": "footer.quick_links", "text": {"en": "Quick Links", "hi": "त्वरित लिंक", "te": "త్వరిత లింక్‌లు", "kn": "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು"}, "category": "footer"},
        {"label_key": "footer.products", "text": {"en": "Products", "hi": "उत्पाद", "te": "ఉత్పత్తులు", "kn": "ಉತ್ಪನ್ನಗಳು"}, "category": "footer"},
        {"label_key": "footer.contact_us", "text": {"en": "Contact Us", "hi": "संपर्क करें", "te": "మమ్మల్ని సంప్రదించండి", "kn": "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"}, "category": "footer"},
        {"label_key": "footer.privacy", "text": {"en": "Privacy Policy", "hi": "गोपनीयता नीति", "te": "గోప్యతా విధానం", "kn": "ಗೌಪ್ಯತಾ ನೀತಿ"}, "category": "footer"},
        {"label_key": "footer.terms", "text": {"en": "Terms & Conditions", "hi": "नियम और शर्तें", "te": "నిబంధనలు & షరతులు", "kn": "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು"}, "category": "footer"},
        {"label_key": "footer.copyright", "text": {"en": "All rights reserved", "hi": "सर्वाधिकार सुरक्षित", "te": "అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి", "kn": "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ"}, "category": "footer"},
        
        # General
        {"label_key": "general.loading", "text": {"en": "Loading...", "hi": "लोड हो रहा है...", "te": "లోడ్ అవుతోంది...", "kn": "ಲೋಡ್ ಆಗುತ್ತಿದೆ..."}, "category": "general"},
        {"label_key": "general.no_results", "text": {"en": "No results found", "hi": "कोई परिणाम नहीं मिला", "te": "ఫలితాలు కనుగొనబడలేదు", "kn": "ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ"}, "category": "general"},
        {"label_key": "general.read_more", "text": {"en": "Read More", "hi": "और पढ़ें", "te": "మరింత చదవండి", "kn": "ಹೆಚ್ಚು ಓದಿ"}, "category": "general"},
        {"label_key": "general.thank_you", "text": {"en": "Thank You!", "hi": "धन्यवाद!", "te": "ధన్యవాదాలు!", "kn": "ಧನ್ಯವಾದಗಳು!"}, "category": "general"},
        {"label_key": "general.search", "text": {"en": "Search", "hi": "खोजें", "te": "శోధించండి", "kn": "ಹುಡುಕಿ"}, "category": "general"}
    ]
