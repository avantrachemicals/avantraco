# Avantra Chemicals Website - Product Requirements Document

## Original Problem Statement
Build a complete, production-ready multipage website for Avantra Chemicals Pvt Ltd, a leading manufacturer of biostimulants, water-soluble fertilizers, and other agricultural products based in Karnataka, India.

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB
- **Fonts**: Manrope, DM Sans, Space Grotesk
- **Design**: Vibrant green/lime theme with agricultural imagery

## Pages & Features

### Public Pages
1. **Home** (/) - Hero, Stats, Phytocode section, About teaser, Featured products, Testimonials, Video testimonials
2. **About** (/about) - Company info, Mission/Vision, Values, Phytocode, Timeline, Team
3. **Products** (/products) - Filterable grid (31 products), Search
4. **Product Detail** (/products/:slug) - Full product info with composition, how it works, advantages
5. **Gallery** (/gallery) - Photo gallery with category filters (factory, team, events, products)
6. **Media Center** (/media) - Blog posts with featured images, tags
7. **Blog Post** (/media/:slug) - Full blog post with content, links
8. **Dealers** (/dealers) - Static map, dealer application form
9. **Careers** (/careers) - Job listings
10. **Job Detail** (/careers/:jobId) - Application form with file uploads
11. **Contact** (/contact) - Contact form
12. **Terms** (/terms), **Privacy** (/privacy), **Corporate** (/corporate)

### Admin Panel (/admin)
- **Products Tab**: CRUD with enhanced form (Basic, Composition, Details, Advantages tabs)
- **Gallery Tab**: CRUD for gallery images with categories
- **Blog Tab**: CRUD for blog posts with links and tags
- **Videos Tab**: CRUD for video testimonials (YouTube/Vimeo/direct URLs)
- **Jobs Tab**: CRUD for job postings
- **Applications Tab**: View job applications with file downloads
- **Contacts Tab**: View contact submissions
- **Dealers Tab**: View dealer applications
- **Settings Tab**: Logo, Hero image, About image, Phytocode image, Social links

## API Endpoints

### Products
- GET/POST /api/products
- GET/PUT/DELETE /api/products/:id

### Gallery
- GET /api/gallery, GET /api/gallery?category=<cat>
- POST/PUT/DELETE /api/gallery/:id (admin)

### Blog
- GET /api/blog, GET /api/blog/:slug
- POST/PUT/DELETE /api/blog/:id (admin)

### Video Testimonials
- GET /api/testimonials/videos, GET ?featured_only=true
- POST/PUT/DELETE /api/testimonials/videos/:id (admin)

### Jobs & Applications
- GET/POST/PUT/DELETE /api/jobs
- POST /api/jobs/apply
- GET /api/jobs/applications/list (admin)

### Settings & Other
- GET/PUT /api/settings
- POST /api/contact, /api/dealers/apply
- POST /api/admin/login

## What's Been Implemented

### December 2025
- [x] Full 15-page website with responsive design
- [x] Multilingual support (EN, TE, KN, HI)
- [x] 31 products with complete multilingual content
- [x] **Logo integration** (Avantra logo in navbar)
- [x] **Gallery page** with category filters and lightbox
- [x] **Media Center/Blog** with post detail pages
- [x] **Video Testimonials** section on homepage (YouTube/Vimeo support)
- [x] **Enhanced product editing** (composition, how it works, growth stages, advantages)
- [x] **Phytocode Technology** detailed content on homepage
- [x] Jobs system with file upload applications
- [x] Admin panel with 9 management tabs
- [x] Site settings for images and social links

### Testing Status
- Backend: 63/63 tests passed (100%)
- Frontend: All features tested and working

## Credentials
- Admin Password: `avantra2024`

## File Structure
```
/app
├── backend/
│   ├── server.py         # All API endpoints
│   ├── seed_data.py      # 31 products
│   └── tests/            # API tests
├── frontend/
│   └── src/
│       ├── pages/        # 15 page components
│       ├── components/   # Navbar, Footer
│       ├── context/      # LanguageContext
│       └── data/         # translations
└── test_reports/         # Test results
```

## Backlog

### P1 (Nice to Have)
- [ ] Image upload directly in admin (currently URL-based)
- [ ] SEO meta tags and schema markup
- [ ] Product image gallery (multiple images per product)

### P2 (Future)
- [ ] Email notifications for form submissions
- [ ] Product comparison feature
- [ ] Newsletter subscription
