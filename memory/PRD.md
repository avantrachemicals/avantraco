# Avantra Chemicals Website - Product Requirements Document

## Original Problem Statement
Build a complete, production-ready multipage website for Avantra Chemicals Pvt Ltd, a leading manufacturer of biostimulants, water-soluble fertilizers, and other agricultural products based in Karnataka, India.

## User Personas
1. **Farmers**: Looking for product information, dosage, and composition details in their local language
2. **Dealers**: Interested in becoming distributors through the dealer application form
3. **Job Seekers**: Looking for career opportunities at Avantra
4. **Admin**: Company staff managing products, jobs, site settings, and viewing form submissions

## Core Requirements
- Multilingual support: English (default), Telugu, Kannada, Hindi
- Modern, minimalist, responsive design with vibrant green/lime color scheme
- Mobile-first design with Tailwind CSS
- Admin panel for managing all content
- Fast-loading, SEO-optimized

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB
- **Routing**: React Router
- **State Management**: React Context (LanguageContext)
- **Fonts**: Manrope (headings), DM Sans (body), Space Grotesk (accents)

## Pages & Features

### 1. Homepage (/)
- Hero section with dynamic hero image (configurable via admin)
- Stats section (dealers, farmers, acres, licenses)
- **NEW** Phytocode Technology section with detailed content about nano-encapsulation
- About teaser
- Featured products carousel
- Customer testimonials
- CTA section

### 2. About Page (/about)
- Company introduction and history
- Mission & Vision statements
- Core values
- Phytocode technology explanation
- Company timeline (2024-2025)
- Team and advisory board info

### 3. Products Page (/products)
- Filterable product grid (31 products)
- Categories: Biostimulants, Biofertilizers, Liquid Fertilizers, Micronutrients, Water Soluble
- Search functionality

### 4. Product Detail Page (/products/:slug)
- Product image
- Multilingual content: name, tagline, overview
- Composition table, How It Works, Growth Stages, Dosage, Advantages

### 5. Dealers Page (/dealers)
- Static dealer map placeholder (Karnataka & AP)
- Dealer application form

### 6. Contact Page (/contact)
- Contact form (saves to database)
- Corporate and factory addresses

### 7. **NEW** Careers Page (/careers)
- Job listings from admin
- "Why Join Us" section with benefits
- Links to individual job detail pages

### 8. **NEW** Job Detail Page (/careers/:jobId)
- Job description, requirements, responsibilities
- Application form with file uploads:
  - Name, Email, Phone, Address
  - Current Company, Current CTC
  - Passport photo (required)
  - Resume PDF (required)
  - Current payslip (optional)

### 9. **NEW** Terms Page (/terms)
- Terms & Conditions content

### 10. **NEW** Privacy Page (/privacy)
- Privacy Policy content

### 11. **NEW** Corporate Page (/corporate)
- Company overview, stats, registration info, addresses

### 12. Admin Panel (/admin)
- Password-protected (avantra2024)
- **Products Tab**: CRUD for products
- **NEW Jobs Tab**: Create/edit/delete job postings with active/inactive status
- **NEW Applications Tab**: View job applications with file attachments
- **Contacts Tab**: View contact form submissions
- **Dealers Tab**: View dealer applications
- **NEW Settings Tab**:
  - Site images: Hero image, Logo, About image, Phytocode image
  - Social media links: YouTube, Twitter, Instagram, Facebook, LinkedIn

## API Endpoints

### Products
- GET /api/products - List all products
- GET /api/products/:slug - Get single product
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Site Settings (NEW)
- GET /api/settings - Get site settings
- PUT /api/settings - Update settings (admin)

### Jobs (NEW)
- GET /api/jobs - List active jobs
- GET /api/jobs?active_only=false - List all jobs (admin)
- GET /api/jobs/:id - Get job by ID
- POST /api/jobs - Create job (admin)
- PUT /api/jobs/:id - Update job (admin)
- DELETE /api/jobs/:id - Delete job (admin)

### Job Applications (NEW)
- POST /api/jobs/apply - Submit application with file uploads
- GET /api/jobs/applications/list - List applications (admin)
- GET /api/jobs/applications/:id - Get application details (admin)
- PUT /api/jobs/applications/:id/status - Update status (admin)

### Other
- GET /api/stats - Get site statistics (now includes open_positions)
- POST /api/contact - Submit contact form
- GET /api/contact - List contacts (admin)
- POST /api/dealers/apply - Submit dealer application
- GET /api/dealers/applications - List applications (admin)
- POST /api/admin/login - Admin authentication
- POST /api/seed - Seed database

## What's Been Implemented

### Completed (December 2025)
- [x] Full application scaffolding (React + FastAPI + MongoDB)
- [x] All 12 pages with responsive design
- [x] Multilingual support (EN, TE, KN, HI)
- [x] Language switcher in navbar
- [x] 31 products with full multilingual content
- [x] Product filtering and search
- [x] Contact form with database storage
- [x] Dealer application form with database storage
- [x] Admin panel with authentication
- [x] Admin CRUD for products
- [x] **NEW** Admin Settings tab for site images and social links
- [x] **NEW** Admin Jobs tab for job postings CRUD
- [x] **NEW** Admin Applications tab for viewing job applications
- [x] **NEW** Careers page with job listings
- [x] **NEW** Job detail page with application form (file uploads)
- [x] **NEW** Terms, Privacy, Corporate pages
- [x] **NEW** Phytocode Technology section on homepage
- [x] **NEW** Row crops hero image
- [x] **NEW** Vibrant green/lime design theme
- [x] **NEW** Footer links to Terms, Privacy, Corporate
- [x] Database seeding via API

### Testing Status
- Backend: 42/42 tests passed (100%)
- Frontend: All features tested and working

## Backlog / Future Enhancements

### P1 (Nice to Have)
- [ ] Add more product images (some products show placeholder)
- [ ] SEO meta tags and schema markup
- [ ] Accessibility improvements (ARIA, contrast)
- [ ] Image upload directly in admin panel (currently URL-based)

### P2 (Future)
- [ ] Email notifications for form submissions
- [ ] Product comparison feature
- [ ] Farmer success stories section
- [ ] Gallery page with company photos
- [ ] Blog/News section

## Credentials
- Admin Password: `avantra2024`
- JWT Secret: `avantra-jwt-secret-2024`

## File Structure
```
/app
├── backend/
│   ├── server.py          # FastAPI application with all endpoints
│   ├── seed_data.py       # 31 products with multilingual content
│   └── tests/             # API tests
├── frontend/
│   ├── src/
│   │   ├── pages/         # All page components (12 pages)
│   │   ├── components/    # Navbar, Footer
│   │   ├── context/       # LanguageContext
│   │   └── data/          # translations.js
│   └── public/assets/     # Logo, product images
└── test_reports/          # Test results
```

## Design System
- Primary: #044736 (Forest Green)
- Secondary: #D9F99D (Lime)
- Accent: #8B5CF6 (Purple)
- Highlight: #F97316 (Orange)
- Background: #FAF9F6 (Stone White)
- Fonts: Manrope + DM Sans + Space Grotesk
