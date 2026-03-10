from sqlalchemy import create_engine, Column, String, Text, Boolean, DateTime, JSON, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, timezone
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    brand = Column(String(100), default='')
    image_url = Column(Text, default='')
    tagline = Column(JSON, default={})
    overview = Column(JSON, default={})
    composition = Column(JSON, default=[])
    how_it_works = Column(JSON, default={})
    growth_stages = Column(JSON, default={})
    dosage = Column(JSON, default={})
    advantages = Column(JSON, default={})
    crops = Column(Text, default='')
    manual_url = Column(Text, default='')
    leaflet_url = Column(Text, default='')
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Contact(Base):
    __tablename__ = 'contacts'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), default='')
    message = Column(Text, default='')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

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

class GalleryItem(Base):
    __tablename__ = 'gallery'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), default='')
    image_url = Column(Text, nullable=False)
    category = Column(String(100), default='general')
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BlogPost(Base):
    __tablename__ = 'blog_posts'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    excerpt = Column(Text, default='')
    content = Column(Text, default='')
    featured_image_url = Column(Text, default='')
    author = Column(String(255), default='Admin')
    published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class VideoTestimonial(Base):
    __tablename__ = 'video_testimonials'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), default='')
    video_url = Column(Text, nullable=False)
    thumbnail_url = Column(Text, default='')
    author = Column(String(255), default='')
    location = Column(String(255), default='')
    description = Column(Text, default='')
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Job(Base):
    __tablename__ = 'jobs'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    department = Column(String(100), default='')
    location = Column(String(255), default='')
    type = Column(String(50), default='Full-time')
    description = Column(Text, default='')
    requirements = Column(Text, default='')
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

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

class SiteSettings(Base):
    __tablename__ = 'site_settings'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    logo_url = Column(Text, default='')
    hero_image_url = Column(Text, default='')
    address = Column(Text, default='')
    phone = Column(String(50), default='')
    email = Column(String(255), default='')
    social_links = Column(JSON, default={})
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


def create_tables(engine):
    """Create all database tables"""
    Base.metadata.create_all(engine)


def get_db_url(host, user, password, database, port=3306):
    """Generate MySQL connection URL"""
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}?charset=utf8mb4"
