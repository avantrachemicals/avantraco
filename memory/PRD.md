# Avantra Chemicals Pvt Ltd - Product Requirements Document

## Overview
A complete, production-ready multipage website for Avantra Chemicals Pvt Ltd, a leading manufacturer of biostimulants and agricultural products. The website features a premium dark design inspired by inera.ag.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MySQL (via SQLAlchemy)
- **Styling**: Custom CSS matching inera.ag design

## Domain
- Production: https://avantra.co

---

## What's Been Implemented

### cPanel Deployment Package (December 2025)
- [x] Converted from MongoDB to **MySQL** database
- [x] Created **Web-based Installation Wizard** at `/api/install`
- [x] Created `passenger_wsgi.py` for cPanel Python App
- [x] Created `.htaccess` for Apache routing
- [x] Created `build_cpanel.sh` build script
- [x] Created `CPANEL_INSTALL.md` documentation
- [x] Generated `avantra_cpanel_deploy.zip` deployment package

### Installation Wizard Features
- Site URL configuration
- MySQL database connection (host, port, name, user, password)
- Admin password setup
- Automatic table creation
- Config file generation

### Design System (December 2025)
- [x] Complete CSS redesign matching inera.ag style
- [x] Montserrat font family
- [x] Black/white/green color scheme
- [x] Transparent navbar on homepage (turns solid on scroll)
- [x] Full-screen hero slider with fade transitions
- [x] Black product category cards (2x2 grid)
- [x] Stats section with green numbers and + suffix
- [x] Technology section (black background, numbered cards)

### Homepage
- [x] Full-screen hero slider with auto-rotation
- [x] Navigation arrows and pagination dots
- [x] Product category cards
- [x] Stats: 12K+ Farmers, 50+ Dealers, 15+ Products, 10+ States
- [x] Phytocode Technology section
- [x] Featured Products grid
- [x] CTA section

### Products Page
- [x] Dark hero header
- [x] Sticky filter bar with category tabs
- [x] 4-column product grid
- [x] Category filtering

### Product Detail Page
- [x] Dark green gradient hero section
- [x] Download Product Manual button
- [x] Download Leaflet button
- [x] Benefits/Advantages list
- [x] How It Works numbered steps
- [x] Composition table
- [x] Sidebar cards (Growth Stages, Dosage, Contact CTA)
- [x] Related Products section

### Admin Panel
- [x] Secure login
- [x] Products management with 5 tabs (Basic, Composition, Details, Advantages, Downloads)
- [x] Gallery management
- [x] Blog/Media management
- [x] Video Testimonials management
- [x] Jobs management
- [x] Contact submissions
- [x] Dealer applications
- [x] Site Settings

### Other Pages
- [x] About Page
- [x] Contact Page
- [x] Dealers Page
- [x] Gallery Page
- [x] Media Center
- [x] Careers Page
- [x] Privacy Policy Page
- [x] Terms & Conditions Page

---

## Database Schema (MySQL)

### products
```sql
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    image_url TEXT,
    tagline JSON,
    overview JSON,
    composition JSON,
    how_it_works JSON,
    growth_stages JSON,
    dosage JSON,
    advantages JSON,
    crops TEXT,
    manual_url TEXT,
    leaflet_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME
);
```

### Other Tables
- `contacts`, `dealers`, `gallery`, `blog_posts`, `video_testimonials`, `jobs`, `job_applications`, `site_settings`

---

## cPanel Installation

1. Create MySQL database in cPanel
2. Setup Python App (3.9+) in cPanel
3. Upload `backend/` files to Python app root
4. Upload `frontend/` files to public_html
5. Install pip requirements
6. Visit `/api/install` to run installation wizard
7. Enter database credentials and admin password
8. Click "Install Avantra Chemicals"

See `CPANEL_INSTALL.md` for detailed instructions.

---

## Files

### Deployment Package
- `/app/avantra_cpanel_deploy.zip` - Ready to deploy

### Key Backend Files
- `server.py` - FastAPI application
- `models.py` - SQLAlchemy models
- `passenger_wsgi.py` - cPanel entry point
- `requirements.txt` - Python dependencies

### Configuration Files (Created by Installer)
- `config.json` - Database credentials and settings
- `.installed` - Installation flag

---

## Future Tasks

### P1 - High Priority
- [ ] Add seed data for initial products
- [ ] SEO Optimization

### P2 - Medium Priority
- [ ] Add real product images
- [ ] Add real testimonial videos
- [ ] Email notifications for contact forms

### P3 - Low Priority
- [ ] Accessibility review
- [ ] Performance optimization

---

## Test Status
- Backend: Converted to MySQL with SQLAlchemy
- Installation Wizard: Working at `/api/install`
- Build Script: Creates valid deployment package

## Admin Access
- URL: `https://avantra.co/admin`
- Password: Set during installation
