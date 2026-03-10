# Avantra Chemicals Pvt Ltd - Website PRD

## Original Problem Statement
Build a complete, production-ready multipage website for Avantra Chemicals Pvt Ltd with:
- React (Frontend), FastAPI (Backend), MySQL (Database)
- A premium dark theme design inspired by inera.ag
- Full CMS capabilities - every piece of text, image, button, and SEO metadata is editable through admin panel
- Multilingual support: English, Hindi, Telugu, Kannada
- Deployable on cPanel via installation wizard

## Technology Stack
- **Frontend:** React, React Router, React Context API, Shadcn UI, Lucide Icons
- **Backend:** FastAPI, SQLAlchemy, PyJWT
- **Database:** MySQL (with static fallback for dev/preview)
- **Deployment:** cPanel with Phusion Passenger

## Core Architecture
```
/app
├── backend/
│   ├── server.py          # FastAPI with MySQL + fallback
│   ├── models.py          # SQLAlchemy models for CMS
│   └── static/installer.html
├── frontend/src/
│   ├── App.js             # Routes with conditional admin layout
│   ├── context/
│   │   ├── ContentContext.js  # Central CMS data fetching
│   │   └── LanguageContext.js # Language management
│   ├── components/
│   │   ├── Navbar.js      # Uses ContentContext
│   │   ├── Footer.js      # Uses ContentContext + getText
│   │   └── admin/
│   │       └── TranslatableField.js  # Reusable i18n input
│   └── pages/
│       ├── HomePage.js      # CMS dynamic content
│       ├── AboutPage.js     # CMS dynamic content
│       ├── ProductsPage.js  # CMS dynamic content
│       ├── ContactPage.js   # CMS dynamic content
│       ├── DealersPage.js   # CMS dynamic content
│       ├── CareersPage.js   # CMS dynamic content
│       ├── GalleryPage.js   # CMS dynamic content
│       ├── MediaCenterPage.js # CMS dynamic content
│       ├── ProductDetailPage.js # CMS + SEO
│       └── AdminPage.js     # Full CMS admin panel
```

## What's Been Implemented (as of Mar 10, 2026)

### P0 - Critical
- [x] Full frontend redesign matching inera.ag aesthetic
- [x] Database migration from MongoDB to MySQL
- [x] Static fallback mechanism for dev/preview environments
- [x] Fixed "blank screen" rendering issue (translation objects as React children)
- [x] All 8 public pages render correctly with CMS content
- [x] Comprehensive Admin Panel with 11 management tabs:
  - Pages (edit content + SEO for all 8 pages)
  - Products (CRUD with translations)
  - Categories (translatable names/descriptions)
  - Translations (UI labels with search/filter)
  - Gallery, Blog, Videos, Jobs (full CRUD)
  - Contacts, Dealers (view submissions)
  - Settings (branding, contact, social, SEO defaults)
- [x] All translatable fields support EN/HI/TE/KN tabs
- [x] Navbar/Footer hidden on admin page
- [x] All API endpoints handle db=None gracefully

### P1 - Completed
- [x] cPanel deployment solution with installation wizard
- [x] Deployment package (avantra_cpanel_deployment.zip)
- [x] INSTALLATION_GUIDE.md
- [x] Product detail pages with SEO (react-helmet)
- [x] Language switcher in navbar

## Remaining Tasks

### P1 - Testing & Validation
- [ ] End-to-end CMS testing with real MySQL database
- [ ] Test admin panel CRUD operations with database connected
- [ ] Test cPanel deployment package on actual hosting

### P2 - Enhancements
- [ ] Image upload functionality in admin panel (currently URL-based)
- [ ] Rich text editor for blog content
- [ ] User roles (admin vs editor)
- [ ] Bulk import/export for products

### P3 - Polish
- [ ] SEO & accessibility final audit
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] Analytics dashboard in admin
- [ ] Email notifications for contact form/dealer applications
